 async function startGame() {
    const opponent = document.querySelector('#userName')?.value;
    const response = await fetch('/api/game/new', {
      method: 'post',
      body: JSON.stringify({ username: getPlayerName(), opponent: opponent }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  
    if (response.ok) {
      window.location.href = 'play.html?opp=' + opponent;
    } else {
      const body = await response.json();
      const modalEl = document.querySelector('#msgModal');
      modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
      const msgModal = new bootstrap.Modal(modalEl, {});
      msgModal.show();
    }
  }
  
  function logout() {
    localStorage.removeItem('userName');
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => (window.location.href = '/'));
  }

  function getPlayerName() {
    return localStorage.getItem('userName') ?? 'Mystery player';
  }

document.querySelector('.player-name').textContent = getPlayerName();