# Portal Structure Documentation

## Overview

This document provides a comprehensive guide to the structure and organization of the Farmer Portal and Lab Portal applications within the Blockchain-Based Ayurvedic Herb Traceability System.

---

## Table of Contents

1. [Farmer Portal Structure](#farmer-portal-structure)
2. [Lab Portal Structure](#lab-portal-structure)
3. [Key Differences Between Portals](#key-differences-between-portals)
4. [Theme Colors](#theme-colors)
5. [Technology Stack](#technology-stack)
6. [Summary](#summary)

---

## Farmer Portal Structure

The Farmer Portal allows farmers to register herb batches, track their status through the supply chain, manage orders, and access support resources.

```
farmerportal/
│
├── Configuration Files
│   ├── package.json                 # Project dependencies and scripts
│   ├── vite.config.js               # Vite build configuration
│   ├── tailwind.config.js           # TailwindCSS styling configuration
│   ├── postcss.config.js            # PostCSS processing configuration
│   ├── tsconfig.json                # TypeScript compiler configuration
│   └── index.html                   # HTML entry point
│
├── src/                             # Source code directory
│   │
│   ├── Entry Points
│   │   ├── main.jsx                 # Application entry point
│   │   ├── App.jsx                  # Root application component
│   │   └── index.css                # Global styles and TailwindCSS imports
│   │
│   ├── pages/                       # Main application pages
│   │   └── ReportIssue.jsx          # Multi-step issue reporting wizard
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── FarmerLogin.tsx          # Farmer authentication page
│   │   ├── Dashboard.tsx            # Main dashboard with batch overview
│   │   ├── FarmerForm.tsx           # Form for submitting new herb batches
│   │   ├── HelpSupport.jsx          # Help and support center with FAQs
│   │   ├── ReportIssue.jsx          # Issue reporting component
│   │   ├── Orders.tsx               # Order management and tracking
│   │   ├── Settings.tsx             # User settings and preferences
│   │   │
│   │   ├── Notification Components
│   │   │   ├── NotificationSidebar.jsx       # Sliding notification panel
│   │   │   ├── NotificationModal.jsx         # Detailed notification view
│   │   │   ├── NotificationItem.jsx          # Individual notification card
│   │   │   └── LoginNotificationPopup.jsx    # Welcome notification after login
│   │   │
│   │   ├── UI Components
│   │   │   ├── NavBar.tsx           # Top navigation bar
│   │   │   ├── SideNav.tsx          # Sidebar navigation menu
│   │   │   ├── Layout.tsx           # Page layout wrapper
│   │   │   ├── Card.tsx             # Reusable card component
│   │   │   ├── Button.tsx           # Reusable button component
│   │   │   ├── Badge.tsx            # Status badge component
│   │   │   └── Toast.tsx            # Toast notification component
│   │   │
│   │   └── Login.tsx                # Alternative login component
│   │
│   ├── orders/                      # Order-related pages and components
│   ├── approved/                    # Pages for approved batch management
│   ├── rejected/                    # Pages for rejected batch handling
│   ├── testing/                     # Testing status and tracking pages
│   ├── manufacturing/               # Manufacturing process pages
│   │
│   ├── locales/                     # Internationalization files
│   │   ├── en.json                  # English translations
│   │   ├── hi.json                  # Hindi translations
│   │   └── ta.json                  # Tamil translations
│   │
│   ├── utils/                       # Utility functions and helpers
│   ├── lib/                         # Third-party library configurations
│   ├── data/                        # Data management and state
│   │
│   ├── api.ts                       # API service layer for backend calls
│   ├── i18n.ts                      # Internationalization setup
│   ├── translations.js              # Translation helper functions
│   └── store.ts                     # State management store
│
├── dist/                            # Production build output
└── node_modules/                    # Installed dependencies
```

### Key Features

- **Batch Management**: Register and track herb batches through the supply chain
- **Order Tracking**: View and manage orders from manufacturers
- **Multi-language Support**: Interface available in English, Hindi, and Tamil
- **Real-time Notifications**: Stay updated on batch status changes
- **Issue Reporting**: Submit technical issues with file attachments
- **Help Center**: Access guides, FAQs, and support resources

---

## Lab Portal Structure

The Lab Portal enables laboratory technicians to test herb batches, record quality grades, manage test results, and generate analytical reports.

```
labportal/
│
├── Configuration Files
│   ├── package.json                 # Project dependencies and scripts
│   ├── vite.config.ts               # Vite build configuration (TypeScript)
│   ├── tailwind.config.cjs          # TailwindCSS styling configuration
│   ├── postcss.config.cjs           # PostCSS processing configuration
│   ├── tsconfig.json                # TypeScript compiler configuration
│   └── index.html                   # HTML entry point
│
├── src/                             # Source code directory
│   │
│   ├── Entry Points
│   │   ├── main.tsx                 # Application entry point (TypeScript)
│   │   ├── App.tsx                  # Root application component
│   │   └── index.css                # Global styles and TailwindCSS imports
│   │
│   ├── lab/                         # Lab-specific application code
│   │   │
│   │   ├── LabApp.tsx               # Main lab application component with routing
│   │   │
│   │   ├── pages/                   # Lab application pages
│   │   │   ├── LabLogin.tsx         # Lab technician authentication
│   │   │   ├── LabDashboard.tsx     # Main dashboard with batch overview
│   │   │   ├── TestNewBatch.tsx     # Interface for testing new batches
│   │   │   ├── BatchTestingForm.tsx # Detailed batch testing form
│   │   │   ├── LabForm.tsx          # General lab data entry form
│   │   │   │
│   │   │   ├── Batch Management Pages
│   │   │   │   ├── AllBatches.tsx            # View all batches in system
│   │   │   │   ├── TestedBatches.tsx         # Batches with completed tests
│   │   │   │   ├── RejectedBatches.tsx       # Failed quality tests
│   │   │   │   ├── ApprovedTests.tsx         # Approved test results
│   │   │   │   ├── ActiveTests.tsx           # Currently in-progress tests
│   │   │   │   ├── LastTested.tsx            # Recently tested batches
│   │   │   │   ├── SentToManufacturer.tsx    # Batches sent for production
│   │   │   │   └── LabSentToManufacturing.tsx # Manufacturing tracking
│   │   │   │
│   │   │   ├── Reports and Analytics
│   │   │   │   └── ReportsAnalytics.tsx      # Data visualization and PDF export
│   │   │   │
│   │   │   ├── Support Pages
│   │   │   │   ├── HelpSupport.tsx           # Help center with tabbed navigation
│   │   │   │   └── Support/
│   │   │   │       ├── ReportIssue.tsx       # Multi-step issue reporting wizard
│   │   │   │       └── ViewTickets.tsx       # Support ticket management
│   │   │   │
│   │   │   └── LabDashboard_OLD.tsx          # Legacy dashboard (deprecated)
│   │   │
│   │   ├── components/              # Lab-specific components
│   │   │   ├── LabNavbar.tsx        # Top navigation bar for lab portal
│   │   │   ├── LanguageSelector.tsx # Language switching interface
│   │   │   │
│   │   │   ├── Notification Components
│   │   │   │   ├── LabNotificationSidebar.tsx      # Sliding notification panel
│   │   │   │   ├── LabNotificationModal.tsx        # Detailed notification view
│   │   │   │   ├── LabNotificationItem.tsx         # Individual notification card
│   │   │   │   └── LabLoginNotificationPopup.tsx   # Welcome notification
│   │   │   │
│   │   │   └── Sidebar Components
│   │   │       ├── ProfessionalLabSidebar.tsx      # Navigation sidebar
│   │   │       ├── sidebar-preview.html            # Sidebar design preview
│   │   │       └── SIDEBAR_INTEGRATION_GUIDE.md    # Integration documentation
│   │   │
│   │   ├── utils/                   # Lab-specific utility functions
│   │   ├── data/                    # Lab data management
│   │   └── translations.ts          # Lab portal translations
│   │
│   ├── components/                  # Shared components across portals
│   ├── data/                        # Shared data structures
│   ├── lib/                         # Shared library configurations
│   │
│   └── api.ts                       # API service layer for backend calls
│
├── dist/                            # Production build output
└── node_modules/                    # Installed dependencies
```

### Key Features

- **Quality Testing**: Record comprehensive test results for herb batches
- **Grade Assignment**: Assign quality grades (A, B, C, D, F) based on parameters
- **Batch Approval/Rejection**: Approve or reject batches with detailed notes
- **Analytics Dashboard**: View testing statistics and generate reports
- **PDF Export**: Generate downloadable reports with test data
- **Support Ticketing**: Submit and track technical support requests
- **Multi-language Interface**: Available in English, Hindi, and Tamil

---

## Key Differences Between Portals

| Aspect | Farmer Portal | Lab Portal |
|--------|--------------|------------|
| **Primary Language** | Mixed (JavaScript and TypeScript) | Fully TypeScript |
| **Main Entry File** | `src/App.jsx` | `src/lab/LabApp.tsx` |
| **File Extensions** | `.jsx` and `.tsx` | `.tsx` only |
| **Theme Colors** | Green and Lime | Blue and Cyan |
| **Primary Focus** | Batch registration and order management | Quality testing and batch approval |
| **User Role** | Farmers | Laboratory Technicians |
| **Key Actions** | Submit batches, track orders, manage inventory | Test batches, assign grades, generate reports |
| **Dashboard Component** | `components/Dashboard.tsx` | `lab/pages/LabDashboard.tsx` |
| **Login Component** | `components/FarmerLogin.tsx` | `lab/pages/LabLogin.tsx` |
| **Help Page** | `components/HelpSupport.jsx` | `lab/pages/HelpSupport.tsx` |
| **Report Issue** | `pages/ReportIssue.jsx` | `lab/pages/Support/ReportIssue.tsx` |
| **Navigation Bar** | `components/NavBar.tsx` | `lab/components/LabNavbar.tsx` |
| **Component Location** | `src/components/` (root level) | `src/lab/components/` (nested) |
| **Notification System** | Standard notification sidebar | Lab-specific notification system |
| **Special Features** | Order tracking, manufacturing status | PDF report generation, analytics charts |

---

## Theme Colors

### Farmer Portal Theme

| Color Type | Color | Hex Code | Usage |
|------------|-------|----------|-------|
| Primary | Green | `#16a34a` (`green-600`) | Main buttons, headers, active states |
| Secondary | Lime | `#84cc16` (`lime-500`) | Accent elements, highlights |
| Success | Dark Green | `#15803d` (`green-700`) | Success messages, approved status |
| Background | Light Green | `#f0fdf4` (`green-50`) | Page backgrounds, cards |

### Lab Portal Theme

| Color Type | Color | Hex Code | Usage |
|------------|-------|----------|-------|
| Primary | Blue | `#2563eb` (`blue-600`) | Main buttons, headers, active states |
| Secondary | Cyan | `#0891b2` (`cyan-600`) | Accent elements, highlights |
| Gradient | Blue to Cyan | `from-blue-600 to-cyan-600` | Headers, buttons, backgrounds |
| Background | Light Blue | `#eff6ff` (`blue-50`) | Page backgrounds, cards |

---

## Technology Stack

### Frontend Framework
- **React 18.3.1**: Modern UI library with hooks and functional components
- **TypeScript 5.6.2**: Type-safe JavaScript for better code quality
- **Vite**: Fast build tool and development server

### Styling
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **PostCSS**: CSS processing and optimization
- **Framer Motion**: Animation library for smooth transitions

### UI Components
- **Lucide React**: Modern icon library with consistent design
- **Custom Components**: Reusable buttons, cards, badges, and modals

### State Management
- **React Hooks**: useState, useEffect, useMemo for local state
- **Context API**: Global state management where needed

### Internationalization
- **i18next**: Translation management system
- **Supported Languages**: English, Hindi, Tamil

### API Communication
- **Fetch API**: HTTP requests to backend services
- **RESTful APIs**: Standardized API endpoints

### Backend Integration
- **Node.js + Express**: Backend server (port 5174)
- **Blockchain Ledger**: Immutable record storage (port 3001)
- **JSON Storage**: File-based data persistence

### File Upload
- **Multer**: Middleware for handling file uploads
- **Supported Formats**: PNG, JPG, JPEG, PDF (max 5MB)

### PDF Generation
- **jsPDF**: Client-side PDF generation for lab reports

---

## Summary

### What Each Portal Does

#### Farmer Portal
The Farmer Portal is designed for agricultural producers who grow Ayurvedic herbs. It provides a complete interface for:
- Registering new herb batches with detailed information (product name, quantity, harvest date, location)
- Tracking batches as they move through laboratory testing and manufacturing
- Managing orders received from manufacturers
- Viewing batch status updates in real-time
- Accessing help resources and submitting support tickets
- Communicating in their preferred language (English, Hindi, or Tamil)

#### Lab Portal
The Lab Portal serves laboratory technicians who perform quality testing on herb batches. It enables them to:
- View all incoming batches awaiting testing
- Conduct comprehensive quality tests and record detailed parameters
- Assign quality grades (A through F) based on test results
- Approve batches that meet quality standards or reject those that do not
- Generate analytical reports with charts and statistics
- Export test results as PDF documents
- Track all tested batches and their current status
- Submit technical issues through a support ticketing system

### How They Connect

Both portals interact with a centralized blockchain-based ledger system that ensures:
- **Immutable Records**: All transactions are permanently recorded and cannot be altered
- **Traceability**: Complete history of each batch from farm to manufacturer
- **Real-time Updates**: Changes in one portal immediately reflect in others
- **Data Integrity**: Cryptographic verification prevents tampering
- **Transparency**: All stakeholders can view relevant batch information

The workflow typically follows this pattern:
1. Farmer registers a batch in the Farmer Portal
2. Batch appears in Lab Portal's pending tests list
3. Lab technician performs tests and records results
4. Farmer receives notification of test results
5. Approved batches become available to manufacturers
6. All actions are recorded on the blockchain ledger

### Technology Stack Summary

The application is built using modern web technologies:
- **Frontend**: React with TypeScript for type safety and maintainability
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: TailwindCSS for consistent, responsive design
- **Backend**: Node.js with Express for API services
- **Storage**: JSON files for development, blockchain ledger for production
- **Internationalization**: Multi-language support with i18next

### Language Support

The application supports three languages to serve diverse user communities:
- **English**: Primary language for international users
- **Hindi**: For users in North India
- **Tamil**: For users in South India

Users can switch languages at any time through the settings menu, and their preference is saved for future sessions.

### Development and Deployment

Both portals are developed as separate Vite applications but share:
- Common type definitions
- Consistent API interfaces
- Unified blockchain integration
- Standardized notification systems

This modular architecture allows:
- Independent deployment of each portal
- Easier maintenance and updates
- Scalability as new features are added
- Role-based access control for security

---

## Directory Navigation

- **Farmer Portal Root**: `d:\herb2\src\farmerportal\`
- **Lab Portal Root**: `d:\herb2\src\labportal\`
- **Backend Server**: `d:\herb2\server\` (Port 5174)
- **Blockchain Ledger**: `d:\herb2\backend\` (Port 3001)
- **Shared Types**: `d:\herb2\src\types.ts`

---

## Getting Started

### Running the Farmer Portal
```powershell
cd d:\herb2\src\farmerportal
npm install
npm run dev
```

### Running the Lab Portal
```powershell
cd d:\herb2\src\labportal
npm install
npm run dev
```

### Starting the Backend Server
```powershell
cd d:\herb2\server
npm install
npm start
```

### Starting the Blockchain Ledger
```powershell
cd d:\herb2\backend
npm install
npm start
```

---

## Contributing

When contributing to either portal:
1. Follow the existing folder structure
2. Use TypeScript for new components in Lab Portal
3. Maintain consistent naming conventions
4. Add translations for all user-facing text
5. Test across all supported languages
6. Ensure mobile responsiveness
7. Document new features and APIs

---

## License

This project is part of the Blockchain-Based Ayurvedic Herb Traceability System.

---

**Last Updated**: November 6, 2025
