# AWS access requirements

DeployFlow provisions a real two-AZ VPC, NAT gateway, EKS control plane, and two `t3.medium` worker nodes in `ap-south-1`. These resources incur charges. Use a lab/sandbox account and run `terraform destroy` immediately after the evaluation evidence is captured.

## What to provide

Do **not** paste keys into chat and do not put credentials in this repository. Configure one local AWS CLI profile, then provide only its profile name and confirm the target account ID and region.

Preferred authentication:

```bash
aws configure sso --profile deployflow
aws sso login --profile deployflow
aws sts get-caller-identity --profile deployflow
```

Access-key authentication also works with a short-lived lab credential set:

```bash
aws configure --profile deployflow
aws sts get-caller-identity --profile deployflow
```

Temporary credentials require the access key ID, secret access key, **and** session token in the local profile. Terraform uses the same profile through `AWS_PROFILE=deployflow`.

## IAM permissions

For a short-lived course sandbox, the reliable option is a dedicated role with `AdministratorAccess`, assumed only for this deployment and revoked afterward. This is broad, but it avoids partial applies caused by missing IAM/VPC/EKS permissions.

If the account owner requires a custom policy, the Terraform principal must be able to create, tag, describe, update, and delete resources in these service areas:

- **EC2/VPC:** VPCs, subnets, route tables/routes, internet gateways, elastic IPs, NAT gateways, security groups, network interfaces, launch templates, availability zones, and tags.
- **EKS:** clusters, add-ons, managed node groups, access entries/policy associations, updates, tags, and describe/list operations.
- **IAM:** create/delete/tag roles and policies; attach/detach policies; update trust policies; `iam:PassRole`; create/delete OpenID Connect providers; and `iam:CreateServiceLinkedRole` for EKS/EC2/Auto Scaling where absent.
- **Auto Scaling:** create/update/delete and describe the groups used by managed nodes.
- **STS:** `sts:GetCallerIdentity` and, when a role is used, `sts:AssumeRole`.
- **Elastic Load Balancing:** create/describe/delete/tag load balancers, listeners, target groups, and related networking objects for the NGINX ingress `LoadBalancer` Service.

The cluster and node roles created by the module receive the AWS-managed EKS policies they need. Those role policies are separate from the permissions of the human/Terraform principal creating them.

## Account prerequisites

- Region `ap-south-1` enabled, or approval to change `aws_region`.
- Capacity for one EKS cluster, at least two `t3.medium` On-Demand instances, five VPCs or an available VPC quota slot, NAT gateway/EIP capacity, and a public load balancer.
- No organization service-control policy or permissions boundary blocking IAM, EKS, EC2, Auto Scaling, or ELB creation.
- Billing permission is not technically required, but a budget/alarm is strongly recommended.

## Local tools

The required tools are already installed on this Mac:

- AWS CLI v2
- Terraform 1.16.6
- `kubectl` 1.34.1
- Helm 4.3.0
- Docker 29.4.2

No extra AWS package is required. The AWS provider and Terraform modules are downloaded by `terraform init`.

## Safe execution order

```bash
export AWS_PROFILE=deployflow
aws sts get-caller-identity
cd terraform
terraform init
terraform validate
terraform plan -out=deployflow.tfplan
terraform apply deployflow.tfplan
aws eks update-kubeconfig --region ap-south-1 --name deployflow-eks
```

After capturing the required application, VPC, EKS, node, and plan evidence, destroy everything:

```bash
cd terraform
AWS_PROFILE=deployflow terraform destroy
```

Review the destroy plan before approving it, and verify that the EKS cluster, NAT gateway, load balancer, and VPC are gone.
