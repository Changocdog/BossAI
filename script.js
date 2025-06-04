<script>
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === '0px') {
      sidebar.style.left = '-250px';
    } else {
      sidebar.style.left = '0px';
    }
  }

  function generate() {
    const output = document.getElementById('output');
    const input = document.getElementById('promptInput').value;
    if (!input.trim()) {
      output.textContent = 'Please enter a prompt.';
      return;
    }

    output.textContent = 'Generating...';

    fetch("https://YOUR_BACKEND_URL_HERE/generate-script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: input })
    })
    .then(res => res.json())
    .then(data => {
      output.textContent = data.response || "No response received.";
    })
    .catch(err => {
      console.error(err);
      output.textContent = "An error occurred while generating.";
    });
  }
</script>
