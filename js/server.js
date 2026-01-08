const photos = []; // store in memory for now

app.post("/upload-photo", (req, res) => {
  const { image, lat, lng } = req.body;

  photos.push({
    image,
    lat,
    lng
  });

  res.json({ status: "ok" });
});

app.get("/photos", (req, res) => {
  res.json(photos);
});
