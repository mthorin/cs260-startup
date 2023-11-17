function logout() {
  localStorage.removeItem('userName');
  localStorage.removeItem('games');
  fetch(`/api/auth/logout`, {
    method: 'delete',
  }).then(() => (window.location.href = '/'));
}
