node_modules: package.json
	npm install
	touch node_modules

deps: node_modules

build: deps
	npm run build

lint:
	npm run lint

test:
	npm run test

ci: lint tests

deploy: build
	node_modules/.bin/ipfs-deploy dist -d dreamhost
