# Get Me A Momo 🥟

**Get Me A Momo** is a localized crowdfunding platform designed for creators, developers, and artists to receive micro-donations from their fans. Inspired by "Buy Me A Coffee," it focuses on facilitating support within the South Asian creative ecosystem (specifically Nepal and India) by integrating local payment gateways like eSewa and Razorpay.

---

## 🚀 Key Features

### 👤 For Creators

- **Personalized Profile Hub**: Every creator gets a unique public handle (e.g., `getmeamomo.com/samir`) to showcase their work and collect contributions.
- **Customizable Branding**: Update your profile picture, cover image, and display name directly from the dashboard.
- **Payment Gateway Flexibility**: Connect your own Razorpay/Esewa credentials to receive funds directly into your account.
- **Creator Dashboard**: Track real-time earnings, view support history, and manage account settings in a secure, private area.

### 💖 For Supporters

- **Micro-Donations (Momos)**: Support creators by "buying a momo" (customizable amounts).
- **Personalized Messages**: Leave a note of encouragement with every donation.
- **Local Payment Options**: Seamlessly pay using **eSewa** (Nepal) or **Razorpay** (India/International), ensuring accessibility for local fans.
- **Social Proof**: See your name on the recent supporters list or aim for a spot on the Top 10 Leaderboard.

### 🛡️ Technical Excellence

- **Secure Authentication**: Zero-friction login using GitHub via NextAuth.js.
- **Signature Verification**: Industrial-grade security for payments using HMAC-SHA256 and RSA/HMAC hashing to prevent fraud.
- **Modern UI**: A sleek, dark-themed responsive interface built with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router & Server Actions)
- **Frontend**: [React 18](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (GitHub Provider)
- **Payment Gateways**:
  - [Razorpay SDK](https://razorpay.com/) (Standard checkout)
  - [eSewa API v2](https://esewa.com.np/) (Localized POST submission with signature verification)
- **Utilities**: [React Toastify](https://fkhadra.github.io/react-toastify/) (Notifications), [Crypto](https://nodejs.org/api/crypto.html) (Security)

---

## 📂 Project Structure

```text
actions/            # Server Actions for DB mutations and payment initialization
app/                # App Router: Pages and localized API routes
  api/razorpay/     # SHA-256 Signature verification for Razorpay
  api/esewa/        # Base64/HMAC Verification logic for eSewa v2
  [username]/       # Dynamic routes for creator profiles
components/         # Modular UI (Navbar, Footer, PaymentPage, Dashboard)
db/                 # MongoDB connection strategy (singleton pattern)
models/             # Data models for Users and Payments
public/             # Static assets (Gifs, momo icons)
```

---

## 🏁 Getting Started

### 1. Prerequisites

- **Node.js**: 18.x or later
- **MongoDB**: A running instance (Atlas or local)
- **Payment Credentials**:
  - Razorpay Key ID & Secret
  - eSewa Merchant ID & Secret Key (for development, use `EPAYTEST`)
- **GitHub OAuth**: Client ID and Secret from GitHub Developer Settings

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database & Auth
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret

# Razorpay (Global)
NEXT_PUBLIC_RAZORPAY_ID=your_key_id
RAZORPAY_SECRET=your_key_secret

# eSewa (Nepal)
NEXT_PUBLIC_ESEWA_MERCHANT_ID=EPAYTEST
ESEWA_SECRET_KEY=8g8M8t8P8m8d8gl8
NEXT_PUBLIC_ESEWA_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form

# General
NEXT_PUBLIC_URL=http://localhost:3000
```

### 3. Installation & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)

1. **Clone the repository**:

   ```bash
   git clone https://github.com/samir7-7/get-me-a-momo.git
   cd get-me-a-coffee
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:

   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret

   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Site URL
   NEXT_PUBLIC_URL=http://localhost:3000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 💳 Payment Configuration

The application is currently configured to use **Nepalese Currency (NPR)** for transactions.

> **Note**: For this to work correctly, ensure your Razorpay account is enabled for international payments if you are operating from Nepal or receiving international support. If `NPR` is not supported by your specific Razorpay account type, you can switch back to `INR` or `USD` in:
>
> - `actions/useractions.js`
> - `components/PaymentPage.js`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License.
