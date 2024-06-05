# PowerBoard Payment Connector

## Overview

Integrate your commercetools with PowerBoard using the PowerBoard Payment Connector and efficiently manage your payment processes. This repository is divided into two main modules:

- **Extension Module**: Serves as middleware, linking commercetools with PowerBoard. This is configured to trigger on payment creation and updates within commercetools, ensuring efficient event handling by PowerBoard.

- **Notification Module**: Handles asynchronous notifications from PowerBoard regarding payment status changes such as authorization, charge, refund, and so on. This module updates the corresponding payment status in commercetools.

You must have both modules to integrate your commercetools and PowerBoard.

## Prerequisites

Ensure you have the following prerequisites before proceeding with installation:

- Docker and docker-compose installed on your machine.
- An active commercetools account with API credentials.
- Git installed on your machine.


## Install the Modules

You can install the modules using either `docker run...` or `docker-compose`. The following subsections detail both methods.

---
### Install with `docker run...`
---

1. Clone the Repository.

```
git clone https://github.com/PayDock/e-commerce-powerboard-commercetools-payment-connector
```

2. Navigate to the project-directory.

```
cd e-commerce-powerboard-commercetools-payment-connector
```

3. Configure the Environment Variables for your Extension Module and your Notification Module.

**Extension Module**

Navigate to the extension directory and configure the environment variables.

```
echo 'POWERBOARD_INTEGRATION_CONFIG={
   "clientId":"[YOUR_CLIENT_ID]",
   "clientSecret":"[YOUR_CLIENT_SECRET]",
   "projectKey":"[YOUR_PROJECT_KEY]",
   "apiUrl":"https://api.[REGION_ID].gcp.commercetools.com",
   "authUrl":"https://auth.[REGION_ID].gcp.commercetools.com"
}' > ./extension/.env
```


Replace the placeholder values with your Commercetools API credentials.

* **Notification Module** 

Navigate to the notification directory and set up the environment variables.

```
echo 'POWERBOARD_INTEGRATION_CONFIG={
   "clientId":"[YOUR_CLIENT_ID]",
   "clientSecret":"[YOUR_CLIENT_SECRET]",
   "projectKey":"[YOUR_PROJECT_KEY]",
   "apiUrl":"https://api.[REGION_ID].gcp.commercetools.com",
   "authUrl":"https://auth.[REGION_ID].gcp.commercetools.com"
}' > ./notification/.env
```

Replace the placeholder values with your Commercetools API credentials.

4. Build the Docker images and run the application.

Build the following Docker images:

- `docker build -t commercetools-payment-connector-extention -f cnf/extension/Dockerfile .`

- `docker build -t commercetools-payment-connector-notification -f cnf/notification/Dockerfile .`

5. Launch the Docker container with the following command:

- `docker run -e POWERBOARD_INTEGRATION_CONFIG=xxxxxx -p 8082:8082 commercetools-payment-connector-extention`

- `docker run -e POWERBOARD_INTEGRATION_CONFIG=xxxxxx -p 8443:8443 commercetools-payment-connector-notification`

6. Replace the placeholder `xxxxxx` for POWERBOARD_INTEGRATION_CONFIG variable  with your Json-escapes string.

The Extension Module is accessible at: http://your_domain:8082.

The Notification Module is accessible at: http://your_domain:8443.

---
### Install with `docker-compose`
---

1. Clone the Repository.

```
git clone https://github.com/PayDock/e-commerce-powerboard-commercetools-payment-connector
```

2. Navigate to the project-directory.
```
cd e-commerce-powerboard-commercetools-payment-connector
```

3. Configure Environment Variables for your Extension Module and your Notification Module.

* **Extension Module**

Navigate to the extension directory and set up the environment variables.

```
echo 'POWERBOARD_INTEGRATION_CONFIG={
   "clientId":"[YOUR_CLIENT_ID]",
   "clientSecret":"[YOUR_CLIENT_SECRET]",
   "projectKey":"[YOUR_PROJECT_KEY]",
   "apiUrl":"https://api.[REGION_ID].gcp.commercetools.com",
   "authUrl":"https://auth.[REGION_ID].gcp.commercetools.com"
}' > ./extension/.env
```

Replace the placeholder values with your Commercetools API credentials.

* **Notification Module**

Navigate to the notification directory and set up the environment variables.

```
echo 'POWERBOARD_INTEGRATION_CONFIG={
   "clientId":"[YOUR_CLIENT_ID]",
   "clientSecret":"[YOUR_CLIENT_SECRET]",
   "projectKey":"[YOUR_PROJECT_KEY]",
   "apiUrl":"https://api.[REGION_ID].gcp.commercetools.com",
   "authUrl":"https://auth.[REGION_ID].gcp.commercetools.com"
}' > ./notification/.env
```

Replace the placeholder values with your Commercetools API credentials.


4. Build the Docker images and run the application

* Replace the placeholder `xxxxxx` for the POWERBOARD_INTEGRATION_CONFIG variable in **./docker-compose.yml** with your Json-escapes string.


- Launch docker-compose. The docker images will build automatically:

```
    docker-compose up -d
```

The Extension Module is accessible at: http://your_domain:8082.

The Notification Module is accessible at: http://your_domain:8443.