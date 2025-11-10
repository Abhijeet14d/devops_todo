variable "region" {
  type    = string
  default = "us-east-1"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "key_name" {
  type        = string
  description = "Existing AWS key pair name"
}

variable "project" {
  type    = string
  default = "devopsapp"
}

variable "allowed_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed inbound"
  default     = ["0.0.0.0/0"]
}
