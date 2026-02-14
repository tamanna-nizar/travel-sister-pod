document.getElementById("form").addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
    destination: document.getElementById("destination").value,
    startDate: document.getElementById("startDate").value,
    endDate: document.getElementById("endDate").value,
    budget: document.getElementById("budget").value,
    travelType: document.getElementById("travelType").value,
    photoshootInterest: document.getElementById("photoshootInterest").checked,
    cafeHopping: document.getElementById("cafeHopping").checked,
    shopping: document.getElementById("shopping").checked
  };

  try {
    const res = await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    document.getElementById("output").innerHTML = `

--------------------------------<br>
💖 Your Travel Pod<br>
--------------------------------<br>
${result.group.map(u => `🌸 ${u.name} — ${u.score}% match`).join("<br>")}
<br><br>

--------------------------------<br>
✨ Suggested Itinerary<br>
--------------------------------<br>
${result.itinerary.join("<br>")}
<br><br>

--------------------------------<br>
🧠 Why You Matched<br>
--------------------------------<br>
✔ Destination match<br>
✔ Budget match<br>
✔ Travel style match<br>
✔ Interest match

    `;

    document.getElementById("form").reset();

  } catch (err) {
    console.error(err);
    document.getElementById("output").innerHTML = "⚠️ Something went wrong. Try again.";
  }
});
