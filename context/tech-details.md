# Technical Details & Architecture - Get Me A Momo 🥟

This document provides a deep dive into the architecture, APIs, and technical specifications of the "Get Me A Momo" project.

## 1. Project Overview

"Get Me A Momo" is a localized crowdfunding platform for creators in Nepal, allowing supporters to buy them "momos" (micro-donations) using Razorpay and eSewa.

---

## 2. Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (CommonJS/ESM mix)
- **Styling**: Tailwind CSS
- **Database**: MongoDB (via Mongoose)
- **Authentication**: NextAuth.js
- **State Management**: React Hooks (useState, useEffect)
- **Payment Gateways**: Razorpay, eSewa

---

## 3. Architecture & File Structure

The project follows a standard Next.js App Router structure with clear separation of concerns:

- `app/`: Contains the routes and API endpoints.
  - `[username]/`: Dynamic route for creator profiles.
  - `api/auth/`: NextAuth configuration.
  - `api/razorpay/`: Verification for Razorpay payments.
- `components/`: Reusable UI components (Navbar, Footer, PaymentPage).
- `models/`: Mongoose schemas (User, Payment).
- `actions/`: Server Actions for database mutations and payment initialization.
- `db/`: Database connection logic.

---

## 4. API & Server Actions Reference

### Server Actions (`actions/useractions.js`)

- `initiate(amount, to_username, paymentform)`:
  - Creates a Razorpay order.
  - Saves a pending payment in MongoDB.
- `fetchuser(username)`: Fetches creator details by username.
- `fetchpayments(username)`: Retrieves all successful payments for a creator.
- `updateProfile(data, oldusername)`: Updates user profile settings (Cover pic, Profile pic, etc.).

### REST API Routes

- `POST /api/razorpay`:
  - Triggered by Razorpay's frontend callback.
  - Verifies the `razorpay_signature`.
  - Updates payment status to `done: true`.

---

## 5. Database Schema Details

### User Model (`models/User.js`)

- `email`: String (Unique)
- `name`: String
- `username`: String (Unique)
- `profilepic`: String (URL)
- `coverpic`: String (URL)
- `razorpayid`: String
- `razorpaysecret`: String

### Payment Model (`models/Payment.js`)

- `name`: String (Supporter's name)
- `to_user`: String (Creator's username)
- `oid`: String (Order ID / Transaction UUID)
- `message`: String (Supporter's message)
- `amount`: Number (NPR)
- `method`: String ('razorpay' | 'esewa')
- `done`: Boolean (Status)

---

## 6. Payment Logic

### Razorpay Integration

1. **Frontend**: Calls `initiate()` action -> Receives Order ID.
2. **Gateway**: Opens Razorpay Checkout modal.
3. **Backend**: Callback to `/api/razorpay` verifies the SHA-256 HMAC signature.

### eSewa Integration (Planned)

1. **Frontend**: Calls `initiateEsewa()` -> Receives signed payload.
2. **Gateway**: Hidden form POST to eSewa endpoint.
3. **Backend**: Callback to `/api/esewa` verifies the RSA/HMAC signature.

---

## 7. UI/UX Design System

- **Theme**: Dark Mode (Slate-950 background).
- **Accents**: Indigo (`indigo-500`) and Purple.
- **Components**: Glassmorphism (`.glass`) used for cards and headers.
- **Responsiveness**: Mobile-first design using Tailwind's `sm`, `md`, `lg` breakpoints.

---

_Last updated: 2026-05-31_
