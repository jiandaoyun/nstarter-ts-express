VERSION = $(shell node -pe "require('./package.json').version")
DOCKER_IMG = app

build:
	npm run build

tslint:
	npm run tslint

test:
	npm test

serve:
	npm run serve

prepack:
	tar -czf ./build/release.tar.gz --files-from=./release_files.txt

docker-build:
	docker build \
		-t ${DOCKER_IMG}:${VERSION} \
		-t ${DOCKER_IMG}:latest \
		.

docker-image:
	docker run -it ${DOCKER_IMG} sh

clean:
	rm -rf .nyc_output/ coverage/ dist/ tmp/ build/
	rm -rf public/*

.PHONY: bulid tslint test serve clean
