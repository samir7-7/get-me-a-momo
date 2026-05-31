"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "@/models/Payment";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const initiate = async (amount, to_username, paymentform) => {
  await connectDb();
  // fetch the secret of the user who is getting the payment
  let user = await User.findOne({ username: to_username });
  const secret = user.razorpaysecret;

  var instance = new Razorpay({ key_id: user.razorpayid, key_secret: secret });

  let options = {
    amount: Number.parseInt(amount),
    currency: "NPR",
  };

  let x = await instance.orders.create(options);

  // create a payment object which shows a pending payment in the database
  await Payment.create({
    oid: x.id,
    amount: amount / 100,
    to_user: to_username,
    name: paymentform.name,
    message: paymentform.message,
    method: "razorpay",
  });

  return x;
};

export const initiateEsewa = async (amount, to_username, paymentform) => {
  await connectDb();

  // Confirm the receiving creator exists before we accept money on their behalf
  const user = await User.findOne({ username: to_username });
  if (!user) {
    return { error: "Creator not found" };
  }

  const merchantId = process.env.NEXT_PUBLIC_ESEWA_MERCHANT_ID || "EPAYTEST";
  const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";

  // eSewa wants a unique uuid per transaction; we reuse it as our oid
  const transaction_uuid = `momo-${Date.now()}-${crypto
    .randomBytes(4)
    .toString("hex")}`;

  // eSewa expects amounts in whole NPR (not paisa) and as fixed-decimal strings
  const total_amount = Number.parseFloat(amount).toFixed(2);
  const tax_amount = "0";
  const product_service_charge = "0";
  const product_delivery_charge = "0";
  const amount_field = Number.parseFloat(amount).toFixed(2);

  // Persist a pending payment so the /api/esewa callback can find it
  await Payment.create({
    oid: transaction_uuid,
    amount: Number.parseFloat(amount),
    to_user: to_username,
    name: paymentform.name,
    message: paymentform.message,
    method: "esewa",
  });

  // HMAC-SHA256 the canonical signed_field_names string, then base64
  const signedString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${merchantId}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(signedString)
    .digest("base64");

  const successUrl = `${process.env.NEXT_PUBLIC_URL}/api/esewa`;
  const failureUrl = `${process.env.NEXT_PUBLIC_URL}/${to_username}?paymentdone=false`;

  return {
    esewaUrl:
      process.env.NEXT_PUBLIC_ESEWA_URL ||
      "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    fields: {
      amount: amount_field,
      tax_amount,
      total_amount,
      transaction_uuid,
      product_code: merchantId,
      product_service_charge,
      product_delivery_charge,
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    },
  };
};

export const fetchuser = async (username) => {
  await connectDb();
  let u = await User.findOne({ username: username });
  let user = u.toObject({ flattenObjectIds: true });
  return user;
};

export const fetchpayments = async (username) => {
  await connectDb();
  // find all payments sorted by decreasing order of amount and flatten object ids
  let p = await Payment.find({ to_user: username, done: true })
    .sort({ amount: -1 })
    .limit(10)
    .lean();
  return p;
};

export const updateProfile = async (data, oldusername) => {
  await connectDb();
  let ndata = Object.fromEntries(data);

  // If the username is being updated, check if username is available
  if (oldusername !== ndata.username) {
    let u = await User.findOne({ username: ndata.username });
    if (u) {
      return { error: "Username already exists" };
    }
    await User.updateOne({ email: ndata.email }, ndata);
    // Now update all the usernames in the Payments table
    await Payment.updateMany(
      { to_user: oldusername },
      { to_user: ndata.username },
    );
  } else {
    await User.updateOne({ email: ndata.email }, ndata);
  }
};
