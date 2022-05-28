#! /usr/bin/env node

const { SigningStargateClient } = require("@cosmjs/stargate");
const { Registry, DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { MsgMintObit } = require('./generated/obit/tx')
const path = require('path')

const MissingWalletError = new Error("wallet is required");

const types = [
    ["/obadafoundation.fullcore.obit.MsgMintObit", MsgMintObit],
];

const registry = new Registry(types);

const defaultFee = {
    amount: [],
    gas: "200000",
};

const txClient = async (wallet, { addr: addr } = { addr: process.env.NODE }) => {
    if (!wallet) throw MissingWalletError;

    let client;

    if (addr) {
        client = await SigningStargateClient.connectWithSigner(addr, wallet, { registry });
    } else {
        client = await SigningStargateClient.offline(wallet, { registry });
    }

    const { address } = (await wallet.getAccounts())[0];

    return {
        signAndBroadcast: (msgs, { fee, memo } = { fee: defaultFee, memo: "" }) => client.signAndBroadcast(address, msgs, fee, memo),
        msgMintObit: (data) => ({ typeUrl: "/obadafoundation.fullcore.obit.MsgMintObit", value: data })
    };
};

async function main() {
    const opts = process.argv.slice(2)

    if (opts.length !== 3) {
        printHelp()
        process.exit(1)
    }

    if (
        opts.includes('help') ||
        opts.includes('-h') ||
        opts.includes('--help')
    ) {
        printHelp()
        process.exit(0)
    }

    const [serialNumber, manufacturer, partNumber] = opts
    const myWallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.MNEMONIC, { prefix: "obada" })
    const accounts = await myWallet.getAccounts()
    const client = await txClient(myWallet)
    
    const msg = MsgMintObit.fromJSON({
        creator: accounts[0].address,
        serialNumberHash: serialNumber,
        manufacturer: manufacturer,
        partNumber: partNumber
    })

    const msgRoute = await client.msgMintObit(msg)
    const result = await client.signAndBroadcast([msgRoute])

    console.log(result)
    process.exit(0)
}

function printHelp() {
    console.log("Usage: \n" + path.basename(process.argv[1]) + ' <serialNumber> <manufacturer> <partNumber>')
}

main()