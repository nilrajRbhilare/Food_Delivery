# Food Delivery App - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from leading food delivery platforms like Swiggy, Zomato, and Uber Eats with modern UI principles

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 255 84% 50% (Vibrant coral/red for food branding)
- Secondary: 142 71% 45% (Fresh green for healthy/veg options)
- Accent: 45 93% 58% (Warm orange for offers/promotions)
- Neutral backgrounds: 0 0% 98%, 0 0% 100%
- Text: 220 13% 18% (dark slate)

**Dark Mode:**
- Primary: 255 84% 55%
- Secondary: 142 71% 50%
- Background: 220 13% 18%, 220 13% 12%
- Text: 0 0% 98%

### B. Typography
**Font Family:** 
- Primary: 'Inter' or 'Plus Jakarta Sans' (Google Fonts)
- Headings: Semi-bold to Bold (600-700)
- Body: Regular to Medium (400-500)

**Scale:**
- Hero/Category Headers: text-2xl to text-4xl
- Card Titles: text-lg
- Body/Descriptions: text-sm to text-base
- Captions/Tags: text-xs

### C. Layout System
**Spacing Units:** Consistent use of 2, 4, 6, 8, 12, 16, 20 Tailwind units
- Component padding: p-4, p-6
- Section spacing: py-8, py-12, py-16
- Grid gaps: gap-4, gap-6
- Card spacing: p-4 to p-6

**Container Structure:**
- Max width: max-w-7xl
- Horizontal padding: px-4 md:px-6 lg:px-8
- Responsive breakpoints: sm, md, lg, xl

### D. Component Library

**Navbar:**
- Sticky positioning with backdrop blur
- Height: h-16 to h-20
- Shadow: subtle shadow-md
- Location dropdown: rounded-xl modal with smooth slide-down
- Search bar: rounded-full with focus ring
- Cart: slide-in panel from right (w-96)

**Filter Bar:**
- Horizontal scroll on mobile
- Toggle buttons: rounded-full with active state (filled bg)
- Icons: 20x20 size from Lucide React
- Active filters: primary color fill with white text
- Inactive: border with hover lift effect

**Food Cards:**
- Aspect ratio: 4:3 for food images
- Border radius: rounded-2xl
- Shadow: shadow-sm with hover:shadow-xl transition
- Image: object-cover with slight zoom on hover
- Add to Cart button: rounded-lg with scale animation
- Offer badge: absolute top-right, rounded-full

**Category Sections:**
- Horizontal scroll: overflow-x-auto with hidden scrollbar
- Card width: w-72 to w-80
- Gap between cards: gap-4
- Navigation arrows: absolute positioned on hover

**Modals:**
- Backdrop: bg-black/50 with backdrop-blur
- Content: max-w-2xl, rounded-3xl
- Animation: fade + scale from Framer Motion
- Close button: absolute top-right

**Sign In/Sign Up:**
- Tabbed interface with underline indicator
- Input fields: rounded-xl with focus ring
- Submit button: w-full, rounded-xl

### E. Visual Effects

**Animations (Framer Motion):**
- Page transitions: fade + slide
- Card hover: lift (translateY -2px) + shadow increase
- Button clicks: scale(0.95)
- Cart add: slide-in from bottom
- Modal: fade + scale from 0.95
- Loading: shimmer gradient animation

**Hover States:**
- Cards: transform, shadow, and slight scale
- Buttons: background darken + slight lift
- Links: underline animation
- Images: subtle zoom (scale: 1.05)

**Gradients:**
- Hero/Offer cards: linear-gradient with vibrant colors
- Category headers: subtle overlay gradients
- Buttons: optional gradient on primary actions

### F. Responsive Behavior

**Desktop (lg+):**
- Multi-column grids (3-4 columns)
- Horizontal category carousels
- Expanded navbar with all elements visible

**Tablet (md):**
- 2-column grids
- Compact navbar with condensed search
- Touch-friendly button sizes (min h-12)

**Mobile (base):**
- Single column stacks
- Bottom sticky navbar option
- Drawer-style menus
- Larger touch targets (min 44px)

### G. Images
**Hero Section:** No traditional hero - immediately show food categories
**Food Cards:** High-quality food photography (800x600px minimum)
**Restaurant Logos:** Circular avatars (100x100px)
**Offer Banners:** Landscape images with text overlay (1200x400px)
**Category Icons:** Illustrated icons or emoji (64x64px)

**Image Treatment:**
- Border radius: rounded-xl to rounded-2xl
- Object fit: cover
- Loading: shimmer placeholder
- Lazy loading for performance

### H. Accessibility
- Focus visible rings on all interactive elements
- ARIA labels for icon-only buttons
- Sufficient color contrast (WCAG AA)
- Keyboard navigation support
- Semantic HTML structure

### I. Loading States
- Shimmer effect: animated gradient overlay
- Skeleton screens for cards (bg-gray-200 animate-pulse)
- Spinner for actions (lucide loader with spin animation)
- Progressive image loading with blur-up

### J. Interactive Elements
- Back to top: fixed bottom-right, rounded-full, primary color
- Cart badge: absolute positioned, rounded-full, count animation
- Filter chips: removable with X icon, slide-out animation
- Rating stars: filled/half-filled gold stars
- Comment input: expandable textarea with character count