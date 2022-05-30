This repo shows how to use the integration with OBADA Node over gRPC and with usign generated protobuf files with `buf`. The technical details about how proto files are generated hidden in [Makefile](https://github.com/obada-foundation/nodewithgrpc/blob/main/Makefile#L24-L30).

## Installation
```sh
    make install
```

This command will install node dependencies and generate code from proto files located on `buf.build/obada/fullcore` as result `generated` folder should appear in your project.

## Testing
Before testing please make sure that your wallet is populated with OBD tokens, you can obtain them at [faucet](https://faucet.obada.io/) application. With generated files you can test a little script that minting an OBIT.

```sh
make run

{
  code: 0,
  height: 1620341,
  rawLog: '[{"events":[{"type":"message","attributes":[{"key":"action","value":"mint_obit"}]}]}]',
  transactionHash: '58C9AA0B719092831DDFCE9F1F75CAEF895FD5571927792221F24E78AD922641',
  gasUsed: 58440,
  gasWanted: 200000
}
```

You can also run this script agaist custom node or with custom wallet:

```sh
NODE="34.45.4.1" make run
MNEMONIC="your mnemonic words should be there" make run
NODE="34.45.4.1" MNEMONIC="your mnemonic words should be there" make run
```
