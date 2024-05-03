ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
include .env

helm:
	helm package -d ${ROOT_DIR}/bin/ ${ROOT_DIR}/_deployment/helm

docker:
	docker build -t ${DOCKER_IMAGE} -f gigo-ui/Dockerfile gigo-ui

docker-push:
	docker push ${DOCKER_IMAGE}
