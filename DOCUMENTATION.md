# ScaleOn Project Documentation

## 1. Project Overview

ScaleOn is a Next.js-based marketing and growth website for a digital growth agency. The site combines a high-end promotional homepage, a blog system, author/profile pages, an admin dashboard, a chatbot assistant, and Firebase-backed data flows for contacts, blogs, users, and related content.

The application is designed for both marketing and operations. Public visitors can explore the agency, read blog posts, ask the chatbot questions, and submit a contact form. Logged-in users can access profiles and the admin workspace, where blogs and user roles can be managed.

## 2. Technology Stack

### Frontend

- Next.js 16 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- next-themes for dark mode switching
- lucide-react for icons in the wider project dependencies

### Backend and Services

- Next.js Route Handler for contact email delivery
- Nodemailer for sending contact form messages through Gmail SMTP
- Zod for request validation
- Firebase Authentication
- Firestore database
- Firebase Storage is initialized in the client config, even though the current inspected routes do not show a storage-specific feature

### Utilities

- clsx and tailwind-merge for class name composition
- react-hook-form is available in dependencies, though the inspected forms use native form handling

## 3. High-Level Architecture

The app follows a layered architecture:

- Presentation layer: pages under `app/` and reusable UI components under `components/ui/`
- Content layer: static marketing content stored in `data/siteData.ts` and chatbot answers in `data/chatbotData.ts`
- Service layer: Firebase and backend helpers in `lib/`
- Persistence layer: Firestore collections configured through `lib/constants.ts` and enforced by `firestore.rules`

Most pages are client components because they depend on live Firestore subscriptions, auth state, browser-only interactions, or animation libraries.

## 4. Site Structure

### Public Routes

- `/` home page
- `/blog` blog listing page
- `/blog/[slug]` blog detail page
- `/profile/[uid]` author or user profile page

### Protected or Special Routes

- `/adminyashit` admin dashboard and content workspace
- `/api/contact` contact form submission endpoint

### Global Layout

- `app/layout.tsx` wraps every route with the navbar, footer, chatbot, theme provider, and social floating buttons

## 5. Frontend Breakdown

### 5.1 Home Page

File: `app/page.tsx`

The homepage is the main commercial landing page. It is composed of these major sections:

- Hero section with animated headline text and founder image
- Trusted-by marquee with repeated brand names
- About us section with agency story and metric cards
- Features/services section
- Results or case study section
- Testimonials section
- Team section
- FAQ accordion section
- Contact form section

Important behaviors on the homepage:

- The hero headline rotates through words such as Startup, Brand, Business, Audience, Website, and Content
- Animated counters are driven by a custom `useCounter` hook and reveal on scroll
- The contact form collects name, email, phone, business type, budget, and message
- On submit, the form writes to Firestore and also sends the payload to `/api/contact`
- The FAQ section is interactive and toggles one answer at a time

### 5.2 Blog Listing

File: `app/blog/page.tsx`

The blog listing page subscribes to published blog posts from Firestore, then filters them by category on the client.

Main behaviors:

- Displays a grid of cards for published posts
- Supports category filtering through buttons generated from `BLOG_CATEGORIES`
- Includes a guest author application form
- The guest author form also writes to Firestore and sends the request to the contact API

### 5.3 Blog Detail

File: `app/blog/[slug]/page.tsx`

This page loads a single blog post by slug and then resolves the author profile from the `createdBy` field.

Main behaviors:

- Fetches the post with `getBlogBySlug(slug)`
- Looks up the author profile through `getUserProfile(createdBy)`
- Shows article metadata, author card, publish date, and long-form content

### 5.4 Profile Page

File: `app/profile/[uid]/page.tsx`

This page displays a user profile and all published blog posts created by that user.

Main behaviors:

- Loads the profile by UID
- Subscribes to published blogs and filters them by `createdBy === uid`
- Displays a fallback message if the user does not exist or has no articles

### 5.5 Admin Dashboard

File: `app/adminyashit/page.tsx`

This is the content management workspace. It supports two access paths:

- Google sign-in through Firebase auth
- A static owner login flow for the project owner

The admin dashboard has two tabs:

- Articles CMS
- Members Access

Admin features:

- Create new blog posts
- Edit existing posts
- Delete blog posts
- Switch post status between draft and published
- Manage user roles for authors and admins

The dashboard uses Firestore subscriptions to show all blog posts and all users in real time.

## 6. Backend and API Layer

### 6.1 Contact API Route

File: `app/api/contact/route.ts`

This route receives JSON contact submissions, validates them with Zod, and sends an email using Nodemailer.

Validation rules:

- `name` must be at least 2 characters
- `email` must be valid
- `phone` must be at least 7 characters
- `businessType` must be at least 2 characters
- `message` must be at least 10 characters

Email behavior:

- Uses Gmail SMTP through Nodemailer
- Sends from `MAIL_USER`
- Sends to `MAIL_TO` if configured, otherwise defaults to the hardcoded project email in the route
- Subject line is formatted as `ScaleOn Lead: <name>`

### 6.2 Firebase Auth Helpers

File: `lib/auth.ts`

This file centralizes auth-related logic:

- Email/password sign-up
- Email/password login
- Google login
- Password reset
- Logout
- Phone OTP setup through invisible reCAPTCHA

On new account creation or first Google login, a user document is created in Firestore with default profile fields and a `user` role.

### 6.3 Firestore Service Layer

File: `lib/firestore.ts`

This is the main data access layer for the app. It handles:

- Community post subscriptions and CRUD
- Comment creation and comment subscriptions
- User profile storage and retrieval
- Blog subscriptions and blog CRUD
- Contact submission storage and moderation

This file is the core bridge between UI and Firestore.

## 7. Database Design

### 7.1 Firestore Collections

File: `lib/constants.ts`

Defined collections:

- `users`
- `communityPosts`
- `communityComments`
- `blogPosts`
- `contactSubmissions`
- `newsletterSubscribers`
- `teamMembers`
- `settings`

### 7.2 Main Data Models

File: `types/models.ts`

Important TypeScript interfaces:

- `UserProfile`
- `BlogPost`
- `ContactSubmission`
- `CommunityPost`
- `CommunityComment`

Role model:

- `user`
- `moderator`
- `admin`

Blog categories in the inspected constants are:

- Marketing
- AI
- Social Media
- Trends

### 7.3 Data Flow by Feature

#### Contact Form

1. User submits the homepage contact form
2. The form is stored in `contactSubmissions`
3. The same payload is posted to `/api/contact`
4. Nodemailer sends the email to the configured inbox

#### Blog System

1. Admin creates or updates a blog post in the dashboard
2. The document is stored in `blogPosts`
3. Published posts appear on `/blog`
4. Clicking a card opens `/blog/[slug]`
5. Author details are resolved from the `users` collection

#### Profiles

1. A user profile is loaded by UID
2. The profile data comes from Firestore
3. Published blog posts are filtered by the same UID

## 8. Firestore Security Rules

File: `firestore.rules`

Security model summary:

- Signed-in users can read their own profile document
- Signed-in users can create their own profile document
- Users can update their own profile; admins can update any profile
- Only admins can delete user documents
- Community posts and comments are publicly readable
- Authenticated users can create community posts and comments
- Only owners or admins can update or delete their own community content
- Blog posts are publicly readable, but only admins can write them
- Contact submissions can be created by anyone, but only admins can read, update, or delete them

Important note:

- The admin check references a placeholder email expression in the current rules file, so that rule should be reviewed before production deployment

### Firestore Indexes

File: `firestore.indexes.json`

Configured composite indexes support:

- `communityComments` ordered by `postId` and `createdAt`
- `blogPosts` filtered by `status` and ordered by `publishAt`

## 9. Design System and UI Pattern

### Typography and Styling

- The root layout uses `Space_Grotesk` from Google Fonts
- Global theme colors are controlled through CSS variables in `app/globals.css`
- Light and dark mode both use a subtle grid background
- Tailwind utility classes are heavily used for spacing, borders, shadows, and motion states

### UI Components

File: `components/ui/GlassCard.tsx`

- Reusable bordered card with blur and card background styling
- Exported as both `Card` and `GlassCard`

File: `components/ui/Navbar.tsx`

- Sticky desktop and mobile navigation
- Theme toggle embedded in the nav
- Links to home sections and blog page

File: `components/ui/Footer.tsx`

- Brand summary
- Newsletter input UI
- Site links
- Social links
- Large watermark treatment in the footer background

File: `components/ui/Chatbot.tsx`

- Floating chatbot launcher
- Quick question chips
- Text input for custom questions
- Keyword-based response matching
- Contact fallback buttons for WhatsApp, Instagram, and email

File: `components/ui/ThemeProvider.tsx`

- Thin wrapper around `next-themes`

File: `components/ui/ThemeToggle.tsx`

- Light/dark mode switch with animated sun and moon icons

### Visual Direction

The site follows a premium monochrome growth-brand style:

- White and near-black base palette
- Soft glassmorphism cards
- Rounded pill buttons and large radius cards
- Motion used for subtle reveal effects, hover lift, and animated counters
- Repeated grid texture to avoid a flat background

## 10. Content Files

### Homepage Content

File: `data/siteData.ts`

This file stores the visible marketing content for the homepage:

- Services/features
- About metrics and text
- Brand marquee names
- Case study-style results
- Social proof statistics
- Testimonials
- Team members
- FAQ entries

### Chatbot Content

File: `data/chatbotData.ts`

This file stores chatbot matching data:

- Question and answer pairs
- Keyword arrays for matching user input
- Fallback response
- Contact links for WhatsApp, Instagram, and email

## 11. App Metadata and Icon

### Root Metadata

File: `app/layout.tsx`

- Site title: ScaleOn
- Meta description: growth-focused digital marketing and community learning

### App Icon

File: `app/icon.tsx`

- Generates a 32x32 favicon-style icon with an `S` monogram

## 12. Environment Variables

The application depends on Firebase and email configuration.

Firebase client config:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Email delivery config for `/api/contact`:

- `MAIL_USER`
- `MAIL_PASS`
- `MAIL_TO`

## 13. Scripts

File: `package.json`

- `npm run dev` starts the local Next.js dev server
- `npm run build` creates the production build
- `npm start` runs the production server
- `npm run lint` runs the Next.js lint command

## 14. What the User Sees

### Public Experience

- A polished landing page with animated marketing sections
- Social proof and testimonials
- A chatbot for quick questions
- A contact form for lead capture
- A blog for authority building and content marketing

### Logged-In Experience

- User profile pages
- Admin dashboard for content operations
- Role-based access to blog and member management tools

## 15. PPT-Ready Summary Points

If you want to convert this project into slides, the clearest presentation flow is:

1. Problem statement: brands need growth, lead generation, and content operations in one place
2. Solution: a full-stack agency website with marketing pages, blog CMS, and contact automation
3. Frontend: Next.js, Tailwind, Framer Motion, responsive UI, dark mode
4. Backend: Next.js API route plus Nodemailer for lead delivery
5. Database: Firebase Authentication and Firestore for users, blogs, contacts, and comments
6. Admin panel: blog publishing and role management
7. Security: Firestore rules for access control
8. Outcome: a production-ready platform for brand presentation and content operations

## 16. Notes For Maintenance

- Blog content is managed in Firestore, not hardcoded in the page UI
- Public pages rely on real-time Firestore subscriptions
- The chatbot is keyword-driven, so adding more keywords improves answer matching
- The current codebase contains some data-model and content variations across pages, so the documentation here reflects the actual inspected source rather than an idealized spec

## 17. Project Folder Map

### Core Application

- `app/page.tsx` main landing page
- `app/blog/page.tsx` blog index
- `app/blog/[slug]/page.tsx` blog article view
- `app/profile/[uid]/page.tsx` user profile view
- `app/adminyashit/page.tsx` CMS and admin workspace
- `app/api/contact/route.ts` email submission endpoint
- `app/layout.tsx` global wrapper
- `app/globals.css` global styles and theme variables

### UI and Shared Components

- `components/ui/Navbar.tsx`
- `components/ui/Footer.tsx`
- `components/ui/Chatbot.tsx`
- `components/ui/GlassCard.tsx`
- `components/ui/ThemeProvider.tsx`
- `components/ui/ThemeToggle.tsx`

### Data and Logic

- `data/siteData.ts`
- `data/chatbotData.ts`
- `lib/auth.ts`
- `lib/constants.ts`
- `lib/firestore.ts`
- `lib/firebase/client.ts`
- `lib/utils.ts`

### Types and Config

- `types/models.ts`
- `firestore.rules`
- `firestore.indexes.json`
- `firebase.json`
- `next.config.mjs`
- `tailwind.config.ts`
- `tsconfig.json`

## 18. Final Summary

ScaleOn is a full-stack marketing website built to present the agency publicly and manage content internally. The frontend focuses on high-end brand presentation and conversion. The backend handles contact email delivery and Firestore operations. The database layer supports users, blogs, contact submissions, community content, and settings, with rule-based access control for public and authenticated workflows.

This document can be used directly as a base for a college report or converted into PPT slides section by section.
