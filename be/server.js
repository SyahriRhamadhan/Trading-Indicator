import express from "express";
import fetch from "node-fetch";
import sharp from "sharp";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());

// Overlay endpoint: bg=background, fg=overlay
app.get("/overlay", async (req, res) => {
  try {
    const { bg, fg } = req.query;
    if (!bg || !fg) {
      return res
        .status(400)
        .send("Query bg (background) dan fg (overlay) wajib");
    }
    // Download images
    const [bgBuf, fgBuf] = await Promise.all([
      fetch(bg).then((r) => r.buffer()),
      fetch(fg).then((r) => r.buffer()),
    ]);
    // Putihkan overlay (fg) jadi transparan
    const fgPng = await sharp(fgBuf).png().toBuffer();
    const { data, info } = await sharp(fgPng)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245)
        data[i + 3] = 0;
    }
    const fgWithAlpha = await sharp(data, { raw: { ...info, channels: 4 } })
      .png()
      .toBuffer();
    // Gabungkan background + overlay
    const final = await sharp(bgBuf)
      .composite([{ input: fgWithAlpha }])
      .png()
      .toBuffer();
    res.set("Content-Type", "image/png");
    res.send(final);
  } catch (err) {
    console.error("Overlay error:", err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Overlay server running at http://0.0.0.0:${PORT}`);
});
