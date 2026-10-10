# DeployFlow infrastructure

This folder provisions the AWS VPC and EKS cluster used by DeployFlow.

The module-based approach keeps the lesson focused on Terraform concepts: providers, variables, modules, state, plan/apply, outputs and dependency graphs.

> Cost warning: EKS and a NAT gateway incur AWS charges. Destroy the infrastructure immediately after evaluation.

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan -out=deployflow.tfplan
terraform apply deployflow.tfplan
aws eks update-kubeconfig --region ap-south-1 --name deployflow-eks
terraform destroy
```
