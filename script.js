function showModule(id) {
  const modules = document.querySelectorAll('.module');
  modules.forEach(m => m.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
