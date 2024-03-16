include .env

attach-bq-role:
	gcloud projects add-iam-policy-binding $(PROJECT_ID) \
		--member=serviceAccount:$(CLOUDRUN_SERVICE_ACCOUNT) \
		--role=roles/bigquery.dataEditor

create-ar-repo:
	gcloud artifacts repositories create $(ARTIFACT_REPO) \
		--location=$(LOCATION) \
		--repository-format=Docker \
		--project=$(PROJECT_ID)

prd-build:
	gcloud builds submit --tag $(LOCATION)-docker.pkg.dev/$(PROJECT_ID)/$(ARTIFACT_REPO)/prd:latest \
		--project=$(PROJECT_ID)

prd-deploy:
	gcloud run deploy $(CLOUDRUN_NAME) --port $(PORT) \
		--image $(LOCATION)-docker.pkg.dev/$(PROJECT_ID)/$(ARTIFACT_REPO)/prd:latest \
		--allow-unauthenticated \
		--region=$(LOCATION) \
		--project=$(PROJECT_ID) \
		--set-env-vars="LINE_CHANNEL_ACCESS_TOKEN"="$(LINE_CHANNEL_ACCESS_TOKEN)","LINE_CHANNEL_SECRET"="$(LINE_CHANNEL_SECRET)"
