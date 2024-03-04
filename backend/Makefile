prd-build:
	docker build -t linebot-googlecloud-sample .

prd-up:
	make prd-build &&\
	docker run --init -it --name lgs-prd -p 3000:3000 --env-file ./.env linebot-googlecloud-sample

prd-bash:
	docker exec -it lgs-prd bash

prd-debug-bash:
	docker run --rm -it --entrypoint='' linebot-googlecloud-sample bash