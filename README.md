# Get Me A Momo 🥟

Get Me A Momo is a crowdfunding platform designed for creators, developers, and artists to receive support from their fans. Similar to "Buy Me A Coffee", it allows fans to contribute financially (by "buying a momo") to support projects and ongoing work.

## 🚀 Features

- **User Authentication**: Secure login using GitHub via NextAuth.js.
- **Creator Profiles**: Each user gets a unique public profile page (e.g., `/username`) where fans can send support.
- **Payment Integration**: Seamless payments powered by Razorpay.
- **Dashboard**: A private space for creators to:
  - View their recent supporters.
  - Track earnings.
  - Update profile details (Username, Profile Picture, Cover Image).
  - Manage Razorpay API credentials.
- **Support History**: Publicly display recent payments and messages from fans on profile pages.
- **Responsive Design**: Built with Tailwind CSS for a modern, mobile-friendly experience.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) & API Routes
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Payments**: [Razorpay SDK](https://razorpay.com/docs/payments/server-side-integration/nodejs/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/introduction/)

## ⚙️ Project Structure

```text
actions/            # Next.js Server Actions for DB operations and payments
app/                # Next.js App Router (Pages, API routes, Layouts)
  api/razorpay/     # Webhook/Callback handler for Razorpay
  [username]/       # Dynamic route for public creator profiles
components/         # Reusable UI components (Navbar, Footer, PaymentPage, etc.)
db/                 # Database connection logic
models/             # Mongoose schemas (User, Payment)
public/             # Static assets (images, gifs)
```

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ installed.
- A MongoDB database (Atlas or local).
- A Razorpay account (for API Key ID and Secret).
- A GitHub OAuth App (for authentication).

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/samir7-7/Get-me-a-coffee.git
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
