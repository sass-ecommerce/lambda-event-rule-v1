data "aws_ssm_parameter" "lambda_role_arn" {
  name = "/${local.stage}/${local.project}/iam/lambda-role-arn"
}
