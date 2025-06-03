function generate() {
  const prompt = document.getElementById('prompt').value;
  document.getElementById('output').innerText = `Generating video for: ${prompt}`;
}
