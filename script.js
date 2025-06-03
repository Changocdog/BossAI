function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
}

function loadModule(name) {
  document.getElementById("output").innerText = `Loaded ${name} module...`;
}

function generate() {
  const prompt = document.getElementById("prompt").value;
  document.getElementById("output").innerText = `Generating video for: ${prompt}`;
}
