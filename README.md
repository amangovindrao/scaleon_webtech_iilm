# ScaleOn — Professional Growth Platform

> Next.js 16 website with Tailwind CSS, Framer Motion, Firebase, and a clean monochrome design.

---

## 📂 Project Structure

```
ScaleOnNewWebsite/
├── app/                      # Next.js App Router pages
│   ├── globals.css           # Global styles + CSS variables (colors, grid bg)
│   ├── icon.tsx              # Dynamic favicon (black "S" monogram)
│   ├── layout.tsx            # Root layout (Navbar, Footer, floating buttons)
│   ├── page.tsx              # Homepage (Hero → Features → Social → Testimonials → Team → FAQ → Contact)
│   ├── adminyashit/          # Admin dashboard (protected)
│   ├── api/contact/          # Contact form API endpoint (email via Nodemailer)
│   ├── blog/                 # Blog listing & [slug] pages
│   └── profile/[uid]/        # User profile pages
│
├── components/ui/            # Reusable UI components
│   ├── Chatbot.tsx           # Floating chatbot widget (uses data/chatbotData.ts)
│   ├── Footer.tsx            # Footer with SCALEON overlay + newsletter form
│   ├── GlassCard.tsx         # Clean bordered Card component
│   ├── Navbar.tsx            # Sticky pill navbar with mobile hamburger
│   ├── ThemeProvider.tsx     # next-themes provider wrapper
│   └── ThemeToggle.tsx       # Sun/Moon dark mode toggle button
│
├── data/                     # ⭐ EDITABLE DATA FILES
│   ├── chatbotData.ts        # Chatbot questions, answers & keywords
│   └── siteData.ts           # All homepage section content
│
├── lib/                      # Backend utilities
│   ├── auth.ts               # Firebase auth helpers
│   ├── constants.ts          # Firestore collection names
│   ├── firebase/             # Firebase client config
│   ├── firestore.ts          # All Firestore CRUD functions
│   └── utils.ts              # Misc utility functions
│
├── types/                    # TypeScript interfaces
│   └── models.ts             # UserProfile, BlogPost, ContactSubmission, etc.
│
├── public/                   # Static assets (images, logo)
│   └── 4.png                 # Founders cutout image (hero section)
│
├── tailwind.config.ts        # Tailwind theme (colors, shadows, animations)
├── firebase.json             # Firebase project config
├── firestore.rules           # Firestore security rules
└── .env.local                # Environment variables (Firebase, Nodemailer)
```

---

## 🎨 How to Change Colors

Edit **`app/globals.css`** — all colors are CSS variables:

```css
:root {                    /* Light mode */
  --bg: #ffffff;           /* Background */
  --fg: #1a1a1a;           /* Text / foreground */
  --card: rgba(255,255,255,0.92);  /* Card backgrounds */
  --border: rgba(0,0,0,0.08);     /* Borders */
  --accent: #1a1a1a;       /* Accent color (buttons, highlights) */
}

.dark {                    /* Dark mode */
  --bg: #0a0a0a;
  --fg: #f0ece4;
  --accent: #f0ece4;
}
```

The grid background pattern is also in this file — remove `background-image` lines to get a plain background.

---

## 📝 How to Edit Each Section

### Hero Section
**File:** `app/page.tsx` (search for `1. HERO`)

- **Heading:** Change the `<h1>` text
- **Founders image:** Replace `public/4.png` with your image
- **Counter stats:** Edit `counter1`, `counter2`, `counter3` values and labels

### Features
**File:** `data/siteData.ts` → `features` array

Edit the `title` and `text` for each feature. Icons are defined in `app/page.tsx` in the `featureIcons` array.

### Social Presence & Works
**File:** `data/siteData.ts` → `socialStats` and `works` arrays

```ts
// Update your social handles and follower counts:
export const socialStats = [
  { platform: 'Instagram', handle: '@scaleon', followers: '12K+', url: 'https://instagram.com/scaleon' },
  // ...
];
```

### Testimonials
**File:** `data/siteData.ts` → `testimonials` array

### Team
**File:** `data/siteData.ts` → `members` array

Currently 3 members. To add/remove members, just add/remove objects:
```ts
{
  name: 'New Person',
  role: 'Their Role',
  img: 'https://...'    // Unsplash URL or /team/photo.jpg in public/
}
```

### FAQs
**File:** `data/siteData.ts` → `faqs` array

### Contact Form
**File:** `app/page.tsx` (search for `7. CONTACT`)

Form submissions go to:
1. **Firestore** → `contactSubmissions` collection
2. **Email** → via `/api/contact` (Nodemailer — configure in `.env.local`)

### Newsletter / Subscribe
**File:** `components/ui/Footer.tsx`

Subscriber emails are saved to Firestore → `newsletterSubscribers` collection. You can view them in your Firebase Console.

---

## 🤖 How to Add Chatbot Questions

**File:** `data/chatbotData.ts`

Add a new object to the `chatbotQuestions` array:

```ts
{
  keywords: ["refund", "money", "back", "cancel"],  // Words that trigger this answer
  question: "Do you offer refunds?",                  // Displayed as quick-select button
  answer: "Yes, we offer a 30-day money-back guarantee on all plans."
}
```

**How matching works:** When a user types a message, each word is checked against the `keywords` array. The question with the most keyword matches is selected. If nothing matches, the `fallbackResponse` is shown.

---

## 🔗 How to Change Social Links

### Floating buttons (Instagram & WhatsApp)
**File:** `app/layout.tsx`

Find these lines and change the URLs:
```tsx
<a href="https://instagram.com/scaleon" ...>   ← Change Instagram URL
<a href="https://wa.me/919999999999" ...>      ← Change WhatsApp number
```

### Footer social icons
**File:** `components/ui/Footer.tsx` — bottom section with Twitter, Instagram, LinkedIn icons.

---

## 🏷️ How to Update the Logo

**File:** `components/ui/Navbar.tsx`

Find the logo comment and replace the `<span>` with an image:

```tsx
{/* Current (text logo): */}
<span className="text-xl font-extrabold tracking-tight text-fg">ScaleOn</span>

{/* Replace with (image logo): */}
<img src="/logo.png" alt="ScaleOn" className="h-7 w-auto" />
```

Then place your logo file in the `public/` folder.

---

## 🌙 How to Change Default Theme

**File:** `app/layout.tsx`

```tsx
<ThemeProvider defaultTheme="light" ...>   ← Change to "dark" for dark default
```

---

## 🚀 Running Locally

```bash
npm install
npm run dev          # → http://localhost:3000
npm run build        # Production build
npm start            # Serve production build
```

---

## 📦 Deployment

This is a **Next.js** app. Deploy to:
- **Vercel** (recommended — zero config)
- **Netlify** (with Next.js plugin)
- **Any Node.js server** (run `npm run build && npm start`)

### Required Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
EMAIL_USER=...              # Nodemailer sender email
EMAIL_PASS=...              # Nodemailer app password
EMAIL_TO=...                # Where contact form emails go
```

---

## 🗃️ Firestore Collections

| Collection | Purpose | Written By |
|---|---|---|
| `contactSubmissions` | Contact form entries | Contact form |
| `newsletterSubscribers` | Newsletter signups | Footer subscribe |
| `blogPosts` | Blog articles | Admin dashboard |
| `users` | User profiles | Auth system |
| `communityPosts` | Community posts | Community feature |
| `communityComments` | Comment threads | Community feature |
| `teamMembers` | Team data | Admin (optional) |
| `settings` | App settings | Admin |

---

## 🧹 File Cleanup Done

Removed:
- `ScaleOnNewWebsite.zip` (235MB archive cluttering the repo)
- `components/blog/` (empty directory)
- `SmoothScrollProvider.tsx` (lenis dependency removed)
- `Hero3D.tsx` (unused Spline iframe)
