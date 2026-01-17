# Fridge23 - Complete Project Documentation

> **Version:** 1.0.0  
> **Generated:** January 17, 2026  
> **Technology Stack:** React 18 + TypeScript + Vite + TailwindCSS + shadcn/ui

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Design & UI/UX Documentation](#2-design--uiux-documentation)
3. [User Flow & Journey](#3-user-flow--journey)
4. [Features Breakdown](#4-features-breakdown)
5. [System Architecture](#5-system-architecture)
6. [API Documentation](#6-api-documentation)
7. [Data & Storage](#7-data--storage)
8. [Configuration & Environment](#8-configuration--environment)
9. [Security & Permissions](#9-security--permissions)
10. [Error Handling & Edge Cases](#10-error-handling--edge-cases)
11. [Limitations & Known Gaps](#11-limitations--known-gaps)
12. [Future Enhancements](#12-future-enhancements)
13. [How to Use This Project](#13-how-to-use-this-project)

---

## 1. Project Overview

### Project Name
**Fridge23 - Food Rescue App**

### Problem Statement
Globally, approximately one-third of all food produced is wasted. At the household level, consumers struggle to track what ingredients they have, leading to expired food being discarded and unnecessary grocery purchases. This results in both financial loss and environmental harm through increased carbon emissions from food waste decomposition.

### Goal & Vision
Fridge23 aims to transform how users manage their kitchen inventory by providing an intelligent, gamified platform that:
- Reduces household food waste through smart ingredient tracking
- Suggests recipes based on available (especially expiring) ingredients
- Gamifies the food-saving experience to encourage sustainable behavior
- Builds a community of eco-conscious home cooks

### Target Users
1. **Eco-conscious home cooks** - Individuals motivated by environmental sustainability
2. **Budget-conscious households** - Families looking to reduce grocery spending
3. **Busy professionals** - People who need quick meal planning assistance
4. **Health-focused users** - Those managing dietary restrictions who need recipe filtering

### Core Use Cases
1. **Inventory Scanning** - User photographs their fridge, AI identifies ingredients
2. **Recipe Discovery** - App suggests recipes prioritizing expiring ingredients
3. **Pantry Management** - Track staples with quantity and expiry monitoring
4. **Shopping Assistance** - Generate smart shopping lists with in-store voice assistance
5. **Impact Tracking** - Visualize environmental and financial savings
6. **Community Engagement** - Share tips, compete on leaderboards, earn badges

### Assumptions & Constraints
- **Assumptions:**
  - Users have a modern smartphone with a camera
  - Users are willing to scan/log their groceries
  - Recipe suggestions are AI-generated (simulated in current build)
  - Internet connectivity required for full functionality
  
- **Constraints:**
  - Current build is frontend-only (no backend server)
  - AI scanning is simulated, not actual ML inference
  - Data persisted only in localStorage (device-specific)
  - No real user authentication implemented

---

## 2. Design & UI/UX Documentation

### Design Philosophy
Fridge23 follows a **Modern Minimal Functional** design philosophy with these principles:
- **Clean and uncluttered** interfaces that prioritize content
- **Vibrant accent colors** to create energy and encourage action
- **Card-based layouts** for scannable information hierarchy
- **Smooth micro-animations** for satisfying user feedback
- **Mobile-first responsive design** optimized for handheld use

### Color Scheme

#### Light Mode
| Token | HSL Value | Hex Approximation | Usage |
|-------|-----------|-------------------|-------|
| `--background` | 80 20% 97% | #F9FAF7 | Main app background |
| `--foreground` | 210 22% 16% | #1F2933 | Primary text color |
| `--card` | 0 0% 100% | #FFFFFF | Card backgrounds |
| `--primary` | 126 91% 56% | #27F53C | Primary actions, accents |
| `--secondary` | 43 100% 51% | #FFB703 | Warnings, secondary highlights |
| `--muted` | 80 14% 95% | #F1F3EE | Disabled states, subtle backgrounds |
| `--destructive` | 1 76% 55% | #E53935 | Error states, delete actions |

#### Dark Mode
| Token | HSL Value | Hex Approximation | Usage |
|-------|-----------|-------------------|-------|
| `--background` | 0 0% 7% | #121212 | Main app background |
| `--card` | 0 0% 12% | #1E1E1E | Card backgrounds |

### Typography
- **Font Family:** Inter (Google Fonts) with system fallbacks
- **Scale:**
  - Page Title: 28px / semibold / line-height 1.3
  - Section Title: 20px / semibold / line-height 1.4
  - Card Title: 16px / semibold / line-height 1.4
  - Body: 14px / normal / line-height 1.6
  - Caption: 12px / medium / line-height 1.5
  - Nutrition: 16px / bold / line-height 1.2

### Layout Structure
- **Screen padding:** 16px horizontal (`.screen-padding`)
- **Border radius:** 12px (cards), 10px (buttons), 14px (images), 999px (pills)
- **Shadow system:** Card shadows (subtle), Floating shadows (elevated)
- **Bottom navigation:** Fixed at bottom, hidden on specific routes
- **Safe area:** Bottom padding of 24px for mobile navigation

### Component Hierarchy

```
App
├── SplashScreen (initial load)
├── BrowserRouter
│   ├── AppContent
│   │   ├── Routes (29 pages)
│   │   └── BottomNav (conditional)
│   └── Providers
│       ├── QueryClientProvider (TanStack Query)
│       ├── TooltipProvider
│       ├── Toaster (shadcn)
│       └── Sonner (toast notifications)
```

### Wireframes & Screens

#### A. Onboarding (3 slides)
| Screen | Purpose | Key Elements |
|--------|---------|--------------|
| Slide 1 | Introduce scanning | Fridge photo illustration, "Snap a photo" title |
| Slide 2 | Waste reduction | Food waste image, "Stop food waste, save money" |
| Slide 3 | Recipe confidence | Recipe card preview, "Cook with confidence" |

**Navigation:** Next button, Skip option, Progress dots

#### B. Home Dashboard
| Element | Purpose |
|---------|---------|
| Greeting header | Personalized welcome with time-of-day |
| Profile avatar button | Quick access to profile |
| Scan CTA card | Primary action to start scanning |
| Streak tracker | 7-day visual with flame icons |
| Stats cards (2) | Food saved (kg), Money saved ($) |

#### C. AI Scan Screen
| Element | Purpose |
|---------|---------|
| Camera view / Image upload | Capture or upload fridge photo |
| Scanning overlay | Visual feedback during analysis |
| Detected ingredient labels | Floating tags with confidence % |
| Progress indicator | Items found counter |
| Stop Scanning button | Transition to review |

#### D. Review Ingredients
| Element | Purpose |
|---------|---------|
| Scanned items list | Editable ingredient cards |
| Freshness indicators | Green/Yellow/Red status |
| Confidence badges | High/Check indicators |
| Find Recipes button | Navigate to recipe suggestions |

#### E. My Pantry
| Element | Purpose |
|---------|---------|
| Search bar | Filter pantry items |
| AI Scan button | Quick access to pantry scanning |
| Category filters | All, Grains, Spices, Oils, Baking |
| Grouped item list | Items by category with status |
| Add to List buttons | Quick add to shopping list |
| Shopping List access | View current list with count |

#### F. Recipe Details
| Element | Purpose |
|---------|---------|
| Hero image | Recipe photo with badges |
| Quick info bar | Time, servings, calories |
| Tab navigation | Ingredients, Instructions, Notes |
| Ingredients sections | In Kitchen / Missing |
| Nutrition facts | Macros with progress bars |
| Start Cooking button | Begin step-by-step mode |

#### G. Shopping List / Store Mode
| Element | Purpose |
|---------|---------|
| Items by category | Grouped shopping items |
| Checkbox toggles | Mark items as purchased |
| Price display | Estimated and actual prices |
| Budget tracker | Progress toward set limit |
| Voice command toggle | Hands-free operation |

#### H. Your Impact / Profile
| Element | Purpose |
|---------|---------|
| Cumulative stats | Money, CO2, food saved |
| Weekly activity chart | Cooking frequency visualization |
| Level & XP display | Gamification progress |
| Badge collection link | Achievement gallery |
| Recipe history | Previously cooked meals |

---

## 3. User Flow & Journey

### Entry Points
1. **Fresh Install:** Splash → Onboarding → Home
2. **Returning User:** Splash → Home (skip onboarding)
3. **Deep Links:** Not implemented in current build

### Happy Path - Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: DISCOVERY                                               │
│ Splash (2s) → Onboarding (3 slides) → Home                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: SCAN INGREDIENTS                                        │
│ Home → AI Scan → Upload/Capture Image → View Detections        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: REVIEW & REFINE                                         │
│ Review Ingredients → Edit quantities/freshness → Find Recipes  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: COOK A MEAL                                             │
│ Recipe Details → Add missing to list → Start Cooking           │
│ → Step-by-step guide → Complete → Save recipe                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: TRACK IMPACT                                            │
│ Cooking Complete → See XP earned → View impact stats           │
│ → Unlock badges → Check leaderboard                            │
└─────────────────────────────────────────────────────────────────┘
```

### Alternate Paths

#### Path A: Shopping Flow
```
Home → My Pantry → Add low/empty items to list → Shopping List 
→ Store Mode → Voice commands → Finish Shopping 
→ Inventory Updated
```

#### Path B: Community Exploration
```
Home → Your Impact → First Rescue Badge → Eco Hero Library 
→ Leaderboard → Community Pulse
```

#### Path C: Profile Management
```
Home → Profile → Settings → Health Constraints (dietary prefs) 
→ Notification Preferences
```

### Error States
| State | Screen | Recovery |
|-------|--------|----------|
| Network offline | ConnectionLost | Retry button, offline messaging |
| 404 Not Found | NotFound | Return to home button |
| Scan failed | AIScan | Re-upload or manual entry |
| Empty pantry | MyPantry | Prompt to scan/add items |

### Permissions / Auth Flow
**Not implemented in current build.** The app includes Login and Signup page mockups, but these are non-functional UI screens without actual authentication logic.

---

## 4. Features Breakdown

### 4.1 AI Ingredient Scanning

**Feature Name:** AI-Powered Fridge Scanning

**Description:** Users can photograph their refrigerator contents, and the app's AI identifies visible ingredients with confidence scores and freshness estimates.

**Why It Exists:** Manual inventory entry is tedious and often abandoned. Visual scanning reduces friction and encourages regular use.

**How It Works Internally:**
1. User taps "Start Scanning" from Home
2. Camera feed or image upload interface displayed
3. **Simulated AI detection** runs with predefined ingredient data
4. Detection animation shows ingredient labels appearing
5. Confidence percentages (88-98%) and positions are pre-configured
6. User proceeds to Review Ingredients screen

**User Interaction Steps:**
1. Navigate to Home → Tap "Start Scanning"
2. Allow camera access or upload an image
3. Watch as ingredients are detected (animated)
4. Tap "Stop Scanning" when satisfied
5. Review and edit detected items

**Dependencies:**
- `useScanSession` hook for state management
- Asset images for ingredient representation
- Browser File API for image upload

**Limitations:**
- Detection is **entirely simulated** - no ML model
- Fixed set of demo ingredients returned
- No actual image analysis performed

---

### 4.2 Pantry Management

**Feature Name:** My Pantry

**Description:** A comprehensive inventory system for tracking kitchen staples, their quantities, expiration dates, and stock levels.

**Why It Exists:** Knowing what you have prevents duplicate purchases and enables recipe matching.

**How It Works Internally:**
1. Pantry data stored in localStorage (`fridgeai-pantry` key)
2. `usePantry` hook provides CRUD operations
3. Items categorized by type (Grains, Spices, Oils, etc.)
4. Status indicators: Full (green), Low (yellow/warning), Empty (gray)
5. Direct integration with shopping list for restocking

**User Interaction Steps:**
1. Navigate to My Pantry via bottom nav
2. Search or filter by category
3. View items grouped by category
4. Tap item options menu to edit/delete
5. Tap "Add to List" for low/empty items
6. Click floating + button to scan more items

**Data Model (PantryItem):**
```typescript
interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  expiry: string;
  status: "full" | "low" | "empty";
  image: string; // emoji
  category: string;
}
```

**Dependencies:**
- `usePantry` hook
- `useShoppingList` hook for list integration
- `useToast` for feedback

**Limitations:**
- Manual expiry date entry
- No push notifications for expiring items

---

### 4.3 Smart Shopping List

**Feature Name:** Shopping List with Store Mode

**Description:** A shopping list that organizes items by store aisle, estimates costs, tracks budget, and supports voice commands for hands-free operation.

**Why It Exists:** Streamlines the grocery shopping experience and helps users stay on budget.

**How It Works Internally:**
1. Items stored in localStorage (`fridgeai-shopping-list`)
2. `useShoppingList` hook manages state with price estimates
3. Automatic aisle assignment based on item keywords
4. Store Mode activates hands-free features:
   - Voice commands via Web Speech API
   - Text-to-speech for reading list aloud
5. Budget tracking with alerts at 85% and 100%

**User Interaction Steps:**
1. Add items from Pantry or Recipe Details
2. View Shopping List with category grouping
3. Enter Store Mode for in-store use
4. Use voice: "Got milk", "Check eggs", "Read my list"
5. Tap prices to adjust based on actual cost
6. Set budget limit in Store Mode
7. Finish Shopping → items auto-added to Pantry

**Voice Command Patterns:**
- Check items: "check [item]", "got [item]", "done [item]"
- Uncheck: "uncheck [item]", "put back [item]"
- Read list: "read my list", "what's left"

**Data Model (ShoppingItem):**
```typescript
interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  source: string; // Pantry or Recipe name
  checked: boolean;
  category: "outOfStock" | "recipes";
  aisle?: string;
  price?: number;
}
```

**Dependencies:**
- `useShoppingList` hook
- `useVoiceCommands` hook
- `useSpeechSynthesis` hook
- `usePantry` for finish flow

**Limitations:**
- Voice recognition browser-dependent
- Aisle mapping is keyword-based, not store-specific

---

### 4.4 Recipe Discovery & Cooking

**Feature Name:** Recipe Details & Guided Cooking

**Description:** Detailed recipe views with nutritional information, ingredient management, personal notes, and step-by-step cooking guidance.

**Why It Exists:** Helps users cook confidently with available ingredients while tracking dietary intake.

**How It Works Internally:**
1. Recipe data is hardcoded (demo: Avocado & Lime Chicken)
2. Three-tab interface: Ingredients, Instructions, My Notes
3. Ingredient split between "In Kitchen" and "Missing"
4. One-tap add missing ingredients to shopping list
5. Nutrition bars show progress toward daily targets
6. Notes support quick tags and private/public toggle
7. Step-by-step cooking mode with timer displays

**User Interaction Steps:**
1. Navigate to Recipe Details from search results
2. Review ingredients (already have vs. missing)
3. Add missing items to shopping list
4. Read instructions and nutrition info
5. Add personal notes (e.g., "Doubled garlic - perfect!")
6. Tap "Start Cooking" for guided mode
7. Follow steps → Mark complete → Earn XP

**Nutrition Display:**
- Macros: Protein, Carbs, Fat with progress bars
- Micronutrients: Vitamin C, Iron, B12 (tags)
- "Per serving" context

**Recipe Notes System:**
- Quick tags: "Too salty", "Perfect", "Need more time"
- Text entry with placeholder suggestions
- Private toggle (visible to you only)
- History of previous notes with dates

**Limitations:**
- Single hardcoded recipe for demo
- No recipe search functionality
- No AI-powered recipe generation
- Notes not persisted to backend

---

### 4.5 Gamification System

**Feature Name:** XP, Levels, Badges & Leaderboard

**Description:** A comprehensive gamification layer that rewards users for sustainable cooking behaviors with experience points, levels, badges, and community rankings.

**Why It Exists:** Gamification increases engagement and makes sustainability feel rewarding rather than burdensome.

**How It Works Internally:**
1. `useUser` hook tracks profile, stats, and history
2. `useGamification` hook manages badges and leaderboard
3. XP calculated: Base 100 + (money saved × 10)
4. Level = 1 + floor(XP / 1000)
5. Streak tracking: Increments when cooking on consecutive days
6. Badge definitions with condition functions
7. Leaderboard merges mock users with current user data

**Badge System:**
| Badge | Condition | Icon |
|-------|-----------|------|
| First Rescue | foodRescued > 0 | 🌱 |
| Thrifty Chef | moneySaved >= $50 | 💰 |
| Streak Master | streak >= 7 days | 🔥 |
| Climate Hero | co2Saved >= 10kg | 🌍 |

**XP Events:**
- Completing a recipe cook
- Using ingredients before expiry
- Consecutive day activity

**Data Model (UserData):**
```typescript
interface UserData {
  profile: { name, avatar, level, xp, joinDate };
  stats: { moneySaved, co2Saved, foodRescued, streak, lastActiveDate };
  history: CookedRecipe[];
  settings: { notifications, dietaryPreferences };
}
```

**Limitations:**
- Mock leaderboard with fake users
- No cross-device sync
- No social features (friends, challenges)

---

### 4.6 Impact Tracking

**Feature Name:** Your Impact Dashboard

**Description:** Visual representation of the user's environmental and financial contributions through food waste prevention.

**Why It Exists:** Tangible feedback reinforces positive behavior and provides motivation to continue.

**How It Works Internally:**
1. Stats aggregated from `useUser` hook
2. Weekly activity calculated from cooking history
3. Bar chart shows recipes cooked per week (4 weeks)
4. CO2 calculations use standardized conversion factors (simulated)
5. Top rescued categories display most-saved food types

**Displayed Metrics:**
- **Money Saved:** Cumulative dollar amount
- **Food Rescued:** Weight in lbs/kg
- **CO2 Prevented:** Estimated emissions avoided
- **Streak:** Consecutive active days

**User Interaction Steps:**
1. Navigate via Home stats cards or Profile
2. View cumulative savings banner
3. Scroll to weekly activity chart
4. See top rescued food categories
5. Tap "Share My Impact" (non-functional)

**Limitations:**
- CO2 calculations are approximate/simulated
- No data export
- Share functionality not implemented

---

### 4.7 Health Constraints & Dietary Preferences

**Feature Name:** Dietary Profile Management

**Description:** Allows users to specify dietary restrictions and health goals for personalized recipe filtering.

**Why It Exists:** Many users have allergies, religious requirements, or lifestyle choices affecting what they can eat.

**How It Works Internally:**
1. Settings stored in user profile via `useUser`
2. List of common dietary preferences
3. Toggle switches for each preference
4. Saved to localStorage with user data

**Available Preferences (examples):**
- Vegetarian / Vegan
- Gluten-Free
- Dairy-Free
- Nut Allergy
- Low Sodium
- Halal / Kosher

**Limitations:**
- Preferences stored but **not used for filtering** (no recipe database)
- No ingredient-level allergen warnings

---

## 5. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND ONLY                            │
│                    (No Backend Server)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐   │
│  │   React     │   │  TanStack   │   │   React Router      │   │
│  │   18.x      │◄──│   Query     │◄──│   (Navigation)      │   │
│  │   (UI)      │   │   (State)   │   │                     │   │
│  └──────┬──────┘   └─────────────┘   └─────────────────────┘   │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    CUSTOM HOOKS                          │   │
│  │  usePantry | useShoppingList | useUser | useGamification │   │
│  │  useScanSession | useVoiceCommands | useSpeechSynthesis  │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 BROWSER APIS                             │   │
│  │  localStorage | Web Speech API | File API | Camera      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Folder Structure

```
fridge23fork/
├── public/                 # Static assets
│   └── favicon.png
├── src/
│   ├── assets/             # Images (PNG, SVG)
│   │   ├── fridge-contents.png
│   │   ├── onboarding-*.png
│   │   ├── ingredient-*.png
│   │   └── buddha-bowl.png
│   ├── components/
│   │   ├── ui/             # 49 shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/         # App chrome components
│   │   │   ├── BottomNav.tsx
│   │   │   └── SplashScreen.tsx
│   │   ├── common/         # Shared components
│   │   ├── pantry/         # Pantry-specific components
│   │   ├── shopping/       # Shopping list components
│   │   │   ├── PriceEditModal.tsx
│   │   │   └── BudgetLimitModal.tsx
│   │   └── recipes/        # Recipe components
│   ├── hooks/              # Custom React hooks
│   │   ├── usePantry.ts
│   │   ├── useShoppingList.ts
│   │   ├── useUser.ts
│   │   ├── useGamification.ts
│   │   ├── useScanSession.ts
│   │   ├── useVoiceCommands.ts
│   │   ├── useSpeechSynthesis.ts
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── pages/
│   │   ├── auth/           # Login, Signup, Onboarding
│   │   ├── core/           # Home, NotFound, ConnectionLost
│   │   ├── recipes/        # AI Scan, Review, Details, Cooking
│   │   ├── pantry/         # MyPantry, PantryScan, InventoryUpdated
│   │   ├── shopping/       # ShoppingList, StoreMode
│   │   ├── community/      # Impact, Leaderboard, Badges
│   │   └── user/           # Profile, Settings, Preferences
│   ├── lib/
│   │   └── utils.ts        # Utility functions (cn, etc.)
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles & design tokens
├── index.html              # HTML template with meta tags
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript config
└── vite.config.ts          # Vite build config
```

### State Management Approach

**Pattern:** Custom React Hooks with localStorage persistence

Each major feature domain has a dedicated hook:

| Hook | Responsibility |
|------|----------------|
| `usePantry` | Pantry item CRUD, localStorage sync |
| `useShoppingList` | Shopping items, aisle organization, prices |
| `useUser` | Profile, stats, history, impact tracking |
| `useGamification` | Badges, leaderboard, XP calculations |
| `useScanSession` | Temporary scan state (not persisted) |

**Why not Redux/Zustand/Context?**
- App complexity is manageable with hooks
- Co-location of state logic with usage
- localStorage sync simple to implement
- No cross-cutting concerns requiring global state

### Data Flow

```
User Interaction
       │
       ▼
Page Component
       │
       ▼
Custom Hook (e.g., usePantry)
       │
       ├──► useState (React State)
       │         │
       │         ▼
       │    useEffect (Persist)
       │         │
       │         ▼
       │    localStorage.setItem()
       │
       └──► Return { state, actions }
                 │
                 ▼
            UI Updates
```

---

## 6. API Documentation

### External APIs Used

**Currently: None**

The application operates entirely client-side without external API calls. All data is local.

### Prepared Backend Integrations (Not Implemented)

The codebase includes `@supabase/supabase-js` in dependencies, suggesting planned integration:

| Planned Service | Purpose |
|-----------------|---------|
| Supabase Auth | User authentication |
| Supabase Database | Persistent storage |
| Supabase Storage | Image uploads |

### Simulated/Mock APIs

#### AI Ingredient Detection (Simulated)
- **Location:** `useScanSession.ts`
- **Behavior:** Returns predefined ingredients after delay
- **Response Schema:**
```typescript
interface ScanItem {
  id: string;
  name: string;
  quantity: string;
  image: string;
  freshness: "use-soon" | "fresh" | "frozen" | "unknown";
  confidence: "high" | "check";
  status: "green" | "yellow" | "red";
}
```

---

## 7. Data & Storage

### Data Models

#### PantryItem
```typescript
interface PantryItem {
  id: string;          // UUID
  name: string;        // e.g., "Basmati Rice"
  quantity: string;    // e.g., "2kg bag"
  expiry: string;      // e.g., "Dec 2025"
  status: "full" | "low" | "empty";
  image: string;       // Emoji representation
  category: string;    // e.g., "Grains & Pasta"
}
```

#### ShoppingItem
```typescript
interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  source: string;           // Origin: "Pantry" or recipe name
  checked: boolean;
  category: "outOfStock" | "recipes";
  aisle?: string;           // Auto-assigned
  price?: number;           // Estimated/actual
}
```

#### UserData
```typescript
interface UserData {
  profile: {
    name: string;
    avatar: string;
    level: number;
    xp: number;
    joinDate: string;
  };
  stats: {
    moneySaved: number;
    co2Saved: number;
    foodRescued: number;
    streak: number;
    lastActiveDate: string;
  };
  history: CookedRecipe[];
  settings: {
    notifications: boolean;
    dietaryPreferences: string[];
  };
}
```

### localStorage Keys

| Key | Contents | Hook |
|-----|----------|------|
| `fridgeai-pantry` | PantryItem[] | usePantry |
| `fridgeai-shopping-list` | ShoppingItem[] | useShoppingList |
| `fridge23_user_data` | UserData | useUser |
| `fridge23_badges` | string[] (badge IDs) | useGamification |
| `fridgeai-budget-limit` | number | StoreMode |

### Caching Strategy
- **No explicit caching layer**
- React Query available but not utilized for remote data
- localStorage provides implicit persistence

### File Handling
- **Image uploads:** File API → blob URL (in-memory only)
- **Profile avatar:** Stored as blob URL or dicebear URL
- **Recipe images:** Static assets bundled at build time

---

## 8. Configuration & Environment

### Environment Variables

**Not implemented.** All configuration is hardcoded.

Future variables would include:
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=
```

### Build Setup

**Package Manager:** npm  
**Build Tool:** Vite 7.x  
**Language:** TypeScript 5.x

#### Scripts
```json
{
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

### Dev vs Production Differences

| Aspect | Development | Production |
|--------|-------------|------------|
| Build | HMR enabled | Minified bundle |
| Source maps | Enabled | Disabled |
| Assets | Unbundled | Optimized/hashed |

### Required Dependencies

**Runtime (26 packages):**
- React 18.x, React DOM, React Router DOM
- @tanstack/react-query
- @radix-ui/* (14 primitives)
- lucide-react (icons)
- date-fns, zod
- class-variance-authority, clsx, tailwind-merge
- next-themes, sonner, vaul
- recharts, embla-carousel-react

**Development (16 packages):**
- TypeScript, Vite, ESLint
- Tailwind CSS, PostCSS, Autoprefixer
- @vitejs/plugin-react-swc

### Setup Instructions

```bash
# Clone repository
git clone https://github.com/amirtishiva/fridge23fork.git
cd fridge23fork

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 9. Security & Permissions

### Authentication Flow
**Not implemented.** Login/Signup pages are UI mockups only.

### Authorization Rules
**Not implemented.** All features accessible without auth.

### Data Protection Measures
- All data stored in browser localStorage (device-specific)
- No data transmitted to external servers
- No PII collected or stored on servers

### Browser Permissions Used
| Permission | Feature | User Prompt |
|------------|---------|-------------|
| Camera | AI Scan, Pantry Scan | Yes (browser native) |
| Microphone | Voice commands | Yes (browser native) |
| Speech Synthesis | Read list aloud | No prompt required |
| localStorage | Data persistence | No prompt required |

### Known Security Gaps
1. No user authentication
2. localStorage accessible via browser DevTools
3. No input sanitization for user-generated notes
4. No HTTPS enforcement (depends on deployment)
5. No rate limiting (no API calls)

---

## 10. Error Handling & Edge Cases

### Validation Logic

**Shopping List:**
- Duplicate check before adding items
- Price cannot be negative (modal validation)
- Budget limit minimum $1

**Pantry:**
- Name required for new items
- Quantity validation (string format)

**Notes:**
- Empty note submission prevented
- Character limits not enforced

### Error Messages

| Scenario | Message | Action |
|----------|---------|--------|
| Item already in list | "Already in list" toast | No action |
| Network offline | "Connection lost" page | Retry button |
| Page not found | "Oops! Page not found" | Home button |
| Feature coming soon | "Edit feature coming soon" toast | Dismiss |

### Failure States

**Voice Recognition Failures:**
- Browser not supported: Voice UI hidden
- Permission denied: Shows error toast
- No match found: Silent (no feedback)

**Image Upload Failures:**
- Invalid file type: Ignored
- Large file: No limit enforced

### Recovery Mechanisms
- Automatic localStorage restoration on app restart
- Reset functions available for testing (`resetUser()`)
- Connection lost page with retry option

---

## 11. Limitations & Known Gaps

### Intentionally Not Implemented
1. **Real AI/ML:** All detection is simulated
2. **Backend server:** Pure frontend application
3. **User accounts:** No registration/login
4. **Cloud sync:** Data device-specific only
5. **Push notifications:** No service worker
6. **Recipe database:** Single hardcoded recipe

### Partially Implemented
1. **Login/Signup pages:** UI only, no functionality
2. **Share feature:** Button exists, no sharing logic
3. **Edit pantry item:** Menu option, toast "coming soon"
4. **Dietary filtering:** Preferences saved, not used
5. **Dark mode:** CSS defined, no toggle in UI

### Requires Future Work
1. Backend API integration
2. User authentication with Supabase
3. Real ML model for ingredient detection
4. Recipe recommendation engine
5. Social features (friends, sharing)
6. Push notifications for expiring items
7. Cross-device synchronization
8. Offline-first architecture

---

## 12. Future Enhancements

### Scalability Improvements
1. **Server-side rendering** for SEO and faster initial load
2. **Database migration** from localStorage to PostgreSQL/Supabase
3. **CDN distribution** for global performance
4. **API rate limiting** and caching

### Feature Expansions
1. **Real AI scanning** using TensorFlow.js or cloud ML
2. **Recipe generation** based on available ingredients
3. **Meal planning** with weekly calendars
4. **Community recipes** sharing platform
5. **Smart home integration** (smart fridge APIs)
6. **Multi-language support**
7. **Household accounts** with shared pantries

### UX Improvements
1. **Dark mode toggle** in settings
2. **Accessibility audit** and improvements
3. **Onboarding skip memory**
4. **Empty state improvements**
5. **Loading skeleton refinement**
6. **Haptic feedback** on mobile

### Performance Optimizations
1. **Code splitting** per route
2. **Image lazy loading**
3. **Virtual list** for large pantries
4. **Service worker** for offline support
5. **Bundle size optimization**

---

## 13. How to Use This Project

### Step-by-Step Usage Guide

#### Scenario 1: First-Time User
1. Launch the app → Watch splash screen
2. Swipe through 3 onboarding slides
3. Tap "Get Started" to reach Home
4. Explore the interface

#### Scenario 2: Scan and Cook
1. From Home, tap "Start Scanning"
2. Upload a fridge photo or use camera
3. Watch ingredients appear with labels
4. Tap "Stop Scanning"
5. Review detected ingredients
6. Tap "Find Recipes" (shows Recipe Details)
7. Review ingredients you have vs. need
8. Add missing items to shopping list
9. Tap "Start Cooking"
10. Follow step-by-step instructions
11. Complete cooking → See XP earned

#### Scenario 3: Grocery Shopping
1. Navigate to My Pantry
2. Find items marked "Low" or "Empty"
3. Tap "Add to List" to build shopping list
4. Go to Shopping List page
5. Tap "Store Mode" for in-store use
6. Enable voice commands ("Got milk")
7. Set budget limit
8. Check off items as you shop
9. Tap "Finish Shopping"
10. Items auto-added to pantry

#### Scenario 4: Track Your Progress
1. From Home, tap "Food Saved" or "Money Saved"
2. View Your Impact dashboard
3. Check weekly activity chart
4. Navigate to Profile
5. See total impact, level, XP
6. Visit Eco-Hero Library for badges
7. Check Leaderboard for rankings

### Pages Quick Reference

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Onboarding | First-time user introduction |
| `/home` | Home | Main dashboard |
| `/scan` | AI Scan | Photograph fridge |
| `/review-ingredients` | Review | Edit scanned items |
| `/recipe-details` | Recipe | View recipe and cook |
| `/my-pantry` | Pantry | Inventory management |
| `/shopping-list` | Shopping | Build grocery list |
| `/store-mode` | Store Mode | In-store assistant |
| `/your-impact` | Impact | Progress visualization |
| `/profile` | Profile | User info and stats |
| `/leaderboard` | Leaderboard | Community rankings |
| `/settings` | Settings | App preferences |

---

## Technical Notes for Developers

### Running Tests
**Not implemented.** No test suite exists in the current build.

To add tests:
```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Add test script to package.json
"test": "vitest"
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

### Code Formatting
ESLint configured with React hooks and refresh plugins.

---

## 14. Enhanced Container Scanning Flow (Indian Household Focus)

> **Added:** January 17, 2026  
> **Purpose:** Define AI scanning behavior for opaque containers, wrapped items, and user-assisted labeling

### Problem Statement

Indian household refrigerators present unique challenges for AI-based ingredient detection:
- **Opaque containers**: Steel dabbas, colored Tupperware, brass bottles
- **Misleading packaging**: Ice cream boxes containing rotis, reused jars
- **Wrapped items**: Polythene-wrapped vegetables, newspaper-covered produce
- **Culturally-specific items**: Chutneys, pickles, dal, dough, masalas

### Detection Categories

| Category | Detection Capability | Example | Confidence |
|----------|---------------------|---------|------------|
| **Clear identification** | AI can detect with high accuracy | Branded products, visible produce | 85-98% |
| **Low confidence** | Partial visibility, AI guesses | Polythene-wrapped items | 50-75% |
| **Container detected** | Container type known, contents unknown | Steel dabba, Tupperware | 90%+ for container, 0% for contents |
| **Fully unknown** | Cannot determine | Opaque wrapped bundles | N/A |

### Scanning Flow UI Behavior

#### Phase 1: Active Scanning
```
┌────────────────────────────────────────────────────────────┐
│  AI Processing Scan                               [X]      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│              [Camera/Image View]                           │
│                                                            │
│    ┌──────────────────┐                                    │
│    │ ✓ Spinach (98%)  │  ← High confidence (green check)  │
│    └──────────────────┘                                    │
│                                                            │
│    ┌──────────────────────────┐                            │
│    │ ? Wrapped Item           │  ← Tappable hotspot        │
│    │   Low Confidence         │                            │
│    └──────────────────────────┘                            │
│                                                            │
│    ┌──────────────────────────┐                            │
│    │ 🍴 Steel Container (94%) │  ← Tappable hotspot        │
│    │    Contents unknown      │                            │
│    └──────────────────────────┘                            │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  🎙️ "Tied bag or steel dabba? Tap to label."              │
├────────────────────────────────────────────────────────────┤
│  [Progress bar]                                            │
│  ⚠️ Unknown containers detected. Tap hotspots to clarify. │
│                                                            │
│  [        Stop Scanning        ]  (green button)           │
└────────────────────────────────────────────────────────────┘
```

#### Phase 2: Container Labeling Bottom Sheet

When user taps an unknown container hotspot:

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│        What's inside this Dabba?                           │
│        Help the AI identify this container                 │
│                                                            │
│  ✨ AI Suggestions                                         │
│  ┌──────┐  ┌────────┐  ┌────────┐                         │
│  │✓ Dal?│  │? Dough?│  │? Curd? │   ← Based on container  │
│  └──────┘  └────────┘  └────────┘                         │
│                                                            │
│  Common Staples                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                      │
│  │G-G Paste│ │ Chutney │ │Leftovers│                      │
│  └─────────┘ └─────────┘ └─────────┘                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                      │
│  │  Masala │ │   Milk  │ │  Pickle │                      │
│  └─────────┘ └─────────┘ └─────────┘                      │
│                                                            │
│  ┌────────────────────────────────┐ ┌──────┐              │
│  │ Other...                       │ │ 🎙️  │   ← Voice    │
│  └────────────────────────────────┘ └──────┘              │
│                                                            │
│  [          Label Container          ]  (dark button)      │
└────────────────────────────────────────────────────────────┘
```

### Differentiated UI: Wrapped vs Sealed Containers

| Aspect | Wrapped Items | Sealed Containers |
|--------|---------------|-------------------|
| **Examples** | Polythene vegetables, halved produce | Jars, bottles, dabbas |
| **AI Suggestions** | Generic: "Vegetable?", "Fruit?", "Herbs?" | Context-aware: "Dal?", "Curd?", "Pickle?" |
| **Quick Tags** | Produce-focused | Storage staples |
| **Custom Input** | Free text + quantity | Label + content type |

### Data Model Updates

#### Enhanced ScanItem Interface
```typescript
interface ScannedItem {
  id: string;
  name: string;                    // AI-detected or user-labeled
  quantity: string;
  image?: string;                  // Cropped region from scan
  
  // Detection metadata
  detection_type: 'identified' | 'low_confidence' | 'container' | 'unknown';
  confidence: number;              // 0-100
  container_type?: 'steel_dabba' | 'tupperware' | 'wrapped' | 'bottle' | 'jar' | 'polythene';
  
  // User labeling
  is_user_labeled: boolean;
  ai_suggestions?: string[];       // ["Dal", "Dough", "Curd"]
  user_label?: string;             // What user selected/typed
  
  // Hotspot for UI rendering
  hotspot_position: { top: string; left: string };
  
  // Freshness (when determinable)
  freshness?: 'fresh' | 'use-soon' | 'expired' | 'unknown';
}
```

#### Container Label Record (v2 - Forward Compatible)
```typescript
// Designed for future container memory feature
interface ContainerMemory {
  id: string;
  user_id: string;
  container_visual_hash?: string;  // For visual recognition
  container_type: string;
  typical_contents: string[];      // User's common labels for this container
  last_labeled: string;
  label_count: number;
}
```

### Behavior Rules

#### 1. Multiple Unknown Containers
- All detected during single scan session
- Collected and displayed together on Review Ingredients screen
- User can label from Review screen (not required during scan)

#### 2. Optional Labeling
- User can skip any labeling step
- Unlabeled items appear with "Unknown" tag
- Fully editable in Review Ingredients phase
- No blocking of scan flow

#### 3. Post-Scan Navigation
```
Stop Scanning → Review Ingredients
                      │
                      ├── Labeled items: Show with user label
                      ├── AI-detected: Show with AI name + confidence
                      └── Unlabeled containers: Show "Unknown" + edit option
```

#### 4. Voice Input
- Microphone button triggers Web Speech API
- Transcribed text populates label field
- User can manually edit before confirming

#### 5. Re-labeling Support
- Any item (labeled or not) can be tapped to update
- Opens same bottom sheet with current label pre-selected
- Label changes reflect immediately in UI

### AI Edge Function Specification

#### Request
```typescript
interface ScanIngredientsRequest {
  image_base64: string;
  user_preferences?: string[];     // Dietary restrictions for context
  locale?: 'en-IN' | 'hi-IN';      // Indian English or Hindi
}
```

#### Response
```typescript
interface ScanIngredientsResponse {
  items: {
    id: string;
    name: string | null;           // null if unknown
    quantity: string;
    detection_type: 'identified' | 'low_confidence' | 'container' | 'unknown';
    confidence: number;
    container_type?: string;
    ai_suggestions?: string[];     // For containers
    freshness?: string;
    hotspot_position: { top: string; left: string };
    bounding_box?: { x: number; y: number; width: number; height: number };
  }[];
  processing_time_ms: number;
  model_version: string;
}
```

### Common Staples for Indian Households

| Category | Items |
|----------|-------|
| **Cooked Dal** | Toor, Moong, Masoor, Chana |
| **Chutneys** | Coconut, Mint, Tamarind, Tomato |
| **Fermented** | Curd, Buttermilk, Dosa batter, Idli batter |
| **Prepared** | Dough (atta), Masala paste, Ginger-Garlic paste |
| **Leftovers** | Curry, Rice, Sabzi, Roti |
| **Pickles** | Mango, Lime, Mixed, Garlic |
| **Dairy** | Milk, Paneer, Cream, Ghee |

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Jan 17, 2026 | Antigravity AI | Initial documentation |
| 1.1.0 | Jan 17, 2026 | Antigravity AI | Added Enhanced Container Scanning Flow (Section 14) |

---

*This documentation was generated by analyzing the Fridge23 codebase. All features, limitations, and technical details are derived from actual source code examination.*

