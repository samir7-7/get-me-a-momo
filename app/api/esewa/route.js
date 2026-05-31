import { NextResponse } from "next/server";
import crypto from "crypto";
import Payment from "@/models/Payment";
import connectDb from "@/db/connectDb";

// eSewa v2 redirects back to success_url with a single `data` query param
// that is a Base64-encoded JSON payload. We must:
//   1. decode it
//   2. re-derive the HMAC signature over `signed_field_names`
//   3. confirm amount matches the pending DB record
//   4. mark the payment done (idempotent — never credit twice)
async function handleEsewaCallback(req) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const encoded = searchParams.get("data");

  if (!encoded) {
    return NextResponse.json(
      { success: false, message: "Missing eSewa data parameter" },
      { status: 400 },
    );
  }

  let payload;
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    payload = JSON.parse(decoded);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Invalid eSewa payload" },
      { status: 400 },
    );
  }

  const {
    transaction_uuid,
    status,
    total_amount,
    product_code,
    signed_field_names,
    signature: returnedSignature,
  } = payload;

  if (!transaction_uuid || !signed_field_names || !returnedSignature) {
    return NextResponse.json(
      { success: false, message: "Incomplete eSewa payload" },
      { status: 400 },
    );
  }

  // Build the signed string from exactly the fields eSewa says it signed,
  // in the order it lists them.
  const signedString = signed_field_names
    .split(",")
    .map((field) => `${field.trim()}=${payload[field.trim()]}`)
    .join(",");

  const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(signedString)
    .digest("base64");

  if (expectedSignature !== returnedSignature) {
    return NextResponse.json(
      { success: false, message: "Signature verification failed" },
      { status: 400 },
    );
  }

  // Pull the pending payment by transaction_uuid (stored as oid)
  const pending = await Payment.findOne({ oid: transaction_uuid });
  if (!pending) {
    return NextResponse.json(
      { success: false, message: "Order not found" },
      { status: 404 },
    );
  }

  // Idempotency: if already credited, just redirect — don't double-process
  if (pending.done) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/${pending.to_user}?paymentdone=true`,
    );
  }

  // Defend against tampered amounts — what eSewa says it captured must match
  // what we recorded when initiating the payment.
  const reportedAmount = Number.parseFloat(
    String(total_amount).replace(/,/g, ""),
  );
  if (
    !Number.isFinite(reportedAmount) ||
    Math.abs(reportedAmount - pending.amount) > 0.01
  ) {
    return NextResponse.json(
      { success: false, message: "Amount mismatch" },
      { status: 400 },
    );
  }

  if (status !== "COMPLETE") {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/${pending.to_user}?paymentdone=false`,
    );
  }

  await Payment.updateOne({ oid: transaction_uuid }, { done: true });

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_URL}/${pending.to_user}?paymentdone=true`,
  );
}

export const GET = handleEsewaCallback;
export const POST = handleEsewaCallback;
