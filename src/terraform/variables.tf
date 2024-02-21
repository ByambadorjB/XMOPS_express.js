variable "aws_region" {
    default     = "ap-southeast-2" #  region
  description = "AWS region to launch the EC2 instance"
}

variable "ami_id" {
    default     = "ami-04f5097681773b989" #   AMI ID
  description = "AMI ID of the EC2 instance"
}

variable "instance_type" {
    default     = "t2.micro" #  instance type
  description = "Instance type of the EC2 instance"
}



output "public_ip" {
  value       = aws_instance.EC2-create-from-button.public_ip
  description = "Public IP Address of EC2 instance"
}

output "instance_id" {
  value       = aws_instance.EC2-create-from-button.id
  description = "Instance ID"
}