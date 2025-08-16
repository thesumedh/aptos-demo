# Reading Log Proofs - Aptos Hackathon

A blockchain-based reading tracking system for K-12 students where teachers verify reading activities and students earn badges and APT rewards.

## 🚀 Features

- **Student Reading Logs**: Log books with page counts
- **Teacher Verification**: Teachers verify and attest reading entries  
- **Badge System**: Earn badges every 100 verified pages
- **APT Rewards**: Get 10 APT tokens per badge earned
- **Dark Mode UI**: Modern Web3 interface

## 📱 Screenshots

*Add your screenshots here*

## 🛠️ Tech Stack

- **Smart Contract**: Aptos Move
- **Frontend**: HTML, CSS, JavaScript
- **Blockchain**: Aptos Network
- **Wallet**: Simulated wallet integration

## 🚀 Quick Start

### Deploy Contract
```bash
cd hackthon/new
aptos init --network devnet
aptos move publish --named-addresses reading_log=YOUR_ADDRESS
```

### Run Web App
```bash
cd web
python -m http.server 8080
```

Open: `http://localhost:8080`

## 📋 Smart Contract Functions

- `log_reading(book_title, pages_read)` - Students log books
- `verify_reading(student_addr, entry_index)` - Teachers verify entries
- `register_teacher(teacher_addr)` - Admin registers teachers
- `get_student_stats(student_addr)` - View reading statistics

## 🎯 Demo Flow

1. Connect wallet (simulated)
2. Log reading entries as student
3. Switch to teacher role
4. Verify student entries
5. Watch badges and APT rewards update automatically

## 🏆 Hackathon Project

Built for Aptos Hackathon - showcasing Move smart contracts, Web3 UI, and educational blockchain use cases.

## 📄 License

MIT License