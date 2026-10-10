# DeployFlow submission checklist

Status on 16 October 2026. Items marked **verified** were executed on this machine. Cloud-only items remain pending because usable AWS credentials and a destination GitHub repository were not supplied.

## Application and testing

- [x] **Verified:** FastAPI `/health` returns `UP`.
- [x] **Verified:** `/ready` reaches PostgreSQL.
- [x] CRUD and stats endpoints implemented for the original DeployFlow domain.
- [x] Alembic migration creates the `deployments` table.
- [x] Responsive React interface calls the API.
- [x] **Verified:** nine Pytest cases pass with an isolated in-memory database.
- [x] **Verified:** Ruff reports no violations.
- [x] Application and Swagger screenshots captured.

## Git, Docker, and CI/CD

- [x] Local Git repository created on branch `devops-final-project` without the source repository history.
- [x] `.gitignore` excludes credentials, virtual environments, caches, dependencies, Terraform state, and plans.
- [x] Backend and frontend Dockerfiles build.
- [x] Both application images run as non-root users.
- [x] **Verified:** Compose starts PostgreSQL, backend, and frontend; all three are healthy/running.
- [x] Workflow tests code, builds both images, scans both images, pushes SHA tags, and deploys with Helm.
- [x] Trivy action pinned to a verified immutable commit and configured to fail on HIGH/CRITICAL findings.
- [ ] Push the prepared history to a student-owned public GitHub repository.
- [ ] Capture the successful GitHub Actions URL and GHCR package page after the first push to `main`.

## Terraform and AWS

- [x] Two-AZ VPC, two public subnets, two private subnets, NAT gateway, EKS, and a managed node group defined.
- [x] `terraform.tfvars.example` contains no credentials.
- [x] **Verified:** `terraform init` completes.
- [x] **Verified:** `terraform validate` reports a valid configuration.
- [ ] Run `terraform plan` with valid AWS credentials and capture the non-empty plan.
- [ ] Apply the plan, capture the VPC and EKS console pages, then deploy the Helm release.
- [ ] Run and capture `terraform destroy` after evaluation to avoid ongoing charges.

## Kubernetes, Helm, and observability

- [x] **Verified locally on kind:** namespace applies.
- [x] **Verified locally on kind:** Helm release deployed successfully.
- [x] **Verified locally on kind:** two backend and two frontend replicas are `Running`.
- [x] **Verified locally on kind:** backend and frontend use `ClusterIP` Services.
- [x] Ingress routes `/api` to the backend and `/` to the frontend.
- [x] **Verified locally on kind:** application works through the Kubernetes frontend Service.
- [x] **Verified locally on kind:** Prometheus discovers both backend pods; both targets are `UP`.
- [x] **Verified locally on kind:** Grafana dashboard shows live endpoint traffic and request totals.
- [x] Kubernetes application, Prometheus, and Grafana screenshots captured.

## Presentation

- [x] Root README explains the original application and full delivery path.
- [x] Presentation notes include a timed demonstration sequence.
- [x] Final slide deck includes genuine screenshots from this run.
- [ ] Insert GitHub Actions, GHCR, AWS Console, Terraform plan, and Terraform destroy screenshots after those external steps are completed.
