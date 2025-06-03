function switchModule(moduleId) {
  const modules = document.querySelectorAll('.module');
  const buttons = document.querySelectorAll('.nav-button');

  modules.forEach(mod => mod.classList.remove('active'));
  buttons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(moduleId).classList.add('module', 'active');
  document.getElementById(`btn-${moduleId}`).classList.add('active');
}

function generate() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  if (!prompt.trim()) {
    output.innerText = "Please enter a prompt to generate a video.";
    return;
  }

  output.innerText = `Generating video for: "${prompt}"...`;
}
