prd-build:
	docker build -t linebot-googlecloud-sample .

prd-up:
	docker run --init -it --rm --name lgs-prd -p 3000:3000 --env-file ./.env linebot-googlecloud-sample