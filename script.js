} else if (module === "script") {
  contentPanel.innerHTML = `
    <h1>✍️ Script Writer AI</h1>
    <p class="subtext">Describe your short-form video idea, and Boss AI will generate a viral script.</p>

    <textarea id="script-input" rows="4" placeholder="e.g. How to build credit as a student..." style="width:100%;padding:12px;font-size:15px;border-radius:8px;border:1px solid #ccc;"></textarea>
    <button id="generate-script" style="margin-top:10px;">Generate Script</button>

    <div id="script-result" style="margin-top:30px;"></div>
  `;

  document.getElementById("generate-script").addEventListener("click", async () => {
    const prompt = document.getElementById("script-input").value.trim();
    const apiKey = document.getElementById("api-key").value.trim();
    const resultBox = document.getElementById("script-result");

    if (!prompt || !apiKey) {
      resultBox.innerHTML = `<p style="color:red;">❗ Please enter a prompt and API key.</p>`;
      return;
    }

    resultBox.innerHTML = `<p>⏳ Generating script...</p>`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: `Write a viral YouTube Shorts script for this topic: "${prompt}". Make it clear, engaging, and under 60 seconds.`
          }],
          temperature: 0.8
        })
      });

      const data = await response.json();
      const script = data.choices?.[0]?.message?.content || "⚠️ No response.";
      resultBox.innerHTML = `<div style="white-space:pre-wrap;padding:16px;background:#f9f9f9;border-radius:8px;border:1px solid #ddd;">${script}</div>`;
    } catch (err) {
      console.error(err);
      resultBox.innerHTML = `<p style="color:red;">❌ Failed to fetch script. Check your API key.</p>`;
    }
  });
}
