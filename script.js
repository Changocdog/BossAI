function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.transform = sidebar.style.transform === "translateX(-220px)" ? "translateX(0)" : "translateX(-220px)";
}

function generate() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");
  output.innerText = `Generating video for: ${prompt}`;
}
