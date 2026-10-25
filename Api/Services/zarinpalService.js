// Reads env lazily, so it works no matter when dotenv is loaded.
const isSandbox = () => process.env.ZARINPAL_SANDBOX !== "false";

const base = () =>
  isSandbox()
    ? "https://sandbox.zarinpal.com/pg/v4/payment"
    : "https://payment.zarinpal.com/pg/v4/payment";

export const ZARINPAL = {
  get GATEWAY() {
    return isSandbox()
      ? "https://sandbox.zarinpal.com/pg/StartPay/"
      : "https://payment.zarinpal.com/pg/StartPay/";
  },
};

// Parse Zarinpal JSON responses, including error responses.
const post = async (path, payload) => {
  const res = await fetch(`${base()}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Zarinpal returned a non-JSON response (HTTP ${res.status}): ${text.slice(0, 200)}`,
    );
  }
};

// Validate the amount before sending it to Zarinpal.
const validateAmount = (amount) => {
  const parsedAmount = Number(amount);

  if (!Number.isSafeInteger(parsedAmount) || parsedAmount < 1000) {
    throw new Error(
      `Invalid Zarinpal amount: ${amount}. Amount must be an integer of at least 1000 in the configured currency unit.`,
    );
  }

  return parsedAmount;
};

export async function createPayment(amount, description, orderId) {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  const serverUrl = process.env.SERVER_URL;

  if (!merchantId) {
    throw new Error("ZARINPAL_MERCHANT_ID is not set");
  }

  if (!serverUrl) {
    throw new Error("SERVER_URL is not set");
  }

  return post("request.json", {
    merchant_id: merchantId,
    amount: validateAmount(amount),
    currency: process.env.ZARINPAL_CURRENCY || "IRT",
    description,
    callback_url: `${serverUrl}/api/bookings/verify-payment`,
    metadata: {
      order_id: String(orderId),
    },
  });
}

export async function verifyPayment({ amount, authority }) {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;

  if (!merchantId) {
    throw new Error("ZARINPAL_MERCHANT_ID is not set");
  }

  return post("verify.json", {
    merchant_id: merchantId,
    amount: validateAmount(amount),
    authority,
  });
}
