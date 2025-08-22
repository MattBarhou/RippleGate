# 🎫 RippleGate - XRP Ledger Ticketing Platform

A **decentralized ticketing platform** built on the **XRP Ledger (XRPL)** that combines blockchain security with an intuitive user experience. Every ticket is minted as an NFT, providing cryptographic proof of authenticity and eliminating fraud.

## ✨ Key Features

🔐 **Blockchain Security** - Every ticket is an NFT on the XRP Ledger  
⚡ **Lightning Fast** - 3-4 second settlement times  
🚫 **Zero Fraud** - Immutable blockchain records  
💎 **True Ownership** - Users own their tickets as NFTs  
🎨 **Beautiful UI** - Modern, responsive design  
📊 **Real-time Analytics** - Live dashboard with purchase activity

## 🛠️ Technology Stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios  
**Backend:** Flask, SQLAlchemy, Flask-CORS, PyJWT  
**Blockchain:** XRP Ledger, xrpl-py, NFTokens

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python init_db.py
python -m app
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Backend: `http://localhost:5000` | Frontend: `http://localhost:5173`

## 🎯 Core Features

**Event Management**

- Create and manage events
- Browse upcoming events
- View event organizer profiles

**Ticket Operations**

- Secure XRP payments
- Automatic NFT minting
- Transaction verification via XRPL explorer

**User Experience**

- JWT authentication
- Personal dashboard with statistics
- Real-time activity feed
- Mobile-responsive design

## 🌐 XRPL Integration

1. **Purchase** → XRP payment transaction
2. **Mint** → Automatic NFToken creation
3. **Transfer** → Direct NFT to buyer's wallet
4. **Verify** → Immutable blockchain record

**Network:** XRPL Testnet | **Explorer:** [testnet.xrpl.org](https://testnet.xrpl.org)
