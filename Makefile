MNEMONIC ?= "jazz know cigar whip soft list route dragon eye ten vague energy"
NODE ?= "node.alpha.obada.io:26657"

SHELL := /bin/sh

install: deps generate tsc

deps:
	docker run \
		-t \
		--rm \
		-w /src \
		-v $$(pwd):/src \
		 node:14-alpine npm install

tsc:
	docker run \
		-t \
		--rm \
		-w /src \
		-v $$(pwd):/src \
		 node:14-alpine npm run tsc

generate:
	docker run \
		-t \
		--rm \
		-v $$(pwd)/generated:/generated \
		-v $$(pwd)/buf.gen.yaml:/buf.gen.yaml \
		 bufbuild/buf:1.4.0 generate buf.build/obada/fullcore

run:
	docker run \
		-t \
		-e MNEMONIC=$(MNEMONIC) \
		-e NODE=$(NODE) \
		--rm \
		-w /src \
		-v $$(pwd):/src \
		 node:14-alpine sh -c 'UUID=$$(cat /proc/sys/kernel/random/uuid) && ./index.js SN$$UUID SONY PN$$UUID'

clean:
	rm -rf ./node_modules ./generated