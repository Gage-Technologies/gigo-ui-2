
docker:
	docker build -t gigodev/gigo-ui:dev -f gigo-ui/Dockerfile gigo-ui

docker-push:
	docker push gigodev/gigo-ui:dev
