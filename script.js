else if (module === "upload") {
  const lastOutput = [...historyLog].reverse().find(entry =>
    entry.type === "Voiceover" || entry.type === "Script"
  );

  if (!lastOutput) {
    contentPanel.innerHTML = "<h1>🚀 Upload Strategy</h1><p class='subtext'>No content available to generate a strategy. Please create a script or voiceover first.</p>";
    return;
  }

  const sampleStrategy = `
Platform: YouTube Shorts & TikTok
Best Time to Post: 6 PM - 9 PM (peak engagement)
Hashtags: #moneytips #bossai #shorts
Caption: "This 30-second tip could change how you invest forever. Watch now."
Call to Action: "Subscribe for more daily tips."
  `;

  contentPanel.innerHTML = `
    <h1>🚀 Upload Strategy AI</h1>
    <p><strong>Based on your latest content:</strong></p>
    <pre style="white-space:pre-wrap;background:#f9f9f9;padding:10px;border-radius:6px;margin-bottom:10px;">${lastOutput.output}</pre>
    <button id="generate-strategy">Generate Upload Strategy</button>
    <pre id="strategy-output" style="margin-top:15px;"></pre>
  `;

  document.getElementById("generate-strategy").addEventListener("click", () => {
    document.getElementById("strategy-output").textContent = sampleStrategy;

    historyLog.push({
      type: "Upload Strategy",
      input: lastOutput.output,
      output: sampleStrategy,
      timestamp: new Date().toLocaleString()
    });
    saveHistory();
  });
}
