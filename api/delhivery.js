// api/delhivery.js
//
// This serverless function acts as a secure proxy between your Shopify store
// and the Delhivery API. It hides your API token and avoids CORS errors.
//

export default async function handler(req, res) {
  try {
    const { pin } = req.query;

    // ✅ Validate pincode format (6-digit Indian pincode)
    if (!pin || !/^[1-9][0-9]{5}$/.test(pin)) {
      return res.status(400).json({ error: "Invalid or missing pincode" });
    }

    // ✅ Call Delhivery API
    const apiUrl = `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pin}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Delhivery API error: ${response.status}`);
    }

    const data = await response.json();

    // ✅ Return JSON response to Shopify frontend
    res.status(200).json(data);
  } catch (error) {
    console.error("Delhivery Proxy Error:", error);
    res.status(500).json({
      error: "Failed to fetch data from Delhivery",
      details: error.message,
    });
  }
}
