# HERB Blockchain-Like Ledger System

A unified blockchain-like ledger system for tracking herbal products from farm to consumer across three portals: Farmer, Lab, and Manufacturer, with a Consumer portal for product traceability.

## 🏗️ System Architecture

- **Shared Ledger**: Single `ledger.json` file acting as a blockchain-like append-only database
- **Farmer Portal**: Records product details and generates batch IDs
- **Lab Portal**: Adds test results for farmer-submitted batches
- **Manufacturer Portal**: Processes tested batches and generates QR codes
- **Consumer Portal**: Scans QR codes or enters batch IDs to view complete product timeline

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install server dependencies
npm install

# Install portal dependencies
cd farmerportal && npm install
cd ../labportal && npm install  
cd ../manufportal && npm install
cd ../consumerportal && npm install
```

### 2. Start the System

```bash
# Start the main server (from root directory)
npm start
```

The server will start on `http://localhost:3001` and serve all portals:

- **Farmer Portal**: http://localhost:3001/farmer
- **Lab Portal**: http://localhost:3001/lab  
- **Manufacturer Portal**: http://localhost:3001/manufacturer
- **Consumer Portal**: http://localhost:3001/consumer

### 3. Development Mode

For development with hot reload, start each portal individually:

```bash
# Terminal 1 - Main server
npm start

# Terminal 2 - Farmer Portal
cd farmerportal && npm run dev

# Terminal 3 - Lab Portal  
cd labportal && npm run dev

# Terminal 4 - Manufacturer Portal
cd manufportal && npm run dev

# Terminal 5 - Consumer Portal
cd consumerportal && npm run dev
```

## 🔑 Demo Login Credentials

Login is verified server-side via `POST /auth/login` against hashed passwords in `users.json` (not hardcoded in the frontend):

| Portal | User ID | Password |
|---|---|---|
| Farmer | `FRM` | `pass123` |
| Lab | `LAB001` | `pass456` |
| Manufacturer | `MFR001` | `mfr789` |
| Consumer | — no login required — |

## 📋 Usage Workflow

### 1. Farmer Portal
- Enter product details (name, quantity, location, etc.)
- System auto-generates batch ID: `First3LettersOfFarmerID + StateCode + Date(DDMM) + ProductCode`
- Example: `SURTN1201NE` (Suresh from Tamil Nadu, 12th Jan, Neem)
- Data is appended to `ledger.json`

### 2. Lab Portal
- Search for batch ID from farmer submissions
- Enter test results (moisture, pesticide levels, quality grade, etc.)
- Data is appended to `ledger.json` for that batch ID

### 3. Manufacturer Portal
- View only tested batches (from ledger)
- Select tested batches for manufacturing
- Enter product type, ingredients, manufacturing details
- Generate QR code containing batch ID and manufacturing info
- Data is appended to `ledger.json`

### 4. Consumer Portal
- Scan QR code or enter batch ID manually
- View complete timeline:
  - 🌱 Farm stage (product, location, farmer)
  - 🧪 Lab stage (test results, quality grade)
  - 🏭 Manufacturing stage (product type, ingredients, company)

## 🔧 Technical Details

### Ledger Structure
```json
{
  "batchId": "SURTN1201NE",
  "stage": "farmer|lab|manufacturer", 
  "data": { /* stage-specific data */ },
  "addedBy": "User Name",
  "timestamp": "2025-09-28T12:30:00Z"
}
```

### API Endpoints
- `POST /api/ledger/add` - Add new event to ledger
- `GET /api/ledger/events/:batchId` - Get all events for a batch
- `GET /api/ledger/events` - Get all events
- `GET /api/ledger/tested-batches` - Get list of tested batch IDs

### Batch ID Format
`[FarmerID(3)] + [StateCode(2)] + [Date(DDMM)] + [ProductCode(2-3)]`

Examples:
- `SURTN1201NE` - Suresh, Tamil Nadu, 12th Jan, Neem
- `RAMKL1502TU` - Ram, Kerala, 15th Feb, Tulsi
- `KIRKA2003AV` - Kiran, Karnataka, 20th Mar, Aloe Vera

## 🎯 Key Features

- **Append-Only Ledger**: Immutable blockchain-like data storage
- **Real-time Updates**: All portals read/write to shared ledger
- **QR Code Generation**: Manufacturer creates QR codes with batch tracking
- **Complete Traceability**: Consumer can see full product journey
- **Clean UI**: Modern, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 📁 Project Structure

```
herb/
├── ledger.json              # Shared blockchain-like ledger
├── ledgerService.ts         # Ledger service for Node.js
├── server.js               # Main Express server
├── package.json            # Server dependencies
├── farmerportal/           # Farmer portal (React + Vite)
├── labportal/             # Lab portal (React + Vite)  
├── manufportal/           # Manufacturer portal (React + Vite)
└── consumerportal/        # Consumer portal (React + Vite)
```

## 🔍 Testing the System

1. **Start the server**: `npm start`
2. **Open Farmer Portal**: Add a new product entry
3. **Open Lab Portal**: Test the batch from step 2
4. **Open Manufacturer Portal**: Manufacture the tested batch
5. **Open Consumer Portal**: Enter the batch ID to see complete timeline

## 🛠️ Development Notes

- All portals use React + Vite + TypeScript
- Shared ledger service handles all data operations
- QR codes contain batch ID for consumer lookup
- Timeline view shows premium stepper-style interface
- Error handling and loading states included
- Responsive design for mobile and desktop

## 📱 Mobile Support

All portals are fully responsive and work on mobile devices. The Consumer Portal is optimized for mobile QR scanning (camera integration can be added).

## 🔒 Security Considerations

Login is now backend-verified with bcrypt-hashed passwords (`POST /auth/login`), but this remains a simple credential check, not a production auth system. For production use, consider:
- Session/token-based authentication (JWT, refresh tokens)
- Data encryption
- Input validation and sanitization
- Rate limiting
- HTTPS enforcement
- Database backup and recovery

