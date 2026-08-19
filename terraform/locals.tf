locals {
  stage   = var.environment
  project = var.project

  tags = {
    Project    = var.project_name
    Stage      = local.stage
    Repository = var.repository
    ManagedBy  = "terraform"
  }
}
