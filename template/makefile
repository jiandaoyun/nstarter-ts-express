VERSION = $(shell node -pe "require('./package.json').version")
DOCKER_IMG = app

docker-build:
	docker build --target=runtime \
		--progress=plain \
		-t ${DOCKER_IMG}:${VERSION} \
		-t ${DOCKER_IMG}:latest \
    	.

docker-test:
	docker build \
 		--target=archive \
 		--progress=plain \
 		--output type=local,dest=./ \
 		.

docker-image:
	docker run -it ${DOCKER_IMG} sh

clean:
	rm -rf .nyc_output/ coverage/ dist/ tmp/ build/ lint/
	rm -rf public/*

.PHONY: clean
