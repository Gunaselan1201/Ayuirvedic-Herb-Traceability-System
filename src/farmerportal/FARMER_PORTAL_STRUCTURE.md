# Farmer Portal - Restructured Organization

## Overview

The Farmer Portal has been reorganized into a clean, modular structure that separates concerns and makes the codebase easier to navigate and maintain.

---

## Directory Structure

```
farmerportal/
│
├── Configuration Files
│   ├── package.json                 # Project dependencies and npm scripts
│   ├── vite.config.js               # Vite build tool configuration
│   ├── vite.config.ts               # TypeScript version of Vite config
│   ├── tailwind.config.js           # TailwindCSS framework configuration
│   ├── tailwind.config.cjs          # CommonJS version of Tailwind config
│   ├── postcss.config.js            # PostCSS processing configuration
│   ├── postcss.config.cjs           # CommonJS version of PostCSS config
│   ├── tsconfig.json                # TypeScript compiler settings
│   └── index.html                   # HTML entry point for the application
│
├── src/                             # Main application source code
│   │
│   ├── Entry Points
│   │   ├── main.jsx                 # JavaScript entry point
│   │   ├── main.tsx                 # TypeScript entry point (runs first)
│   │   ├── App.jsx                  # JavaScript root component
│   │   ├── App.tsx                  # TypeScript root component with routing
│   │   └── index.css                # Global styles and TailwindCSS imports
│   │
│   ├── pages/                       # Full-page components
│   │   └── ReportIssue.jsx          # Multi-step issue reporting wizard page
│   │
│   ├── components/                  # Main reusable components
│   │   ├── FarmerLogin.tsx          # Farmer authentication and login page
│   │   ├── Login.tsx                # Alternative login component
│   │   ├── Dashboard.tsx            # Main dashboard with batch overview
│   │   ├── FarmerForm.tsx           # Form for submitting new herb batches
│   │   ├── Orders.tsx               # Order management and tracking interface
│   │   ├── Settings.tsx             # User settings and preferences page
│   │   ├── HelpSupport.tsx          # Help center with FAQs and support
│   │   ├── HelpSupport.jsx          # JavaScript version of help support
│   │   ├── ReportIssue.jsx          # Issue reporting component
│   │   ├── Notifications.tsx        # Notification system component
│   │   │
│   │   ├── notifications/           # Notification-related components
│   │   │   ├── NotificationSidebar.jsx      # Sliding notification panel
│   │   │   ├── NotificationModal.jsx        # Detailed notification popup
│   │   │   ├── NotificationItem.jsx         # Individual notification card
│   │   │   └── LoginNotificationPopup.jsx   # Welcome notification after login
│   │   │
│   │   └── ui/                      # Basic UI building blocks
│   │       ├── NavBar.tsx           # Top navigation bar
│   │       ├── SideNav.tsx          # Sidebar navigation menu
│   │       ├── Layout.tsx           # Page layout wrapper component
│   │       ├── Card.tsx             # Reusable card component
│   │       ├── Button.tsx           # Reusable button component
│   │       ├── Badge.tsx            # Status badge component
│   │       └── Toast.tsx            # Toast notification component
│   │
│   ├── orders/                      # Order-specific pages and logic
│   ├── approved/                    # Approved batches pages
│   ├── rejected/                    # Rejected batches pages
│   ├── testing/                     # Testing status pages
│   ├── manufacturing/               # Manufacturing tracking pages
│   │
│   ├── locales/                     # Internationalization files
│   │   ├── en.json                  # English translations
│   │   ├── hi.json                  # Hindi translations
│   │   └── ta.json                  # Tamil translations
│   │
│   ├── utils/                       # Helper functions and utilities
│   ├── lib/                         # Third-party library configurations
│   ├── data/                        # Static data and mock data
│   │
│   ├── api.ts                       # API service layer for backend calls
│   ├── i18n.ts                      # Internationalization setup
│   ├── translations.js              # Translation helper functions
│   ├── store.ts                     # Global state management
│   ├── FarmerDashboard.jsx          # Legacy dashboard component
│   └── NewDashboard.jsx             # Updated dashboard component
│
├── dist/                            # Production build output
└── node_modules/                    # Installed npm packages
```

---

## Restructuring Changes

### What Changed

1. **Organized Notification Components**
   - Created `components/notifications/` folder
   - Moved all notification-related files:
     - `NotificationSidebar.jsx`
     - `NotificationModal.jsx`
     - `NotificationItem.jsx`
     - `LoginNotificationPopup.jsx`

2. **Organized UI Components**
   - Created `components/ui/` folder
   - Moved basic reusable UI elements:
     - `NavBar.tsx`
     - `SideNav.tsx`
     - `Layout.tsx`
     - `Card.tsx`
     - `Button.tsx`
     - `Badge.tsx`
     - `Toast.tsx`

3. **Improved Import Paths**
   - Components now have clear, organized import paths
   - Example: `import NotificationSidebar from './components/notifications/NotificationSidebar'`
   - Example: `import Button from './components/ui/Button'`

---

## File Organization Logic

### Top-Level Components (`src/components/`)
These are major application features:
- **FarmerLogin.tsx**: User authentication
- **Dashboard.tsx**: Main application dashboard
- **FarmerForm.tsx**: Batch creation and submission
- **Orders.tsx**: Order management interface
- **Settings.tsx**: User preferences
- **HelpSupport.tsx**: Help and support center

### Notification Components (`src/components/notifications/`)
All components related to the notification system:
- **NotificationSidebar**: Main notification panel
- **NotificationModal**: Detailed notification view
- **NotificationItem**: Single notification display
- **LoginNotificationPopup**: Welcome message after login

### UI Components (`src/components/ui/`)
Reusable, low-level UI building blocks:
- **NavBar**: Application header
- **SideNav**: Sidebar menu
- **Layout**: Page wrapper and structure
- **Card**: Generic card container
- **Button**: Styled button component
- **Badge**: Status indicators
- **Toast**: Temporary notification messages

### Pages (`src/pages/`)
Full-page components that represent routes:
- **ReportIssue.jsx**: Multi-step issue reporting wizard

---

## Import Path Updates

### Before Restructuring
```javascript
import NotificationSidebar from './components/NotificationSidebar';
import NavBar from './components/NavBar';
import Card from './components/Card';
```

### After Restructuring
```javascript
import NotificationSidebar from './components/notifications/NotificationSidebar';
import NavBar from './components/ui/NavBar';
import Card from './components/ui/Card';
```

---

## Key Features by Location

### Authentication
- **Location**: `src/components/FarmerLogin.tsx`
- **Purpose**: Farmer login and session management

### Dashboard
- **Location**: `src/components/Dashboard.tsx`
- **Purpose**: Main overview of batches and activities

### Batch Management
- **Location**: `src/components/FarmerForm.tsx`
- **Purpose**: Create and submit new herb batches

### Orders
- **Location**: `src/components/Orders.tsx`
- **Purpose**: View and manage manufacturer orders

### Notifications
- **Location**: `src/components/notifications/`
- **Purpose**: Real-time updates on batch status

### Help & Support
- **Location**: `src/components/HelpSupport.tsx`
- **Purpose**: FAQs, guides, and support resources

### Issue Reporting
- **Location**: `src/pages/ReportIssue.jsx`
- **Purpose**: Report technical issues with file attachments

---

## Configuration Files Explained

### package.json
Contains project metadata, dependencies, and scripts:
- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run preview`: Preview production build

### vite.config.js/ts
Vite build tool settings:
- Development server configuration
- Build optimization settings
- Plugin configuration

### tailwind.config.js
TailwindCSS customization:
- Custom colors (green theme)
- Font configurations
- Responsive breakpoints

### tsconfig.json
TypeScript compiler options:
- Target JavaScript version
- Module system
- Type checking strictness

---

## Multi-Language Support

### Available Languages
- **English** (`en.json`): Default language
- **Hindi** (`hi.json`): हिंदी भाषा समर्थन
- **Tamil** (`ta.json`): தமிழ் மொழி ஆதரவு

### Translation System
- **Setup**: `src/i18n.ts`
- **Helper**: `src/translations.js`
- **Usage**: Import translation function and use keys
  ```javascript
  import { t } from './translations';
  <h1>{t('dashboard')}</h1>
  ```

---

## API Integration

### API Service (`src/api.ts`)
Handles all backend communication:
- Fetch batch data
- Submit new batches
- Update batch status
- Retrieve notifications
- Upload files

### Endpoints
- **Blockchain Ledger**: `http://localhost:3001`
- **Support Server**: `http://localhost:5174`

---

## State Management

### Store (`src/store.ts`)
Global application state:
- User session
- Batch list
- Notifications
- Language preference

---

## Best Practices

### Component Organization
1. **Keep components focused**: Each component should have a single responsibility
2. **Use proper folders**: Place components in the correct folder based on their purpose
3. **Consistent naming**: Use PascalCase for component files (e.g., `FarmerLogin.tsx`)

### Import Guidelines
1. **Use relative paths**: Import from the correct nested location
2. **Group imports**: Separate third-party, local, and style imports
3. **Update paths**: When moving files, update all import statements

### File Naming
1. **Components**: PascalCase (e.g., `Dashboard.tsx`)
2. **Utilities**: camelCase (e.g., `api.ts`, `store.ts`)
3. **Config files**: lowercase with extensions (e.g., `vite.config.js`)

---

## Development Workflow

### Starting Development
```powershell
cd d:\herb2\src\farmerportal
npm install
npm run dev
```

### Building for Production
```powershell
npm run build
```

### Running Tests
```powershell
npm run test
```

---

## Dependencies

### Core Framework
- React 18.3.1
- React Router DOM (routing)

### Build Tools
- Vite (fast build tool)
- TypeScript 5.6.2

### Styling
- TailwindCSS (utility-first CSS)
- PostCSS (CSS processing)

### UI Libraries
- Framer Motion (animations)
- Lucide React (icons)

### Utilities
- i18next (translations)
- date-fns (date formatting)

---

## Future Improvements

### Planned Enhancements
1. Move `FarmerDashboard.jsx` and `NewDashboard.jsx` to `pages/` folder
2. Create `hooks/` folder for custom React hooks
3. Add `contexts/` folder for React Context providers
4. Create `services/` folder for business logic
5. Add `types/` folder for TypeScript type definitions

---

## Troubleshooting

### Common Issues

**Import errors after restructuring**
- Solution: Update import paths to match new folder structure
- Example: Change `'./components/NavBar'` to `'./components/ui/NavBar'`

**Build fails**
- Solution: Run `npm install` to ensure all dependencies are installed
- Check that all files are in correct locations

**Development server not starting**
- Solution: Check if port is already in use
- Try: `npm run dev -- --port 3001`

---

## Contributing

When adding new components:
1. Determine the correct folder based on component purpose
2. Use TypeScript for new components (`.tsx` extension)
3. Add translations for all user-facing text
4. Update this documentation if adding new folders

---

**Last Updated**: November 6, 2025  
**Version**: 2.0 (Restructured)
