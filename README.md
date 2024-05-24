# PowerBoard Payment Connector

## Overview

The PowerBoard Payment Connector facilitates integration between commercetools and PowerBoard, allowing for efficient management of payment processes. This repository is divided into two main modules:

- **Extension Module**: Serves as middleware, linking commercetools with PowerBoard. Configured to trigger on payment creation or updates within commercetools, it ensures these events are appropriately handled by PowerBoard.

- **Notification Module**: Handles asynchronous notifications from PowerBoard regarding payment status changes (e.g., authorization, charge, refund). This module updates the corresponding payment status in commercetools.

Both modules are essential for the seamless integration of commercetools and PowerBoard.

## Prerequisites

Ensure you have the following prerequisites before proceeding with installation:

- Docker installed on your machine.
- An active commercetools account with API credentials.
- Git installed on your machine.

## Installation Instructions

### Step 1: Clone the Repository

```
git clone https://github.com/PayDock/e-commerce-powerboard-commercetools-payment-connector
```


### Step 2: Configure Environment Variables

#### For the Extension Module
Navigate to the extension directory and set up the environment variables:

```
cd e-commerce-commercetools-payment-connector/extension
echo 'PowerBoard_INTEGRATION_CONFIG={
   "clientId":"[YOUR_CLIENT_ID]",
   "clientSecret":"[YOUR_CLIENT_SECRET]",
   "projectKey":"[YOUR_PROJECT_KEY]",
   "apiUrl":"https://api.[REGION_ID].gcp.commercetools.com",
   "authUrl":"https://auth.[REGION_ID].gcp.commercetools.com"
}' > .env
```


Replace the placeholder values with your actual Commercetools API credentials.


#### For the Notification Module
Navigate to the notification directory and set up the environment variables:

```
cd e-commerce-commercetools-payment-connector/notification
echo 'PowerBoard_INTEGRATION_CONFIG={
   "clientId":"[YOUR_CLIENT_ID]",
   "clientSecret":"[YOUR_CLIENT_SECRET]",
   "projectKey":"[YOUR_PROJECT_KEY]",
   "apiUrl":"https://api.[REGION_ID].gcp.commercetools.com",
   "authUrl":"https://auth.[REGION_ID].gcp.commercetools.com"
}' > .env
```

Replace the placeholder values with your actual Commercetools API credentials.


### Step 3: Run the Application
Launch the Docker container with the following command:

```
    docker run
```

- The Extension Module will be accessible at: http://your_domain:8082
- The Notification Module will be accessible at: http://your_domain:8083

