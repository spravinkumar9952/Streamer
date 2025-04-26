# Streamer Kubernetes Deployment

This directory contains Kubernetes configuration files for deploying the Streamer application.

## Prerequisites

-   Kubernetes cluster
-   kubectl configured to access the cluster
-   Docker image `spravinkumar9952/streamer:v1` available in the cluster

## Configuration

1. Update the `secrets.yaml` file with base64-encoded values for:

    - JWT_SECRET
    - GOOGLE_CLIENT_ID
    - GOOGLE_CLIENT_SECRET
    - MONGODB_URI
    - REDIS_URL

    To generate base64-encoded values:

    ```bash
    echo -n "your-secret" | base64
    ```

2. Update the `configmap.yaml` file if you need to change any non-sensitive configuration.

## Deployment

1. Create the namespace:

    ```bash
    kubectl apply -f namespace.yaml
    ```

2. Create the secrets:

    ```bash
    kubectl apply -f secrets.yaml
    ```

3. Create the configmap:

    ```bash
    kubectl apply -f configmap.yaml
    ```

4. Deploy MongoDB:

    ```bash
    kubectl apply -f mongodb-deployment.yaml
    kubectl apply -f mongodb-service.yaml
    ```

5. Deploy Redis:

    ```bash
    kubectl apply -f redis-deployment.yaml
    kubectl apply -f redis-service.yaml
    ```

6. Deploy the backend:
    ```bash
    kubectl apply -f backend-deployment.yaml
    kubectl apply -f backend-service.yaml
    ```

## Verification

1. Check the status of all pods:

    ```bash
    kubectl get pods -n streamer
    ```

2. Check the status of all services:

    ```bash
    kubectl get svc -n streamer
    ```

3. Check the logs of a specific pod:
    ```bash
    kubectl logs -n streamer <pod-name>
    ```

## Scaling

To scale the backend:

```bash
kubectl scale deployment streamer-backend -n streamer --replicas=3
```

## Cleanup

To delete all resources:

```bash
kubectl delete namespace streamer
```
