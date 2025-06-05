// Sidebar switching
document.querySelectorAll('.sidebar-btn').forEach(button => {
  button.addEventListener('click', () => {
    // Remove 'active' class from all sidebar buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Hide all panels
    document.querySelectorAll('.module-panel').forEach(panel => {
      panel.classList.add('hidden');
    });

    // Show the panel corresponding to the clicked button
    const targetId = button.dataset.module;
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.classList.remove('hidden');
    }
  });
});
