// delhivery-pincode-proxy/api/delhivery.js

export default async function handler(req, res) {
  // --- CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // --- Handle preflight (OPTIONS) request ---
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { pin, env } = req.query;

  if (!pin) {
    return res.status(400).json({
      error: "Missing pin code in query (e.g., ?pin=110001)",
    });
  }

  try {
    // --- Choose Delhivery environment ---
    // Force staging via ?env=staging, otherwise auto-pick based on Vercel environment
    const baseUrl =
      env === "staging"
        ? "https://staging-express.delhivery.com"
        : process.env.NODE_ENV === "production"
        ? "https://track.delhivery.com"
        : "https://staging-express.delhivery.com";

    const apiUrl = `${baseUrl}/c/api/pin-codes/json/?filter_codes=${pin}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Delhivery API returned an error", details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error during fetch operation" });
  }
}
