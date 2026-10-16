# DeployFlow presentation notes

Target duration: 8 to 10 minutes.

## 1. Problem and application

DeployFlow gives release operators one place to track service versions, environment, owner, risk, and deployment state. Demonstrate the dashboard and create-deployment modal. Point out that this is an original domain rather than a renamed task list.

## 2. API and data

Open Swagger UI. Show health, database-aware readiness, Prometheus metrics, and CRUD endpoints. Explain that Alembic owns the `deployments` table and PostgreSQL persists the records.

## 3. Quality gate

Run `pytest -v` from `backend/` and show nine passing tests. Explain that tests override the database dependency with in-memory SQLite. Run `ruff check app tests` and then build the frontend.

## 4. Containers and CI/CD

Show the three running Compose services and the non-root `USER` instructions. In GitHub Actions, trace the sequence from tests to builds, Trivy scans, GHCR pushes, and Helm deployment. Point out the Git SHA in both image tags.

## 5. Infrastructure and Kubernetes

Explain the two-AZ VPC, public and private subnets, NAT gateway, EKS control plane, and managed worker nodes. Show the Helm release, two frontend pods, two backend pods, PostgreSQL, ClusterIP Services, and Ingress routes.

## 6. Observability

Show both backend targets as `UP` in Prometheus. Open the Grafana dashboard and explain the request-rate spike produced by the load test and the endpoint labels in the legend.

## 7. Live change

Change a visible frontend label, commit with a meaningful message, and push to `main`. Follow the GitHub Actions run until the Helm job completes. Refresh DeployFlow and show the new label. Close by showing Prometheus and Grafana continuing to collect metrics.

## Likely questions

- **Why readiness and liveness?** Liveness decides when Kubernetes should restart a process. Readiness prevents traffic from reaching a pod that cannot query PostgreSQL.
- **Why SHA tags?** A SHA tag connects a running image to one immutable source revision and makes rollback auditable.
- **What did Trivy scan?** Operating-system packages and application dependencies inside each image. The pipeline stops on HIGH or CRITICAL findings.
- **Why private subnets for EKS nodes?** Nodes do not need unsolicited public ingress; the load balancer or ingress tier handles application traffic.
- **What happens after evaluation?** Run `terraform destroy` to remove EKS and NAT Gateway resources and stop AWS charges.
