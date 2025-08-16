#!/bin/bash

echo "🚀 Deploying Reading Log Proofs to Aptos Mainnet..."

# Check if Aptos CLI is installed
if ! command -v aptos &> /dev/null; then
    echo "❌ Aptos CLI not found. Install from: https://aptos.dev/tools/aptos-cli/install-cli/"
    exit 1
fi

# Initialize account (if not already done)
echo "📝 Initializing Aptos account..."
aptos init --network mainnet --assume-yes

# Check balance
echo "💰 Checking account balance..."
aptos account list --query balance

# Deploy the contract
echo "📦 Publishing contract..."
aptos move publish --named-addresses reading_log=0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0 --assume-yes

echo "✅ Deployment complete!"
echo "🔍 View on explorer: https://explorer.aptoslabs.com/account/0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0?network=mainnet"