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

# variable "aws_region" {
#   description = "EC2 created."
#   default     = "ap-southeast-2" #  region
# }

# variable "instance_ami" {
#   description = "The AMI ID for the EC2 instance."
#   default     = "ami-0611295b922472c22" #   AMI ID
# }

# variable "instance_type" {
#   description = "The type of the EC2 instance."
#   default     = "t2.micro" #  instance type
# }


output "public_ip" {
  value       = aws_instance.EC2-create-from-button.public_ip
  description = "Public IP Address of EC2 instance"
}

output "instance_id" {
  value       = aws_instance.EC2-create-from-button.id
  description = "Instance ID"
}