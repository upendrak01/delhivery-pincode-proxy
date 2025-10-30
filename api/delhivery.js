export default async function handler(req, res) {
  // --- Allow CORS from any origin (Shopify frontend) ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // --- Handle preflight ---
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { pin } = req.query;
  if (!pin) {
    return res.status(400).json({ error: "Pincode is required" });
  }

  try {
    // --- Choose API environment (optional staging support) ---
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://track.delhivery.com"
        : "https://staging-express.delhivery.com";

    // --- Fetch from Delhivery API ---
    const apiRes = await fetch(
      `${baseUrl}/c/api/pin-codes/json/?filter_codes=${pin}`,
      {
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    const data = await apiRes.json();

    // --- Handle API errors gracefully ---
    if (!apiRes.ok) {
      return res
        .status(apiRes.status)
        .json({ error: "Delhivery API returned an error", details: data });
    }

    // --- Return data to Shopify frontend ---
    res.status(200).json(data);

  } catch (err) {
    console.error("Delhivery API error:", err);
    res.status(500).json({ error: "Failed to fetch from Delhivery" });
  }
}
