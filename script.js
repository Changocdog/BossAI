else if (module === "voiceover") {
  const latestScript = [...historyLog].reverse().find(entry => entry.type === "Script");

  if (!latestScript) {
    contentPanel.innerHTML = "<h1>🎤 Voiceover</h1><p class='subtext'>No script found to convert.</p>";
    return;
  }

  contentPanel.innerHTML = `
    <h1>🎤 Voiceover AI</h1>
    <p><strong>Last Script:</strong></p>
    <pre style="white-space:pre-wrap;background:#f4f4f4;padding:10px;border-radius:6px;margin-bottom:10px;">${latestScript.output}</pre>
    <button id="simulate-voice">Simulate Voiceover</button>
    <pre id="voice-output" style="margin-top:15px;"></pre>
  `;

  document.getElementById("simulate-voice").addEventListener("click", () => {
    const voiceText = `🔊 Simulated Voiceover:\n\n"${latestScript.output}"`;
    document.getElementById("voice-output").textContent = voiceText;

    historyLog.push({
      type: "Voiceover",
      input: latestScript.output,
      output: voiceText,
      timestamp: new Date().toLocaleString()
    });
    saveHistory();
  });
}
