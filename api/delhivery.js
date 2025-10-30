export default async function handler(req, res) {
  // Allow CORS from any origin (or restrict to your Shopify domain)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { pin } = req.query;
  if (!pin) {
    return res.status(400).json({ error: "Pincode is required" });
  }

  try {
    const apiRes = await fetch(
      `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pin}`,
      {
        headers: {
          Authorization: "Token YOUR_DELHIVERY_API_TOKEN", // 🔑 replace this with your real Delhivery token
        },
      }
    );

    const data = await apiRes.json();
    res.status(200).json(data);

  } catch (err) {
    console.error("Delhivery API error:", err);
    res.status(500).json({ error: "Failed to fetch from Delhivery" });
  }
}
