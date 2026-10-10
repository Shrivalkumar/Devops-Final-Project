variable "aws_region" {
  description = "AWS region for the DeployFlow platform"
  type        = string
  default     = "ap-south-1"
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "deployflow-eks"
}

variable "environment" {
  description = "Environment tag applied to all resources"
  type        = string
  default     = "dev"
}

variable "kubernetes_version" {
  description = "EKS Kubernetes version in standard support"
  type        = string
  default     = "1.36"
}
