# FoodHub - Food Delivery Application

## Overview

FoodHub is a modern food delivery web application built as a frontend-focused React prototype. The application allows users to browse restaurants, search for food items, manage a shopping cart, and simulate the checkout process. It features a responsive design with support for light/dark themes, location selection with map integration, and a comprehensive filtering system for food discovery.

This is currently a **frontend-only prototype** with mock data and simulated interactions. The backend infrastructure is minimal, with a basic Express server setup that's ready for future API integration.

## Recent Changes

**October 16, 2025** - Fixed Critical Loading & Routing Issues:
- ✅ **Resolved skeleton loader bug** - Home page now correctly displays 19 menu items from DataContext
  - Root cause: DataContext initialization timing issue (loaded after Home component's useEffect timer completed)
  - Initial solution attempted: Changed loading state from timer-based to data-based (`loading = menuItems.length === 0`)
  - **Final robust solution**: Implemented `isInitialized` flag pattern in DataContext
    - Added `isInitialized` boolean state to track when data loading is complete
    - Set to `true` after both `initializeData()` and `loadData()` complete
    - Home component now uses `loading = !isInitialized` instead of checking menuItems.length
    - **Key benefit**: Properly distinguishes "loading" state from "loaded but empty" state
    - Prevents skeleton loaders from showing forever when menu is legitimately empty
    - Works correctly in all scenarios: initial load, localStorage updates, cross-tab sync
- ✅ **Verified routing system integrity**:
  - Wouter routing working correctly with regex patterns for exact matching
  - Home route uses `/^\/$/` pattern to match only "/" exactly
  - Admin route properly protected with authentication guard (redirects non-admin users to home)
  - All routes tested: `/` (home), `/admin`, `/cart`, `/track-order`, `/payment`, `/profile`
- ✅ **Enhanced DataContext initialization**:
  - Added data existence verification before loading from localStorage
  - Ensures menuItems array is populated before components consume it
  - Prevents race conditions between context initialization and component mounting
  - Storage event listeners trigger loadData which sets isInitialized for cross-tab updates

**October 15, 2025** - Enhanced Admin Panel & Restaurant Integration:
- ✅ Updated admin registration to capture restaurant details:
  - Restaurant Name field (required for admin accounts)
  - Auto-generated unique Restaurant ID (REST-timestamp format)
  - Restaurant Location field (editable in admin panel)
- ✅ Implemented restaurant-order linkage system:
  - Orders now include restaurantId for proper routing
  - Round-robin distribution ensures fair order allocation across restaurants
  - Each admin only sees orders for their specific restaurant
  - Multi-admin support with isolated order management
- ✅ Enhanced Menu Management with image support:
  - Added imageUrl field to menu items
  - Image URL input in create/edit dialogs
  - Better visual representation for menu products
- ✅ Verified Offers Management has complete validity date system:
  - Start Date and End Date fields fully functional
  - Date pickers for offer scheduling
  - Automatic offer duration management

**October 15, 2025** - Complete localStorage User Management System:
- ✅ Implemented comprehensive user management with localStorage persistence
- ✅ User records include: username, email, password, phone, address, and personal order history
- ✅ Enhanced registration with username field and duplicate validation (email & username)
- ✅ Login validates credentials against stored user records (email + password match)
- ✅ Auto-login on page refresh - session restoration from localStorage
- ✅ Per-user order tracking - each user has isolated order history in their user record
- ✅ Payment page saves orders via AuthContext.addOrder() to logged-in user's orders array
- ✅ Track Order page displays only current user's orders (no global order list)
- ✅ Logout clears cart and UI state while preserving all user data in localStorage
- ✅ Complete data isolation: users can only see and manage their own orders

**October 14, 2025** - Authentication & Real Order Tracking:
- ✅ Added authentication check to Cart page - login required before checkout
- ✅ Integrated AuthModal to appear when unauthenticated users attempt to order
- ✅ Implemented localStorage-based order persistence (replaces mock data)
- ✅ Orders automatically saved with unique IDs, items, totals, delivery info, and status
- ✅ Track Order page now displays real orders from localStorage with empty state handling
- ✅ Complete flow working: Cart → Login Check → Payment → Save Order → Track Order

**October 14, 2025** - Order Management System Implementation:
- ✅ Added Track Order page with order status tracking (Preparing, On the Way, Delivered)
- ✅ Created comprehensive Cart page with full order management
- ✅ Implemented Payment page with multiple payment methods (COD, UPI, Banking)
- ✅ Added coupon functionality (SAVE10 for ₹50 off, FOOD50 for ₹100 off)
- ✅ Created order success popup with navigation options
- ✅ Implemented proper state management across cart, payment, and order tracking
- ✅ Fixed total consistency between Cart and Payment pages

**October 14, 2025** - Initial feature implementations:
- ✅ Real-time search functionality across all food items and categories
- ✅ Interactive Leaflet map integration for location selection
- ✅ Offer application system with cart discount calculations
- ✅ Tax calculation (5%), delivery fee logic (₹40)
- ✅ Comments section in food detail modal for order instructions
- ✅ Dark mode toggle with localStorage persistence

All features are frontend-only with localStorage persistence for orders, no database required.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing
- **TanStack Query (React Query)** for async state management and data fetching (ready for future backend integration)

**UI Component Strategy**
- **Shadcn/ui** component library built on Radix UI primitives for accessible, customizable components
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Framer Motion** for smooth animations and transitions
- Component structure follows the "New York" style variant from Shadcn with custom theming

**State Management Pattern**
- Local component state using React hooks (`useState`, `useEffect`)
- Cart state managed at the App.tsx router level and passed to pages
- Applied offers state shared across Home, Cart, and Payment pages
- No global state management library (Redux/Zustand) - keeps the architecture simple for the prototype phase

**Design System**
- Custom color palette defined in `index.css` with CSS variables for theming
- Support for light/dark modes with system preference detection
- Reference-based design inspired by Swiggy, Zomato, and Uber Eats
- Responsive breakpoints: mobile-first approach with sm/md/lg/xl breakpoints

### Backend Architecture

**Server Framework**
- **Express.js** server with TypeScript
- Middleware setup for JSON parsing and request logging
- Error handling middleware configured
- Development mode uses Vite middleware for HMR

**Storage Layer (Prepared but Not Active)**
- **In-memory storage** abstraction (`MemStorage` class) implementing `IStorage` interface
- Ready for database integration - interface defines CRUD operations
- User schema defined but not currently utilized

**API Structure**
- Routes configured to use `/api` prefix
- Currently no active endpoints - backend is scaffolded for future implementation
- Storage interface ready to be consumed by route handlers

### Data Layer

**Database Schema (Defined but Not Connected)**
- **Drizzle ORM** configured for PostgreSQL
- Schema defined in `shared/schema.ts` with users table
- Neon Database serverless driver configured
- Migration setup ready with `drizzle-kit`
- **Note**: Database is defined but not currently provisioned or used

**Mock Data Strategy**
- Static food items, offers, and location data in `client/src/lib/mockData.ts`
- Organized by categories: Chinese, Indian, Pizza, Desserts, Burgers, Healthy, Gourmet
- Includes metadata: pricing, ratings, vegetarian flags, offers, descriptions
- Image assets stored in `attached_assets/stock_images/`

### Key Features Implementation

**Location Selection**
- Leaflet.js integration for interactive map selection
- Manual address input with suggestion dropdown
- Saved addresses (Home, Work) with icon indicators
- Real-time coordinate display and address updates

**Search & Discovery**
- Real-time search filtering across all food items and restaurants
- Search suggestions with live preview
- Filter system: vegetarian toggle, price range, ratings, offers, proximity
- Sort options: popularity, delivery time, rating, price

**Cart Management**
- Add/remove items with quantity controls
- Automatic subtotal calculation
- Tax calculation (5% rate)
- Delivery fee logic (₹40, waived with free delivery offers)
- Offer application system with discount calculation
- Cart dropdown for quick view with navigation to full Cart page
- Full Cart page with detailed order summary

**Order & Payment Flow**
- **Authentication Gate**: Cart page checks if user is logged in before allowing checkout
- **Login/Register Modal**: Appears automatically when unauthenticated users click "Order"
- **Payment Processing**: Multiple payment methods (Cash on Delivery, UPI, Banking)
- **Coupon System**: Apply discount codes (SAVE10 for ₹50 off, FOOD50 for ₹100 off)
- **Order Persistence**: Orders saved to localStorage with:
  - Unique order ID (ORD + timestamp)
  - Item details with quantities
  - Total amount (includes delivery charges and discounts)
  - Restaurant name, delivery date/time estimate
  - Payment method and order status
- **Order Tracking**: Track Order page reads from localStorage (no mock data)
  - Current order status visualization (Preparing → On the Way → Delivered)
  - Complete order history with all past orders
  - Empty state when no orders exist
- **Order Success Flow**: Popup with "Order More" and "Track Order" navigation
- **Cart Management**: Automatic cart clearing after successful payment

**Modal System**
- Authentication modal with Sign In/Sign Up tabs (UI only, no backend)
- Offers modal displaying available deals with apply functionality
- Cart dropdown with quick view and navigation to full cart
- Food detail modal with order comments
- Order success modal with navigation options
- All modals use Framer Motion for smooth entrance/exit animations

## External Dependencies

### UI & Animation Libraries
- **@radix-ui/* components**: Accessible, unstyled UI primitives (20+ components)
- **framer-motion**: Animation library for smooth transitions
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority & clsx**: Utility for managing conditional CSS classes
- **tailwindcss**: Utility-first CSS framework with PostCSS

### Map Integration
- **leaflet**: Interactive maps for location selection
- **react-leaflet**: React bindings for Leaflet
- Map tiles from OpenStreetMap CDN

### Backend Dependencies (Prepared)
- **express**: Web server framework
- **drizzle-orm & drizzle-zod**: ORM and schema validation
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **connect-pg-simple**: PostgreSQL session store (ready for session management)

### Development Tools
- **@vitejs/plugin-react**: Vite plugin for React Fast Refresh
- **@replit/vite-plugin-***: Replit-specific development tools (error overlay, cartographer, dev banner)
- **TypeScript**: Type safety across the entire codebase
- **wouter**: Minimalist routing library

### Form & Data Management
- **react-hook-form**: Performant form handling (ready for future forms)
- **@hookform/resolvers**: Validation resolver for react-hook-form
- **zod**: Schema validation library
- **@tanstack/react-query**: Server state management (configured for future API integration)

### Fonts
- **Google Fonts**: Inter, Plus Jakarta Sans, Architects Daughter, DM Sans, Fira Code, Geist Mono
- Loaded via CDN in `client/index.html`