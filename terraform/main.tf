module "event_rule_products" {
  source = "./event-rule-products"

  project    = local.project
  role_arn   = data.aws_ssm_parameter.lambda_role_arn.value
  stage      = local.stage
  aws_region = var.aws_region
  tags       = local.tags
}
