# Evidence inventory

These screenshots were captured from verified local services, a temporary AWS EKS deployment, and the destination GitHub repository on 16 October 2026.

| File | Evidence |
| --- | --- |
| `deployflow-dashboard.jpg` | Working Compose application with PostgreSQL-backed records |
| `deployflow-create-deployment.jpg` | Create-deployment workflow |
| `deployflow-api-docs.jpg` | Swagger UI with health, readiness, metrics, and CRUD endpoints |
| `docker-compose-running.jpg` | Docker Desktop showing frontend, backend, and PostgreSQL running |
| `kubernetes-deployflow-app.jpg` | Application served from the local kind cluster |
| `prometheus-targets-up.jpg` | Prometheus ServiceMonitor with both backend replicas `UP` |
| `grafana-deployflow-dashboard.jpg` | Live request-rate and request-count panels |
| `terminal-pytest-passing.png` | Verified `pytest -v` result (9 passed) and Ruff result |
| `terminal-docker-compose.png` | Verified image builds and three-service Compose health |
| `terminal-kubernetes-helm.png` | Verified running pods, ClusterIP Services, and deployed Helm release |
| `terminal-prometheus-metrics.png` | Verified Prometheus text exposition from `/metrics` |
| `terminal-trivy-clean.png` | Verified zero HIGH/CRITICAL findings for both images |
| `terminal-git-history.png` | Twelve meaningful local commits before final evidence packaging |
| `terminal-terraform-aws-plan.jpg` | Successful Terraform validation and non-empty 56-resource AWS plan |
| `aws-eks-console-active.jpg` | AWS Console showing the active `deployflow-eks` cluster in Mumbai |
| `terminal-aws-eks-deployment.jpg` | Two Ready EKS nodes, five Running application pods, Helm release, and ELB hostname |
| `aws-eks-deployflow-app.jpg` | Populated DeployFlow dashboard served from the live EKS ingress |
| `terminal-terraform-destroy.jpg` | Successful Terraform teardown of all 56 managed resources |
| `github-actions-success.jpg` | Successful GitHub Actions run with test, build-scan-push, and deploy jobs |
| `github-ghcr-backend.jpg` | Public GHCR backend container package tagged with the immutable workflow commit SHA |

Because direct automation of the macOS Terminal window is restricted, the terminal-style images render the exact successful command output captured from this workspace in a dedicated local evidence page. They are not simulated cloud state. The AWS Console and application images are direct browser captures from the live deployment.

`github-actions-success.jpg` captures the completed GitHub Actions run: test, build-scan-push, and deploy jobs passed. `github-ghcr-backend.jpg` captures the public backend package with its immutable commit-SHA tag. The workflow run is available at <https://github.com/Shrivalkumar/Devops-Final-Project/actions/runs/38908686688>.
