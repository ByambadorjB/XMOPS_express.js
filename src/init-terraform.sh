#!/bin/bash

# Get a list of all directories containing Terraform configuration files
directories=$(find . -type d -name "terraform" -o -name "terraform-lightsail")

#loop through each directory and run terraform init
for dir in $directories; do
    echo "Initaiting Terraform configuration in directory: $dir"
    (cd "$dir" && terraform init)
done
