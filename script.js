function switchModule(id) {
  document.querySelectorAll('.module').forEach(mod => mod.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
  const label = {
    dashboard: "Dashboard",
    script: "Script Writer",
    voice: "Voiceover AI",
    video: "Video Clipper",
    legal: "Legal Checker",
    upload: "Uploader"
  };
  document.querySelectorAll('.sidebar li').forEach(li => {
    if (li.innerText === label[id]) li.classList.add('active');
  });
}

function generate(id) {
  const module = document.getElementById(id);
  const input = module.querySelector('input').value.trim();
  const output = module.querySelector('.output');
  output.innerText = input ? `Generated result: ${input}` : 'Please enter something.';
}

// Sidebar toggle logic
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleBtn');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });
});
