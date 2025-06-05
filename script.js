} else if (module === "upload") {
  contentPanel.innerHTML = `
    <h1>📤 Upload Strategy AI</h1>
    <p class="subtext">Paste your finished script below and Boss AI will generate a high-performing upload plan.</p>

    <textarea id="upload-script" rows="5" placeholder="Paste your video script here..." style="width:100%;padding:12px;font-size:15px;border-radius:8px;border:1px solid #ccc;"></textarea>
    <button id="generate-upload" style="margin-top:10px;">Generate Upload Strategy</button>

    <div id="upload-result" style="margin-top:30px;"></div>
  `;

  document.getElementById("generate-upload").addEventListener("click", async () => {
    const script = document.getElementById("upload-script").value.trim();
    const apiKey = document.getElementById("api-key").value.trim();
    const resultBox = document.getElementById("upload-result");

    if (!script || !apiKey) {
      resultBox.innerHTML = `<p style="color:red;">❗ Please enter a script and API key.</p>`;
      return;
    }

    resultBox.innerHTML = `<p>⏳ Generating upload strategy...</p>`;

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
            content: `
Given this short-form video script, generate an upload strategy:

1. Choose the best platform (YouTube Shorts, TikTok, or Instagram Reels)
2. Suggest a strong video title
3. Provide 3 top hashtags
4. Recommend the best time of day to post for reach
5. Include a brief reason for each choice

SCRIPT:
"${script}"
            `
          }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content || "⚠️ No response.";
      resultBox.innerHTML = `<div style="white-space:pre-wrap;padding:16px;background:#f9f9f9;border-radius:8px;border:1px solid #ddd;">${result}</div>`;
    } catch (err) {
      console.error(err);
      resultBox.innerHTML = `<p style="color:red;">❌ Failed to fetch strategy. Check your API key.</p>`;
    }
  });
}
