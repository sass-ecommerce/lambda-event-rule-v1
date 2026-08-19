variable "aws_region" {
  type = string
}

variable "project" {
  type        = string
  description = "Prefijo corto del proyecto, usado en nombres de recursos"
}

variable "project_name" {
  type        = string
  description = "Nombre completo del proyecto, usado en tags"
}

variable "repository" {
  type        = string
  description = "Nombre del repositorio de código fuente"
}

variable "environment" {
  type        = string
  description = "Ambiente al que se despliega (dev, staging, prod)"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "El valor de environment debe ser dev, staging o prod."
  }
}
