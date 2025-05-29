import express from "express";
import fetch from "node-fetch";
import sharp from "sharp";

const app = express();
const PORT = 5000;

// ... kode API overlay kamu di sini
app.get("/overlay", async (req, res) => {
  const { obUrl, hsUrl } = req.query;
  if (!obUrl || !hsUrl) {
    return res.status(400).send("obUrl and hsUrl required");
  }
  // Download gambar
  const [obBuf, hsBuf] = await Promise.all([
    fetch(obUrl).then((r) => r.buffer()),
    fetch(hsUrl).then((r) => r.buffer()),
  ]);
  // Buat PNG overlay (putihkan HS jadi transparan)
  const hsPng = await sharp(hsBuf)
    .removeAlpha()
    .toColourspace("rgb")
    .toBuffer();
  const { data, info } = await sharp(hsPng)
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 3) {
    if (data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245) {
      // mark putih untuk transparan
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
  }
  const hsWithAlpha = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 3 },
  })
    .ensureAlpha(0)
    .png()
    .toBuffer();
  // Gabungkan OB (background) dan HS (foreground transparan)
  const final = await sharp(obBuf)
    .composite([{ input: hsWithAlpha }])
    .png()
    .toBuffer();
  res.set("Content-Type", "image/png");
  res.send(final);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
