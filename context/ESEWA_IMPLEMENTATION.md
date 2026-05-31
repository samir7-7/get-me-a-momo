# eSewa Integration Plan - Get Me A Momo 🥟

This document provides a comprehensive technical guide to integrating eSewa as a secondary payment gateway.

## 1. Prerequisites & Environment Setup

- **Merchant ID**: `EPAYTEST` (Sandbox) or your production ID.
- **Secret Key**: Required for HMAC-SHA256 signature generation.
- **Endpoints**:
  - Sandbox: `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
  - Production: `https://epay.esewa.com.np/api/epay/main/v2/form`

### Required `.env.local` Additions:

```env
NEXT_PUBLIC_ESEWA_MERCHANT_ID=EPAYTEST
ESEWA_SECRET_KEY=8g8M8t8P8m8d8gl8
NEXT_PUBLIC_ESEWA_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form
```

---

## 2. Database Schema Updates (`models/Payment.js`)

Ensure the payment model tracks provider-specific details:

```javascript
{
  name: String,
  to_user: String,
  oid: String, // transaction_uuid for eSewa
  message: String,
  amount: Number,
  method: { type: String, enum: ['razorpay', 'esewa'], default: 'razorpay' },
  done: { type: Boolean, default: false }
}
```

---

## 3. Server Logic: Signature Generation (`actions/useractions.js`)

The `initiateEsewa` function must:

1. **Initialize Payment**: Create a pending record in MongoDB.
2. **Setup Fields**: Define `total_amount`, `transaction_uuid`, and `product_code` (Merchant ID).
3. **Generate Signature**:
   - Create a string: `total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}`
   - Hash using `crypto.createHmac('sha256', ESEWA_SECRET_KEY)`.
   - Convert binary hash to Base64.
4. **Return Data**: Send all form fields and the signature to the client.

---

## 4. Frontend: The Redirect Form (`components/PaymentPage.js`)

Instead of a simple API call, eSewa v2 uses a POST form submission.

- **Workflow**:
  1. User clicks "Support with eSewa".
  2. Frontend calls `initiateEsewa` action.
  3. Action returns signed parameters.
  4. Frontend creates a hidden `<form action={ESEWA_URL} method="POST">`.
  5. Appends hidden inputs (amount, signature, etc.).
  6. Programmatically calls `form.submit()`.

---

## 5. API Route: Verification (`app/api/esewa/route.js`)

eSewa redirects the user back to our `success_url` with an encoded `data` parameter.

1. **Receive Data**: Catch the Base64 encoded JSON from the URL.
2. **Decode**: Parse the JSON to get `transaction_uuid`, `status`, and `total_amount`.
3. **Verify Integrity**:
   - Re-generate the signature from the returned values.
   - Compare with the returned `signature` field.
4. **Check Status**: If `status === 'COMPLETE'`, update the database.
5. **Redirect**: Send user back to their profile with `?status=success`.

---

## 6. UI/UX & Design Details

- **Brand Consistency**: Use eSewa Green (`#60bb46`) for the button.
- **Loading State**: Show a "Connecting to eSewa..." overlay to prevent multiple clicks.
- **Success Celebration**: Trigger a confetti effect or a "Momo Sent!" modal on successful redirection.
- **Responsive Grid**: Maintain a 2-column layout on desktop and single-column on mobile.

---

## 7. Security Checklist

- [ ] **Signature Validation**: Never trust the `status` field without verifying the HMAC signature.
- [ ] **Amount Match**: Ensure the `total_amount` returned by eSewa matches the `amount` saved in our database.
- [ ] **One-time Use**: Ensure a `transaction_uuid` cannot be used to trigger multiple payment credits.

---

_Created on: 2026-05-31_
