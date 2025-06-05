// Sidebar switching logic
document.querySelectorAll('.sidebar-btn').forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Hide all panels
    document.querySelectorAll('.module-panel').forEach(panel => panel.classList.add('hidden'));

    // Show target panel
    const target = button.dataset.module;
    document.getElementById(target).classList.remove('hidden');
  });
});

// Script Writer AI logic
document.getElementById('generate-btn')?.addEventListener('click', async () => {
  const input = document.getElementById('script-input').value;
  const apiKey = document.getElementById('api-key').value;
  const output = document.getElementById('script-output');

  if (!input || !apiKey) {
    output.textContent = '❗ Please enter a topic and your OpenAI API key.';
    return;
  }

  output.textContent = '⏳ Generating...';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Write a short-form video script about: ${input}` }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const script = data.choices?.[0]?.message?.content || '⚠️ No response received.';
    output.textContent = script;
  } catch (error) {
    output.textContent = '❌ Error generating script.';
    console.error(error);
  }
});
