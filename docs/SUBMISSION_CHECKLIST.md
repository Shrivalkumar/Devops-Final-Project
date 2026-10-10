# DeployFlow submission checklist

Status on 16 October 2026. Items marked **verified** were executed on this machine. Only GitHub publishing remains pending because no destination repository was supplied.

## Application and testing

- [x] **Verified:** FastAPI `/health` returns `UP`.
- [x] **Verified:** `/ready` reaches PostgreSQL.
- [x] CRUD and stats endpoints implemented for the original DeployFlow domain.
- [x] Alembic migration creates the `deployments` table.
- [x] Responsive React interface calls the API.
- [x] **Verified:** nine Pytest cases pass with an isolated in-memory database.
- [x] **Verified:** Ruff reports no violations.
- [x] Application, Swagger, and passing-test command screenshots captured.

## Git, Docker, and CI/CD

- [x] Local Git repository created on branch `devops-final-project` without the source repository history.
- [x] `.gitignore` excludes credentials, virtual environments, caches, dependencies, Terraform state, and plans.
- [x] Backend and frontend Dockerfiles build.
- [x] Both application images run as non-root users.
- [x] **Verified:** Compose starts PostgreSQL, backend, and frontend; all three are healthy/running.
- [x] Compose build/runtime and clean local Trivy command screenshots captured.
- [x] Workflow tests code, builds both images, scans both images, pushes SHA tags, and deploys with Helm.
- [x] Trivy action pinned to a verified immutable commit and configured to fail on HIGH/CRITICAL findings.
- [ ] Push the prepared history to a student-owned public GitHub repository.
- [ ] Capture the successful GitHub Actions URL and GHCR package page after the first push to `main`.

## Terraform and AWS

- [x] Two-AZ VPC, two public subnets, two private subnets, NAT gateway, EKS, and a managed node group defined.
- [x] `terraform.tfvars.example` contains no credentials.
- [x] **Verified:** `terraform init` completes.
- [x] **Verified:** `terraform validate` reports a valid configuration.
- [x] **Verified:** Terraform produced a non-empty plan: 56 resources to add.
- [x] **Verified:** Terraform applied the two-AZ VPC and active EKS 1.36 cluster in `ap-south-1`.
- [x] **Verified:** two managed workers became Ready and the Helm release ran with two frontend and two backend replicas.
- [x] AWS Console, EKS command output, ELB, and live application screenshots captured.
- [x] **Verified:** Helm releases, load balancer, ECR repositories, and all Terraform-managed resources were destroyed after evidence capture.

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
- [x] Kubernetes pods/Services/Helm and `/metrics` command screenshots captured.

## Presentation

- [x] Root README explains the original application and full delivery path.
- [x] Presentation notes include a timed demonstration sequence.
- [x] Final slide deck includes genuine screenshots from this run.
- [x] Final deck includes AWS Console and live EKS application evidence.
- [ ] Insert GitHub Actions and GHCR screenshots after pushing to the student's repository.
