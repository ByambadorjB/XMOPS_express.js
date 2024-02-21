#!/bin/bash

# Install Node.js (if not already installed)
# This assumes you are using a package manager like apt or brew to install Node.js
# Adjust the installation command based on your system
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Installing Node.js..."
    # Add the installation command here (e.g., using apt, brew, or nvm)
    # For example:
    # sudo apt install nodejs
    # or
    # brew install node
    # or
    # curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    # nvm install node
else
    echo "Node.js is already installed."
fi

# Initialize a new Node.js project with default settings
echo "Initializing Node.js project..."
npm init -y

# Install Express.js and aws-sdk packages
echo "Installing dependencies: Express.js and aws-sdk..."
npm install express aws-sdk
