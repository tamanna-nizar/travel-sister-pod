const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 🌸 Safe users.json load
let users = [];
try {
  const data = fs.readFileSync("./users.json", "utf-8");
  users = JSON.parse(data);
  console.log(`✅ Loaded ${users.length} users from users.json`);
} catch (err) {
  console.warn("⚠️ Could not load users.json, starting with empty list");
}

// 🌸 Date Overlap Check
function dateOverlap(u1, u2) {
  return (
    new Date(u1.startDate) <= new Date(u2.endDate) &&
    new Date(u2.startDate) <= new Date(u1.endDate)
  );
}

// 🌸 MATCH API
app.post("/match", (req, res) => {
  try {
    const newUser = req.body;
    console.log("🔥 New Match Request:", newUser);

    let matched = users.map(user => {
      let score = 0;

      if (user.destination.toLowerCase() === newUser.destination.toLowerCase()) score += 30;
      if (dateOverlap(user, newUser)) score += 25;
      if (user.budget === newUser.budget) score += 15;
      if (user.travelType === newUser.travelType) score += 15;
      if (user.photoshootInterest === newUser.photoshootInterest) score += 5;
      if (user.cafeHopping === newUser.cafeHopping) score += 5;
      if (user.shopping === newUser.shopping) score += 5;

      return { ...user, score };
    });

    matched = matched
      .filter(u => u.score >= 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    matched.push({
      name: newUser.name || "You",
      score: 100
    });

    const itinerary = generateItinerary(newUser);

    res.json({ group: matched, itinerary });

  } catch (error) {
    console.error("❌ Match Error:", error);
    res.status(500).json({ error: "Something went wrong in matching" });
  }
});

// 🌸 Itinerary Generator
function generateItinerary(user) {
  const plan = [];
  const days = Math.max(
    1,
    Math.ceil((new Date(user.endDate) - new Date(user.startDate)) / (1000 * 60 * 60 * 24))
  );

  for (let i = 0; i < days; i++) {
    if (user.photoshootInterest) plan.push(`Day ${i + 1}: Beach Photoshoot + Cute Cafe Visit`);
    else if (user.shopping) plan.push(`Day ${i + 1}: Local Market + Shopping + Street Food`);
    else if (user.cafeHopping) plan.push(`Day ${i + 1}: Cafe Hopping + Dessert + Chill Walk`);
    else plan.push(`Day ${i + 1}: Explore + Sunset + Local Food`);
  }

  return plan;
}

// 🌸 Health Check Route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 🌸 Start Server
app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});