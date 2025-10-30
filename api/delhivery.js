// delhivery-pincode-proxy/api/delhivery.js

export default async function handler(req, res) {
  // CORS Headers are good, keep them.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight (OPTIONS) request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { pin } = req.query;

  if (!pin) {
    return res.status(400).json({ error: "Missing pin code in query (e.g., ?pin=110001)" });
  }

  try {
    const response = await fetch(
      `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pin}`,
      {
        headers: {
          // *** CRITICAL FIX: Add "Token " prefix to the header ***
          Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Forward the error status from Delhivery
      return res.status(response.status).json({ error: "Delhivery API returned an error", details: data });
    }

    // Return the successful response from Delhivery
    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    // Vercel logs will show this
    return res.status(500).json({ error: "Internal Server Error during fetch operation" });
  }
}
