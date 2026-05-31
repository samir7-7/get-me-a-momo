"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
import {
  fetchuser,
  fetchpayments,
  initiate,
  initiateEsewa,
} from "@/actions/useractions";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

const PaymentPage = ({ username }) => {
  // const { data: session } = useSession()

  const [paymentform, setPaymentform] = useState({
    name: "",
    message: "",
    amount: "",
  });
  const [currentUser, setcurrentUser] = useState({});
  const [payments, setPayments] = useState([]);
  const [esewaLoading, setEsewaLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (searchParams.get("paymentdone") == "true") {
      toast("Thanks for your donation!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    router.push(`/${username}`);
  }, []);

  const handleChange = (e) => {
    setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
  };

  const getData = async () => {
    let u = await fetchuser(username);
    setcurrentUser(u);
    let dbpayments = await fetchpayments(username);
    setPayments(dbpayments);
  };

  const pay = async (amount) => {
    // Get the order Id
    let a = await initiate(amount, username, paymentform);
    let orderId = a.id;
    var options = {
      key: currentUser.razorpayid, // Enter the Key ID generated from the Dashboard
      amount: amount, // Amount is in currency subunits. Default currency is NPR. Hence, 50000 refers to 50000 paisa
      currency: "NPR",
      name: "Get Me A Momo", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        name: "Samir Nepal", //your customer's name
        email: "samir@example.com",
        contact: "9800000000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Kathmandu, Nepal",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
  };

  const payWithEsewa = async (amount) => {
    if (!paymentform.name || !paymentform.message || !paymentform.amount) {
      return;
    }

    setEsewaLoading(true);

    try {
      const res = await initiateEsewa(amount, username, paymentform);

      if (!res || res.error) {
        toast.error(res?.error || "Could not start eSewa payment", {
          position: "top-right",
          autoClose: 4000,
          theme: "dark",
          transition: Bounce,
        });
        setEsewaLoading(false);
        return;
      }

      // eSewa v2 requires a POST form submission (not a redirect). We build a
      // hidden form, append every signed field, and submit it programmatically.
      const form = document.createElement("form");
      form.method = "POST";
      form.action = res.esewaUrl;

      Object.entries(res.fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      toast.error("Something went wrong connecting to eSewa", {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
        transition: Bounce,
      });
      setEsewaLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

      {esewaLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="size-14 border-4 border-[#60bb46] border-t-transparent rounded-full animate-spin"></div>
          <div className="mt-6 text-white font-semibold text-lg">
            Connecting to eSewa...
          </div>
          <div className="mt-1 text-slate-400 text-sm">
            Please don&apos;t close this tab
          </div>
        </div>
      )}

      <div className="cover w-full relative">
        <img
          className="object-cover w-full h-48 md:h-[400px]"
          src={currentUser.coverpic}
          alt="cover"
        />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0 border-4 border-gray-900 overflow-hidden rounded-full size-32 md:size-48 shadow-2xl">
          <img
            className="rounded-full object-cover size-full"
            src={currentUser.profilepic}
            alt="profile"
          />
        </div>
      </div>

      <div className="info flex justify-center items-center md:items-start md:px-24 mt-20 md:mt-10 flex-col gap-1">
        <div className="font-bold text-3xl md:text-4xl text-white">
          {currentUser.name}
        </div>
        <div className="text-indigo-400 font-medium text-lg">@{username}</div>
        <div className="text-slate-400 mt-2 max-w-md text-center md:text-left">
          Helping {currentUser.name} reach their creative goals, one momo at a
          time!
        </div>
        <div className="flex gap-4 mt-4 text-sm font-semibold tracking-wide uppercase text-slate-500">
          <span>{payments.length} support events</span>
          <span className="text-indigo-500">•</span>
          <span>Rs. {payments.reduce((a, b) => a + b.amount, 0)} raised</span>
        </div>

        <div className="payment flex gap-8 w-full mt-12 flex-col lg:flex-row mb-20">
          <div className="supporters w-full lg:w-1/2 glass p-6 md:p-10 rounded-3xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">
                🏆
              </span>
              Recent Supporters
            </h2>
            <div className="space-y-6">
              {payments.length === 0 && (
                <div className="text-slate-500 italic py-10 text-center">
                  No momos bought yet. Be the first!
                </div>
              )}
              {payments.map((p, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors"
                >
                  <div className="bg-indigo-500/10 p-2 rounded-full mt-1">
                    <img
                      className="w-6 h-6 invert"
                      src="/avatar.gif"
                      alt="avatar"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-lg">
                        {p.name}
                      </span>
                      <span className="text-sm px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold tracking-tight">
                        Rs. {p.amount}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-1 leading-relaxed text-sm">
                      &quot;{p.message}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="makePayment w-full lg:w-1/2 glass p-6 md:p-10 rounded-3xl border-2 border-indigo-500/20 shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)]">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="bg-purple-500/20 p-2 rounded-xl text-purple-400">
                🍜
              </span>
              Support @{username}
            </h2>
            <div className="space-y-4">
              <input
                onChange={handleChange}
                value={paymentform.name}
                name="name"
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Your Name (e.g., Ram)"
              />
              <input
                onChange={handleChange}
                value={paymentform.message}
                name="message"
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Support Message... (e.g., Keep up the good work!)"
              />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                  Rs.
                </span>
                <input
                  onChange={handleChange}
                  value={paymentform.amount}
                  name="amount"
                  className="w-full p-4 pl-12 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-bold text-xl"
                  placeholder="0"
                />
              </div>

              {/* Amount Presets */}
              <div className="grid grid-cols-3 gap-3">
                {[10, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    onClick={() =>
                      setPaymentform({ ...paymentform, amount: amt.toString() })
                    }
                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all font-bold text-slate-300"
                  >
                    Rs. {amt}
                  </button>
                ))}
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:opacity-50 text-white font-bold text-lg shadow-lg shadow-indigo-600/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  disabled={
                    !paymentform.name ||
                    !paymentform.message ||
                    !paymentform.amount
                  }
                >
                  <span>🚀</span> Support with Razorpay
                </button>

                <div className="text-center text-xs text-slate-500 font-medium uppercase tracking-widest py-2">
                  OR
                </div>

                <button
                  onClick={() =>
                    payWithEsewa(Number.parseInt(paymentform.amount))
                  }
                  className="w-full py-4 rounded-2xl bg-[#60bb46] hover:bg-[#4fa238] disabled:bg-slate-700 disabled:opacity-50 text-white font-bold text-lg shadow-lg shadow-green-600/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  disabled={
                    esewaLoading ||
                    !paymentform.name ||
                    !paymentform.message ||
                    !paymentform.amount
                  }
                >
                  <span>🇳🇵</span>{" "}
                  {esewaLoading
                    ? "Connecting to eSewa..."
                    : "Support with eSewa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
