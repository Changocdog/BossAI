
document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("taskInput");
  const output = document.getElementById("outputBox");
  const generateBtn = document.getElementById("generateBtn");

  generateBtn.addEventListener("click", async () => {
    const userTask = input.value.trim();
    if (!userTask) {
      output.value = "Please enter a task or topic.";
      return;
    }

    output.value = "🧠 Task AI is analyzing your input...\n";
    await delay(1000);
    output.value += "📝 Script AI is writing your script...\n";
    await delay(1000);
    output.value += "🎙️ Voiceover AI is generating the audio...\n";
    await delay(1000);
    output.value += "🎬 Clipper AI is assembling the video...\n";
    await delay(1000);
    output.value += "📤 Upload AI is preparing your content...\n";
    await delay(1000);
    output.value += "⚖️ Legal AI is verifying compliance...\n";
    await delay(1000);
    output.value += "📊 Manager AI is scheduling and optimizing...\n";
    await delay(1000);
    output.value += "✅ Done! Your finance video has been generated.";
  });

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});
