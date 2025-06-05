document.addEventListener("DOMContentLoaded", () => {
  const sidebarButtons = document.querySelectorAll("#sidebar button");
  const contentPanel = document.getElementById("content-panel");
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");
  const popup = document.getElementById("onboarding-popup");
  const closePopup = document.getElementById("close-popup");
  const modeToggle = document.getElementById("mode-toggle");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  modeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", modeToggle.checked);
  });

  closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  // Show onboarding popup once
  if (!sessionStorage.getItem("onboardingShown")) {
    popup.classList.remove("hidden");
    sessionStorage.setItem("onboardingShown", "true");
  }

  sidebarButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sidebarButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const module = btn.getAttribute("data-module");
      renderModule(module);
    });
  });

  document.getElementById("sample-script").addEventListener("click", () => {
    contentPanel.innerHTML = `
      <h2>📽️ Sample Video Script</h2>
      <pre>
Here's how to build wealth in your 20s:

1. Live below your means
2. Invest early and often
3. Build high-income skills
4. Avoid bad debt

Let your money work while you sleep. 💸
      </pre>`;
  });

  function renderModule(module) {
    switch (module) {
      case "manager":
        contentPanel.innerHTML = `
          <h1>👑 Boss AI Manager</h1>
          <p class="subtext">Your AI empire starts here. Select a module to begin or try a sample task.</p>
          <button id="sample-script" class="primary">🎬 Try Sample Script</button>
        `;
        document.getElementById("sample-script").addEventListener("click", () => {
          contentPanel.innerHTML = `
            <h2>📽️ Sample Video Script</h2>
            <pre>
Here's how to build wealth in your 20s:

1. Live below your means
2. Invest early and often
3. Build high-income skills
4. Avoid bad debt

Let your money work while you sleep. 💸
            </pre>`;
        });
        break;

      case "feedback":
        contentPanel.innerHTML = `
          <div class="feedback-form">
            <h2>📝 Send Feedback</h2>
            <label for="name">Your Name</label>
            <input type="text" id="name" placeholder="Optional..." />
            <label for="message">Your Feedback</label>
            <textarea id="message" rows="6" placeholder="Share your thoughts..."></textarea>
            <button onclick="submitFeedback()" class="primary">Submit</button>
          </div>
        `;
        break;

      default:
        contentPanel.innerHTML = `<h2>${module.toUpperCase()} coming soon...</h2>`;
    }
  }
});

function submitFeedback() {
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;
  if (!message.trim()) {
    alert("Please enter a message before submitting.");
    return;
  }
  alert("✅ Feedback submitted. Thank you!");
  document.getElementById("name").value = "";
  document.getElementById("message").value = "";
}
