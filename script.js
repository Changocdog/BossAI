
function submitPrompt() {
    const prompt = document.getElementById("userPrompt").value;
    const outputDiv = document.getElementById("output");
    if (!prompt.trim()) {
        outputDiv.innerHTML = "<p>Please enter a prompt.</p>";
        return;
    }
    outputDiv.innerHTML = "<p>Processing...</p>";
    setTimeout(() => {
        outputDiv.innerHTML = `<p><strong>Generated Result:</strong> "${prompt}" processed by Boss AI.</p>`;
    }, 2000);
}
