async function runManagerCommand() {
  const command = document.getElementById("manager-command").value.trim();
  const box = document.getElementById("manager-response");
  const key = localStorage.getItem("openrouter_key");
  if (!key || !command) return (box.innerHTML = "❌ Missing input or key");
  box.innerHTML = "🤖 Thinking...";

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are Manager AI. When user says "connect X to Y", respond in javascript block like this: \`\`\`js\naddNode("X");\naddNode("Y");\ndrawLinkBetweenNodes("X","Y");\n\`\`\``
          },
          { role: "user", content: command }
        ]
      })
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "❌ No response";
    box.innerHTML = reply;

    const match = reply.match(/```js\s*([\s\S]+?)```/);
    if (match) {
      // Force switch to Automation module and wait for canvas
      document.querySelector('[data-module="automation"]').click();
      setTimeout(() => {
        try {
          eval(match[1]);
        } catch (err) {
          box.innerHTML += `<br><span style="color:red;">⚠️ JS Error: ${err.message}</span>`;
        }
      }, 300); // slight delay to allow initAutomation() to run
    }
  } catch (err) {
    box.innerHTML = "❌ Failed to connect.";
  }
}
