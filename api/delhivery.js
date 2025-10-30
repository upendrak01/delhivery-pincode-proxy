// /api/delhivery.js
export default async function handler(req, res) {
  // 🧪 Check that your environment variable exists
  const hasToken = !!process.env.DELHIVERY_TOKEN;
  console.log("✅ DELHIVERY_TOKEN loaded:", hasToken);

  if (!hasToken) {
    return res.status(500).json({
      error: "❌ DELHIVERY_TOKEN not found on server",
    });
  }

  // --- Set CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // --- Handle preflight request ---
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { pin } = req.query;

  if (!pin) {
    return res.status(400).json({ error: "Missing ?pin parameter" });
  }

  try {
    // ✅ Use production Delhivery API (since your token is live)
    const baseUrl = "https://track.delhivery.com";

    const apiUrl = `${baseUrl}/c/api/pin-codes/json/?filter_codes=${pin}`;

    console.log("📦 Fetching:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Delhivery API error:", data);
      return res
        .status(response.status)
        .json({ error: "Delhivery API returned an error", details: data });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("🔥 Proxy Error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
}
