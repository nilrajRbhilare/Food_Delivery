# FoodHub - Food Delivery Application

## Overview

FoodHub is a modern food delivery web application built with React and TypeScript. The application enables users to browse restaurants, search for food items, manage shopping carts, track orders, and complete payments. It includes a comprehensive admin panel for restaurant partners to manage their menus, orders, and offers.

The application is a **frontend-only prototype** using localStorage for all data persistence. There is no backend server or database - all data is stored in the browser's localStorage as JSON.

## Recent Changes

**October 16, 2025** - Converted to frontend-only Vite application:
- ✅ Removed Express backend server and all server-side code
- ✅ Removed database configuration (Drizzle ORM, Neon PostgreSQL)
- ✅ Updated package.json to use Vite directly (no backend dependencies)
- ✅ Cleaned up configuration files (vite.config.ts, tsconfig.json)
- ✅ Updated deployment to use `vite preview` for production
- ✅ Verified build process works correctly
- ✅ Application uses localStorage/JSON for all data storage

**Previous Setup** - Successfully imported and configured for Replit:
- ✅ Installed Node.js 20 and all project dependencies
- ✅ Updated vite.config.ts to allow all hosts for Replit proxy
- ✅ Configured workflow to run development server on port 5000
- ✅ Verified frontend working correctly with screenshot

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server (no backend)
- **Wouter** for lightweight client-side routing (regex-based route matching)
- **TanStack Query** for data fetching and state management
- **Framer Motion** for animations and transitions

**UI Component System:**
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** for styling with custom design tokens
- Design system based on food delivery platforms (Swiggy, Zomato, Uber Eats)
- Responsive breakpoints: sm, md, lg, xl
- Dark/light theme support with CSS variables

**State Management:**
- **Context API** for global state:
  - `AuthContext`: User authentication, profile management, order history
  - `DataContext`: Restaurant and menu data with localStorage persistence
- Local component state with React hooks
- Cross-tab synchronization via storage events

**Data Persistence:**
- **localStorage** as the primary data store (JSON format)
- Keys: `foodhub_users`, `foodhub_restaurants`, `foodhub_menu_items`, `foodhub_admin_offers`
- Initialization flag pattern (`isInitialized`) to prevent race conditions
- Real-time updates across browser tabs via storage event listeners

**Key Features:**
- Dynamic search and filtering (veg/non-veg, price, rating, offers)
- Shopping cart with tax calculation and coupon support
- Order tracking with status updates
- Live location selection with Leaflet maps
- Admin dashboard for restaurant management

### Routing Structure

**Client Routes (Wouter):**
- `/` - Home page (exact match with regex `/^\/$/`)
- `/profile` - User profile management
- `/track-order` - Order tracking
- `/cart` - Shopping cart
- `/payment` - Payment processing
- `/admin` - Admin dashboard (auth-protected, admin-only)

### Design System

**Color Palette:**
- Primary: Vibrant coral/red (hsl 255 84% 50%) for food branding
- Secondary: Fresh green (hsl 142 71% 45%) for veg options
- Accent: Warm orange (hsl 45 93% 58%) for promotions
- Semantic colors for status (orange=preparing, blue=delivery, green=delivered)

**Typography:**
- Font families: Inter, Plus Jakarta Sans
- Responsive text scales (xs to 4xl)
- Weight variations: 400-700

## External Dependencies

### UI & Styling
- **@radix-ui/* packages** - Headless UI primitives (accordion, dialog, dropdown, tabs, etc.)
- **tailwindcss** - Utility-first CSS framework
- **framer-motion** - Animation library
- **class-variance-authority** - Component variant management
- **cmdk** - Command menu component

### Data & Forms
- **@tanstack/react-query** - Server state management
- **@hookform/resolvers** - Form validation
- **zod** - Schema validation
- **date-fns** - Date manipulation

### Maps & Location
- **leaflet** - Interactive maps for location selection
- **@types/leaflet** - TypeScript definitions
- **react-leaflet** - React bindings for Leaflet

### Build & Development
- **vite** - Build tool and dev server
- **@vitejs/plugin-react** - React plugin for Vite
- **typescript** - Type system

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal** - Error overlay
- **@replit/vite-plugin-cartographer** - Development tools (dev only)
- **@replit/vite-plugin-dev-banner** - Development banner (dev only)

## Development Workflow

**Development Server:**
```bash
cd FoodDelivery && npm run dev
```
- Runs Vite dev server on port 5000
- Hot module replacement enabled
- No backend server required

**Build for Production:**
```bash
cd FoodDelivery && npm run build
```
- Builds frontend to dist/ directory
- Optimizes assets and bundles code

**Preview Production Build:**
```bash
cd FoodDelivery && npm run preview
```
- Serves production build locally
- Runs on port 5000

## Deployment

The application is configured for autoscale deployment:
- Build command: `npm run build`
- Run command: `npm run preview`
- Port: 5000
- Pure frontend application with localStorage persistence
