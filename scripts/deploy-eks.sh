#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AWS_PROFILE_NAME="${AWS_PROFILE:-deployflow}"
AWS_REGION_NAME="${AWS_REGION:-ap-south-1}"
CLUSTER_NAME="${CLUSTER_NAME:-deployflow-eks}"
GITHUB_OWNER="${GITHUB_OWNER:?Set GITHUB_OWNER to the lowercase GitHub account or organization name}"
IMAGE_TAG="${IMAGE_TAG:?Set IMAGE_TAG to the successful Git commit SHA published by CI}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:?Set POSTGRES_PASSWORD in this shell; never commit it}"

for command_name in aws kubectl helm; do
  command -v "${command_name}" >/dev/null || {
    echo "Missing required command: ${command_name}" >&2
    exit 1
  }
done

aws sts get-caller-identity --profile "${AWS_PROFILE_NAME}" >/dev/null
aws eks update-kubeconfig \
  --profile "${AWS_PROFILE_NAME}" \
  --region "${AWS_REGION_NAME}" \
  --name "${CLUSTER_NAME}"

helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --wait \
  --timeout 15m

helm upgrade --install deployflow "${PROJECT_ROOT}/helm/deployflow" \
  --namespace deployflow \
  --create-namespace \
  --values "${PROJECT_ROOT}/helm/deployflow/values-prod.yaml" \
  --set backend.image="ghcr.io/${GITHUB_OWNER}/deployflow-backend" \
  --set frontend.image="ghcr.io/${GITHUB_OWNER}/deployflow-frontend" \
  --set backend.tag="${IMAGE_TAG}" \
  --set frontend.tag="${IMAGE_TAG}" \
  --set-string postgres.password="${POSTGRES_PASSWORD}" \
  --wait \
  --timeout 15m

kubectl get pods,svc,ingress -n deployflow
kubectl get svc ingress-nginx-controller -n ingress-nginx

echo "Wait for the ingress-nginx EXTERNAL-IP/hostname, then open it in a browser."
