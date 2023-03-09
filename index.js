const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./conn");
const URL = require("./models/url");
const app = express();
const PORT = 8000;

connectToMongoDB("mongodb://0.0.0.0:27017/short-url").then(() => {
  console.log("connected to mongoDB");
});

app.use(express.json());

// if it starts from '/url' ,use urlRoute
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
