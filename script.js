// Sidebar switching
document.querySelectorAll('.sidebar-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const target = button.dataset.module;
    document.querySelectorAll('.module-panel').forEach(panel => {
      panel.classList.add('hidden');
    });
    document.getElementById(`${target}-panel`).classList.remove('hidden');
  });
});

// Script Writer
document.getElementById('generate-script-btn').addEventListener('click', async () => {
  const input = document.getElementById('script-input').value;
  const apiKey = document.getElementById('api-key').value;
  const output = document.getElementById('script-output');

  if (!input || !apiKey) {
    output.textContent = '❗ Enter a topic and your OpenAI API key.';
    return;
  }

  output.textContent = '⏳ Generating...';

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Write a short YouTube script about: ${input}` }]
      })
    });

    const data = await response.json();
    output.textContent = data.choices?.[0]?.message?.content || '⚠️ No output.';
  } catch (error) {
    output.textContent = '❌ Error generating script.';
  }
});

// Voiceover AI (simulated)
document.getElementById('generate-voiceover-btn').addEventListener('click', () => {
  const status = document.getElementById('voiceover-status');
  status.textContent = '🎤 Voiceover simulated! (Audio generation coming soon)';
});

// Feedback Form
document.getElementById('feedback-form').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('popup').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('popup').classList.add('hidden');
  }, 2000);
});
