# Deploy Reading Log Proofs to Aptos Mainnet

## Prerequisites
1. Install Aptos CLI: https://aptos.dev/tools/aptos-cli/install-cli/
2. Create/Import your wallet
3. Fund your wallet with APT for gas fees

## Step 1: Initialize Aptos Account
```bash
# Create new account (or import existing)
aptos init --network mainnet

# Check your account
aptos account list --query balance
```

## Step 2: Update Move.toml
Replace `reading_log = "_"` with your actual address:
```toml
[addresses]
reading_log = "0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0"
```

## Step 3: Deploy Contract
```bash
# From project root directory
aptos move publish --named-addresses reading_log=0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0

# If successful, you'll get a transaction hash
```

## Step 4: View on Explorer
After deployment, visit:
https://explorer.aptoslabs.com/account/0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0?network=mainnet

## Step 5: Update Web App
Update `app.js` line 2:
```javascript
const CONTRACT_ADDRESS = "0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0";
```

## Step 6: Test Functions
```bash
# Register a teacher
aptos move run --function-id 0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0::reading_log::register_teacher --args address:0xTEACHER_ADDRESS

# Log reading (as student)
aptos move run --function-id 0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0::reading_log::log_reading --args string:"Harry Potter" u64:150

# Verify reading (as teacher)
aptos move run --function-id 0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0::reading_log::verify_reading --args address:0xSTUDENT_ADDRESS u64:0
```

## Mainnet Considerations
- **Gas Costs**: Each transaction costs APT
- **Permanence**: Deployed contracts are immutable
- **Testing**: Test thoroughly on devnet first
- **Security**: Audit code before mainnet deployment

## Quick Deploy Commands
```bash
cd f:\hackthon\new
aptos init --network mainnet
aptos move publish --named-addresses reading_log=0xb630a3497a87676a6ee6002dd17261e1342379c869d7490053d64b0ab4171de0
```