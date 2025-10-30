// /api/delhivery.js

export default async function handler(req, res) {
  const { pin } = req.query;

  if (!pin) {
    return res.status(400).json({ error: "Pincode is required" });
  }

  try {
    const apiRes = await fetch(`https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pin}`, {
      headers: {
        Authorization: "Token YOUR_DELHIVERY_API_TOKEN",
      },
    });

    const data = await apiRes.json();

    res.setHeader("Access-Control-Allow-Origin", "*"); // ✅ CORS fix
    res.status(200).json(data);

  } catch (err) {
    console.error("Delhivery API error:", err);
    res.status(500).json({ error: "Failed to fetch from Delhivery" });
  }
}
