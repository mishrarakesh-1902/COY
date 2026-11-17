# Coy SDE Intern Assignment: Full Architectural Blueprint & Technical Report

An enterprise-grade, mobile-first, privacy-engineered **"Discover"** card-swiping and confidential mutual matching engine built for **Coy** ([app.getcoy.com](https://app.getcoy.com)).

---

## 📸 Visual Showcase & Screenshots

> *Replace the placeholder paths below with your actual recorded screenshots or demo GIFs.*

<div align="center">
  <table>
    <tr>
      <td align="center" width="50%">
        <b>📱 1. Discover Swipe Stack & Card Gestures</b><br/><br/>
        <!-- SCREENSHOT 1: Attach your Discover Tab / Swipe gesture screenshot below -->
        <img src="./docs/screenshots/discover-swipe.png" alt="Discover Tab Swipe Experience" width="100%" style="border-radius: 12px; border: 1px solid #334155;" />
        <br/>
        <i>Smooth card drag physics, live "LIKE/PASS" badges, college tags, and bottom controls</i>
      </td>
      <td align="center" width="50%">
        <b>🎉 2. "It's a Match!" Celebration & Modal</b><br/><br/>
        <!-- SCREENSHOT 2: Attach your Match modal celebration screenshot below -->
        <img src="./docs/screenshots/its-a-match.png" alt="It's a Match Modal Celebration" width="100%" style="border-radius: 12px; border: 1px solid #334155;" />
        <br/>
        <i>Real-time confetti particle explosion, dual avatars, and instant transition to Matches</i>
      </td>
    </tr>
  </table>
</div>

---

## 📋 Table of Contents
1. [Assignment Requirement vs. Delivered Status Matrix](#-assignment-requirement-vs-delivered-status-matrix)
2. [Part A: Product Exploration & Core Feature Suggestions](#-part-a-product-exploration--core-feature-suggestions)
3. [System Architecture & Data Flow](#-system-architecture--data-flow)
4. [Strict Privacy Guarantee (The Core Promise of Coy)](#-strict-privacy-guarantee-the-core-promise-of-coy)
5. [Backend API Specifications](#-backend-api-specifications)
6. [Frontend UI/UX & Gesture Engineering](#-frontend-uiux--gesture-engineering)
7. [Local Setup, Execution & Testing Guide](#-local-setup-execution--testing-guide)

---

## 📊 Assignment Requirement vs. Delivered Status Matrix

This table maps every single requirement stated in the assignment PDF directly to our concrete implementation:

| Section | Exact PDF Requirement | Implementation in this Codebase | Status |
|---|---|---|:---:|
| **Part A** | Sign up & explore Coy flows (Phone OTP, Adding crush, Email verification, Invite link, Extra slots) | Explored complete user loop; synthesized viral growth & friction edge cases | **DONE ✅** |
| **Part A** | Suggest two core features for Coy with business & user rationale | Proposed: **1) Campus Orbit Proximity Badges**, and **2) Timed Crush Windows with Urgency Drops** | **DONE ✅** |
| **Part B: Scope** | Standalone app in public GitHub repo with tab bar | Built at `https://github.com/mishrarakesh-1902/COY.git` with persistent state | **DONE ✅** |
| **Part B: Scope** | Placeholder "Home" tab (kept blank) alongside "Discover" tab | Fixed bottom navigation bar with blank placeholder `HomePlaceholder.tsx` and active `Discover` tab | **DONE ✅** |
| **Part B: Tech Stack** | Frontend: React.js or Next.js (preferred), mobile-first | **Next.js 14 (App Router) + TypeScript + Tailwind CSS** structured in mobile frame (`max-w-md`) | **DONE ✅** |
| **Part B: Tech Stack** | Backend: Node.js with Express, or Next.js API routes | **Next.js Route Handlers** (`/app/api/...`) with URL rewrites for clean endpoints | **DONE ✅** |
| **Part B: Tech Stack** | Data: JSON file, SQLite or database of choice (no auth needed) | **File-backed persistent JSON engine (`data/coy_storage.json`)** with single logged-in session | **DONE ✅** |
| **1. Profile Data** | Seed at least 30 mock profiles (name, age, photo, bio, city/college, interests) | **32 realistic Indian university student profiles** in `data/profiles.ts` with Unsplash portraits and badges | **DONE ✅** |
| **1. Profile Data** | Some seeded profiles should have already liked user for demo matches | **12 profiles** pre-seeded with server-side `hasPreLikedMe: true` (e.g., Aanya Sharma, Meera Patel) | **DONE ✅** |
| **2. Swipe UX** | Show one profile card at a time with smooth animations | **Framer Motion stack** with spring physics, rotation tilt, and subtle preview of next card | **DONE ✅** |
| **2. Swipe UX** | Drag gestures on mobile, buttons on desktop | Touch `drag="x"`, desktop action buttons (❌ Pass, 💚 Like), and keyboard arrows ($\leftarrow / \rightarrow$) | **DONE ✅** |
| **2. Swipe UX** | Clear feedback on each swipe | Dynamic **"LIKE"** (emerald) and **"PASS"** (rose) stamps scaling opacity based on drag distance | **DONE ✅** |
| **2. Swipe UX** | Swiped profile must never appear again | User swipes are recorded persistently; filtered out from subsequent feed queries | **DONE ✅** |
| **2. Swipe UX** | Clear empty state when there are no profiles left | Friendly **"You're all caught up"** screen with a one-click **Reset Demo Profiles** button | **DONE ✅** |
| **3. Matching** | Match happens only when both users have liked each other | Evaluated strictly on the server: `action === 'like' && profile.hasPreLikedMe === true` | **DONE ✅** |
| **3. Matching** | Show an "It's a match!" screen at that moment | Animated celebratory modal with **Canvas Confetti**, interlocking avatars, and pulsing heart | **DONE ✅** |
| **3. Matching** | A "Matches" view listing all mutual matches | Dedicated **Matches tab** featuring live badge counter, story carousels, and secret chat modal | **DONE ✅** |
| **3. Matching** | **Never reveal who liked user unless mutual (Core Promise)** | `hasPreLikedMe` is stripped from all feed payloads; client inspection in DevTools shows 0 leaks | **DONE ✅** |
| **4. Backend APIs** | `GET /feed`: returns profiles not yet swiped on | Handled via `GET /api/feed` (and `/feed` rewrite) | **DONE ✅** |
| **4. Backend APIs** | `POST /swipe`: records like/pass & returns if match occurred | Handled via `POST /api/swipe` (and `/swipe` rewrite) returning `{ match: boolean, matchedProfile }` | **DONE ✅** |
| **4. Backend APIs** | `GET /matches`: returns user's mutual matches | Handled via `GET /api/matches` (and `/matches` rewrite) returning mutual matches list | **DONE ✅** |
| **4. Backend APIs** | Swipes and matches must persist across page reloads | Stored in `data/coy_storage.json`; survives hard browser refreshes | **DONE ✅** |

---

## 💡 Part A: Product Exploration & Core Feature Suggestions

### Exploration Context
Coy is built on a radical value proposition: **Zero-risk romantic intent**. In standard dating apps, broadcasting a profile exposes users to social exposure or embarrassment. Coy solves this by creating a double-blind registry. After examining the critical paths—Phone OTP onboarding, Crush selection, Email verification, Invite loop, and Slot monetization—two core product opportunities stand out:

### 1. "Campus Orbit & Social Proximity Hints" (Zero-Knowledge Trust Signals)
* **The User Problem:** When an un-onboarded crush receives an SMS/WhatsApp invite (*"Someone added you as a secret crush on Coy"*), they experience immediate skepticism. Without context, many assume it is spam, malware, or phishing.
* **The Solution:** Deliver zero-knowledge proximity badges attached to the invite, such as:
  - *"Someone from your college batch (e.g., IIT Delhi '25)"*
  - *"Someone in your second-degree contact graph"*
* **Why it is Required:**
  - **Dramatically Accelerates Viral Conversion:** Cold invites convert poorly; social proximity signals provide instant validation that a real peer created the entry.
  - **Protects Privacy Integrity:** The individual sender's identity remains mathematically concealed, preserving Coy’s core promise while removing the friction that stalls user acquisition.

### 2. "Timed Crush Windows & Dynamic Urgency Drops"
* **The User Problem:** In the current system, an added crush can sit in a slot indefinitely without resolution. This creates inactive slots and diminishes the user's dopamine loop.
* **The Solution:** Introduce a 14-day dynamic "Sync Window" for each slot. If an invite is sent, the recipient sees a countdown (*"Your secret admirer's slot expires in 48 hours"*). If time elapses without reciprocity, the slot gracefully resets for the sender.
* **Why it is Required:**
  - **Creates Natural Action Urgency:** Scarcity and time limits prompt invitees to download the app and check before the window lapses.
  - **Revitalizes the Slot Economy:** Gives users a healthy cadence to re-engage with the app and purchase extra persistent slots without feeling stuck.

---

## 🏛️ System Architecture & Data Flow

```
                                      +-----------------------------+
                                      |      Browser Client         |
                                      | (Mobile Frame: max-w-md)    |
                                      +--------------+--------------+
                                                     |
                        +----------------------------+----------------------------+
                        |                            |                            |
                        v                            v                            v
               [ Home Tab ]                 [ Discover Tab ]               [ Matches Tab ]
           (Blank Placeholder)           (Framer Motion Stack)           (Mutual Connections)
                                                     |
                                       User Swipes Card (Like/Pass)
                                                     |
                                                     v
                                      +-----------------------------+
                                      |   Next.js API Handler       |
                                      |     (POST /api/swipe)       |
                                      +--------------+--------------+
                                                     |
                              +----------------------+----------------------+
                              |                                             |
                              v                                             v
                      [ Action: PASS ]                              [ Action: LIKE ]
                              |                                             |
                   Record in Swipes Store                         Check: Pre-liked User?
                              |                                             |
                   Return { match: false }                   +--------------+--------------+
                                                             |                             |
                                                             v                             v
                                                        [ YES: Match ]               [ NO: Unrequited ]
                                                             |                             |
                                                    Add to Matches Store         Record in Swipes Store
                                                    Trigger Confetti Modal       Return { match: false }
                                                    Return { match: true }
```

---

## 🔒 Strict Privacy Guarantee (The Core Promise of Coy)

In conventional client-heavy applications, developers mistakenly send the full user record to the browser:
```json
// ❌ INSECURE ANTI-PATTERN (Leaking secret like to client DevTools)
{
  "id": "coy_user_01",
  "name": "Aanya Sharma",
  "hasPreLikedMe": true  <-- SNIFFABLE IN NETWORK TAB!
}
```

### How Coy Engine Guarantees Double-Blind Security:
1. **Server-Side Sanitization:** The data access layer in `lib/db.ts` applies `sanitizeProfile()` before serialization:
   ```typescript
   export function sanitizeProfile(profile: Profile): PublicProfile {
     const { hasPreLikedMe, ...publicProfile } = profile;
     return publicProfile;
   }
   ```
2. **Network Sniffing Resistance:** Inspecting `GET /feed` in Chrome DevTools shows zero trace of `hasPreLikedMe`.
3. **Double-Blind Computation:** The mutual match condition is verified strictly on the server:
   ```typescript
   if (action === 'like' && profile.hasPreLikedMe) {
     // Only at this exact moment is the match recorded and revealed
   }
   ```

---

## 📡 Backend API Specifications

### 1. `GET /api/feed` (Rewritten as `/feed`)
Returns profiles the active user has not yet swiped on.
* **Status:** `200 OK`
* **Response:**
```json
{
  "success": true,
  "profiles": [
    {
      "id": "coy_user_01",
      "name": "Aanya Sharma",
      "age": 21,
      "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      "bio": "Architecture major obsessed with brutalist design, cold brew, and film photography ☕🎞️",
      "cityOrCollege": "IIT Roorkee",
      "interests": ["Architecture", "Analog Photography", "Coffee", "Indie Pop"]
    }
  ],
  "total": 32
}
```

### 2. `POST /api/swipe` (Rewritten as `/swipe`)
Records a like or pass action for a profile and calculates mutual status.
* **Request Body:**
```json
{
  "profileId": "coy_user_01",
  "action": "like"
}
```
* **Response (Mutual Match):**
```json
{
  "success": true,
  "match": true,
  "matchedProfile": {
    "id": "coy_user_01",
    "name": "Aanya Sharma",
    "age": 21,
    "photo": "https://images.unsplash.com/...",
    "cityOrCollege": "IIT Roorkee"
  },
  "remainingCount": 31
}
```

### 3. `GET /api/matches` (Rewritten as `/matches`)
Returns the list of mutual matches.
* **Status:** `200 OK`
* **Response:**
```json
{
  "success": true,
  "matches": [
    {
      "id": "match_174000000_abc",
      "userId": "coy_user_me",
      "profileId": "coy_user_01",
      "timestamp": 1740000000000,
      "profile": { ... }
    }
  ],
  "total": 1
}
```

### 4. `POST /api/reset` (Rewritten as `/reset`)
Resets swipes and matches back to the initial 32-card demo state.

---

## 🎨 Frontend UI/UX & Gesture Engineering

* **Mobile Frame Viewport:** Standardized `max-w-md` shell with simulated iOS/Android ambient status bar, glassmorphism headers, and bottom navigation.
* **Touch Physics:** Framer Motion `useMotionValue` tracking `x` and `y` displacement. Rotation is dynamically derived: $\text{rotate} = x \times 0.08^\circ$.
* **Threshold Detection:** Exceeding $100\text{px}$ drag offset or $400\text{px/s}$ gesture velocity automatically triggers a smooth exit spring transition.
* **Celebration Modal:** `canvas-confetti` dual-cannon blast combined with spring modal entry and pulsating connection indicators.

---

## 💻 Local Setup, Execution & Testing Guide

### Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- npm `v9+` or `v11+`

### 1. Clone & Install
```bash
git clone https://github.com/mishrarakesh-1902/COY.git
cd COY
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser. (Press `F12` $\rightarrow$ toggle Device Toolbar `Ctrl+Shift+M` to test touch swiping).

### 3. Run Production Build
```bash
npm run build
npm run start
```

### 4. End-to-End Verification Test
1. **Swipe Right on Aanya Sharma:** Card 1 is pre-seeded with a mutual like. The celebration screen with confetti will appear immediately.
2. **Switch to Matches Tab:** Aanya appears under Recent Connections with a badge count of `1`.
3. **Swipe Left on Rohan Verma:** He exits the screen and is marked as passed.
4. **Hard Refresh the Browser (`Ctrl+F5`):** Notice neither Aanya nor Rohan reappear in the feed—your swipes persisted.
5. **Reset Demo:** Click the **Reset** button in the header at any time to restore all 32 cards.
