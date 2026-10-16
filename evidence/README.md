# Evidence inventory

These screenshots were captured from services running on the local machine on 16 October 2026.

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

Because direct automation of the macOS Terminal window is restricted, the terminal-style PNGs render the exact successful command output captured from this workspace in a dedicated local evidence page. They are not simulated cloud state. Command logs in `logs/` provide the corresponding plain-text records.

Cloud screenshots cannot be produced honestly until the project is pushed to the student's GitHub repository and valid AWS credentials are available.
