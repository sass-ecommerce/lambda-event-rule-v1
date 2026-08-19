output "event_rule_products_lambda_name" {
  description = "Nombre de la Lambda event-rule-products"
  value       = module.event_rule_products.lambda_name
}

output "event_rule_products_rule_arn" {
  description = "ARN del EventBridge Rule de products"
  value       = module.event_rule_products.event_rule_arn
  sensitive   = true
}
