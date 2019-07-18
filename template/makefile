VERSION = $(shell node -pe "require('./package.json').version")
DOCKER_IMG = app

build:
	npm run build

eslint:
	npm run eslint

test:
	npm test

serve:
	npm run serve

zip: build
	zip -rq ./build/release.zip \
		public \
		resources \
		dist \
		tools \
		views \
		package*.json \
		*.md \
		LICENSE \
		makefile

docker-build: zip
	docker build \
		-t ${DOCKER_IMG}:${VERSION} \
		-t ${DOCKER_IMG}:latest \
		.

docker-image:
	docker run -it ${DOCKER_IMG} sh

clean:
	rm -rf .nyc_output/ coverage/ dist/ tmp/ build/
	rm -rf public/*

.PHONY: build lint test serve clean
