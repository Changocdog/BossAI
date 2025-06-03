function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('active');
}

function showSection(id) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(sec => sec.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}
