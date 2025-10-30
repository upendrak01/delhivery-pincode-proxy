// delhivery-pincode-proxy/api/delhivery.js
console.log("Delhivery token loaded:", !!process.env.DELHIVERY_TOKEN);

export default async function handler(req, res) {
  // --- Always apply CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // --- Handle preflight (OPTIONS) request ---
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { pin, env } = req.query;

  if (!pin) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // ensure header for this path
    return res.status(400).json({
      error: "Missing pin code in query (e.g., ?pin=110001)",
    });
  }

  try {
    // --- Choose Delhivery environment ---
   const baseUrl = "https://staging-express.delhivery.com";


    const apiUrl = `${baseUrl}/c/api/pin-codes/json/?filter_codes=${pin}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    // --- Always re-apply CORS before sending response ---
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Delhivery API returned an error", details: data });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Proxy Error:", error);
    // --- Re-apply header even on error ---
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res
      .status(500)
      .json({ error: "Internal Server Error during fetch operation" });
  }
}
