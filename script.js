function showModule(id) {
  const modules = document.querySelectorAll('.module');
  modules.forEach(mod => mod.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
