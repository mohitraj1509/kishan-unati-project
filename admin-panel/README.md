# Admin Panel - Kisan Unnati

A separate admin panel for managing the Kisan Unnati platform.

## Features

- 👥 User Management (Farmers & Buyers)
- 🏪 Marketplace Control
- 📜 Schemes Management
- 📊 Analytics Dashboard
- 💰 Revenue Tracking
- 📝 Content Moderation
- ⚙️ System Settings

## Getting Started

### Installation

```bash
cd admin-panel
npm install
```

### Development

```bash
npm run dev
```

Admin panel will run on http://localhost:3003

### Default Credentials

- **Email**: admin@kisan.com
- **Password**: admin123

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React

## Directory Structure

```
admin-panel/
├── app/
│   ├── dashboard/          # Admin dashboard pages
│   │   ├── users/          # User management
│   │   ├── marketplace/    # Marketplace control
│   │   ├── schemes/        # Schemes management
│   │   └── ...
│   ├── page.tsx            # Login page
│   └── layout.tsx
├── components/
├── lib/
└── package.json
```

## Pages

- `/` - Admin login
- `/dashboard` - Main dashboard
- `/dashboard/users` - User management
- `/dashboard/marketplace` - Marketplace control
- `/dashboard/schemes` - Schemes management

## API Endpoints

All API calls are made to the backend server at `http://localhost:3001/api/admin/*`
