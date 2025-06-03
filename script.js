function generate() {
  const input = document.getElementById('prompt').value;
  const output = document.getElementById('output');
  output.innerText = `Generating video for: "${input}" ...`;
}
