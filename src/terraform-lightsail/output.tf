output "EIP" {
  description = "Lightsail EIP"
  value = aws_lightsail_static_ip.static_ip.ip_address
}

output "ssh_private_key" {
  description = "SSH Private Key"
  value       = tls_private_key.ssh_key.private_key_pem
  sensitive = true
}


## Output the WordPress admin username and password
# output "wordpress_credentials" {
#   description = "WordPress Admin Credentials"
#   //value       = file("wordpress_credentials")
#   value       = aws_lightsail_instance.lightsail_instance.public_ip_address
# }

