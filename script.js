} else if (module === "legal") {
  contentPanel.innerHTML = `
    <h1>📜 Legal AI Review</h1>
    <p class="subtext">Paste your script to check for copyright, defamation, or inappropriate content.</p>

    <textarea id="legal-script" rows="5" placeholder="Paste script here for legal review..." style="width:100%;padding:12px;font-size:15px;border-radius:8px;border:1px solid #ccc;"></textarea>
    <button id="run-legal-review" style="margin-top:10px;">Run Legal Review</button>

    <div id="legal-result" style="margin-top:30px;"></div>
  `;

  document.getElementById("run-legal-review").addEventListener("click", async () => {
    const script = document.getElementById("legal-script").value.trim();
    const apiKey = document.getElementById("api-key").value.trim();
    const resultBox = document.getElementById("legal-result");

    if (!script || !apiKey) {
      resultBox.innerHTML = `<p style="color:red;">❗ Please enter a script and API key.</p>`;
      return;
    }

    resultBox.innerHTML = `<p>🔎 Reviewing script for legal risks...</p>`;

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
Review the following script and provide a legal risk assessment. Identify any potential copyright infringement, defamation, offensive content, false claims, or unsafe advice. Suggest how to fix any issues found.

SCRIPT:
"${script}"
            `
          }],
          temperature: 0.6
        })
      });

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content || "⚠️ No response.";
      resultBox.innerHTML = `<div style="white-space:pre-wrap;padding:16px;background:#fff5f5;border-radius:8px;border:1px solid #f5c2c2;color:#8b0000;">${result}</div>`;
    } catch (err) {
      console.error(err);
      resultBox.innerHTML = `<p style="color:red;">❌ Legal review failed. Check your API key.</p>`;
    }
  });
}
