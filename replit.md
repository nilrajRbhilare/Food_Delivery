# FoodHub - Food Delivery Application

## Overview

FoodHub is a modern food delivery web application built with React and TypeScript. The application enables users to browse restaurants, search for food items, manage shopping carts, track orders, and complete payments. It includes a comprehensive admin panel for restaurant partners to manage their menus, orders, and offers.

The application is currently implemented as a **frontend-focused prototype** with localStorage-based data persistence, simulating a full-stack application without requiring backend infrastructure. The codebase is structured to support future backend integration through its existing Drizzle ORM configuration and Express server setup.

## Recent Changes

**October 16, 2025** - Successfully imported and configured for Replit environment:
- ✅ Installed Node.js 20 and all project dependencies
- ✅ Updated vite.config.ts to allow all hosts for Replit proxy (added allowedHosts: true)
- ✅ Configured workflow to run development server on port 5000
- ✅ Verified frontend and backend are working correctly
- ✅ Configured deployment settings for production (autoscale with npm build)
- ✅ Verified .gitignore has proper Node.js entries

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
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
- **localStorage** as the primary data store (simulating database)
- Keys: `foodhub_users`, `foodhub_restaurants`, `foodhub_menu_items`, `foodhub_admin_offers`
- Initialization flag pattern (`isInitialized`) to prevent race conditions
- Real-time updates across browser tabs via storage event listeners

**Key Features:**
- Dynamic search and filtering (veg/non-veg, price, rating, offers)
- Shopping cart with tax calculation and coupon support
- Order tracking with status updates
- Live location selection with Leaflet maps
- Admin dashboard for restaurant management

### Backend Architecture

**Server Setup:**
- **Express.js** server configured to serve both API and frontend on port 5000
- Development mode uses Vite middleware for HMR
- Production mode serves static files from dist/public
- API routes defined in `server/routes.ts` (ready for implementation)
- In-memory storage interface (`IStorage`) in `server/storage.ts`

**Planned Database:**
- **Drizzle ORM** configured for PostgreSQL (schema defined but not connected)
- Migration setup in `drizzle.config.ts`
- Schema location: `shared/schema.ts` (currently minimal user schema)

**Session Management:**
- `connect-pg-simple` dependency included for PostgreSQL session store
- Currently using client-side authentication with localStorage

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

### Database (Configured, Not Active)
- **drizzle-orm** - TypeScript ORM
- **drizzle-zod** - Zod schema generation from Drizzle
- **@neondatabase/serverless** - Neon PostgreSQL driver
- **connect-pg-simple** - PostgreSQL session store

### Build & Development
- **vite** - Build tool and dev server
- **@vitejs/plugin-react** - React plugin for Vite
- **typescript** - Type system
- **esbuild** - JavaScript bundler for production builds

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal** - Error overlay
- **@replit/vite-plugin-cartographer** - Development tools (dev only)
- **@replit/vite-plugin-dev-banner** - Development banner (dev only)

## Development Workflow

**Development Server:**
```bash
cd FoodDelivery && npm run dev
```
- Runs on port 5000
- Hot module replacement enabled
- Serves both API and frontend

**Build for Production:**
```bash
cd FoodDelivery && npm run build
```
- Builds frontend to dist/public
- Bundles backend to dist/index.js

**Start Production Server:**
```bash
cd FoodDelivery && npm start
```
- Serves static files from dist/public
- Runs on port 5000

## Deployment

The application is configured for autoscale deployment:
- Build command: `npm run build`
- Run command: `npm start`
- Port: 5000
- Suitable for stateless web applications
