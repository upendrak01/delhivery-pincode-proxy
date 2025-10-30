export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // ✅ Allow all origins (you can later restrict to your domain)
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight (OPTIONS) request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { pin } = req.query;

  if (!pin) {
    return res.status(400).json({ error: "Missing pin code" });
  }

  try {
    const response = await fetch(
      `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pin}`,
      {
        headers: {
          Authorization: process.env.DELHIVERY_TOKEN,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: "Delhivery API error", details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
