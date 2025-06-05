else if (module === "legal") {
  const latestScript = [...historyLog].reverse().find(entry => entry.type === "Script");

  if (!latestScript) {
    contentPanel.innerHTML = "<h1>🛡️ Legal Review</h1><p class='subtext'>No script available for review.</p>";
    return;
  }

  contentPanel.innerHTML = `
    <h1>🛡️ Legal Review AI</h1>
    <p><strong>Last Script:</strong></p>
    <pre style="white-space:pre-wrap;background:#f4f4f4;padding:10px;border-radius:5px;margin-bottom:10px;">${latestScript.output}</pre>
    <button id="run-legal-check">Run Legal Check</button>
    <pre id="legal-output" style="margin-top:15px;"></pre>
  `;

  document.getElementById("run-legal-check").addEventListener("click", async () => {
    const apiKey = document.getElementById("api-key").value;
    const output = document.getElementById("legal-output");

    if (!apiKey) return alert("Please enter your OpenAI API key.");

    output.textContent = "🔍 Reviewing for legal risks...";

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Analyze the following video script for any potential copyright issues, risky claims, or platform policy violations. Be brief and only flag actual risks:\n\n"${latestScript.output}"`
            }
          ],
          temperature: 0.4
        })
      });

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content || "⚠️ No response.";
      output.textContent = result;

      historyLog.push({
        type: "Legal Review",
        input: latestScript.output,
        output: result,
        timestamp: new Date().toLocaleString()
      });
      saveHistory();
    } catch (err) {
      output.textContent = "❌ Error running legal review.";
    }
  });
}
