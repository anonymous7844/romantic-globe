// ---------- Importa os dados dos dois JSON ----------
import part1 from './romantic-places-part1.json' assert { type: 'json' };
import part2 from './romantic-places-part2.json' assert { type: 'json' };
const romanticPlaces = [...part1, ...part2];

// ---------- Estado ----------
let globeInstance;
const favorites = new Set(JSON.parse(localStorage.getItem('rg_favorites') || '[]'));
const unlocked = new Set(JSON.parse(localStorage.getItem('rg_unlocked_places') || '[]'));

// ---------- Elementos DOM ----------
const globeContainer = document.getElementById('globe-container');
const globeLoading = document.getElementById('globe-loading');
const modalPlace = document.getElementById('modal-place');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalDesc = document.getElementById('modal-description');
const btnFavorite = document.getElementById('btn-favorite');
const btnShare = document.getElementById('btn-share');
const modalChallenge = document.getElementById('modal-challenge');
const challengeTitle = document.getElementById('challenge-title');
const challengeBody = document.getElementById('challenge-body');
const toastContainer = document.getElementById('toast-container');
const badgeFavorites = document.getElementById('badge-favorites');

// ---------- Utils ----------
function updateFavoritesBadge() {
  badgeFavorites.textContent = favorites.size;
  localStorage.setItem('rg_favorites', JSON.stringify([...favorites]));
}

function updateUnlocked() {
  localStorage.setItem('rg_unlocked_places', JSON.stringify([...unlocked]));
  updateProgress();
}

function showToast(msg, timeout = 2500) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  toastContainer.appendChild(t);
  setTimeout(() => t.remove(), timeout);
}

function trapFocus(modalEl) {
  const focusable = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  let i = 0;
  function keyHandler(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) i = (i - 1 + focusable.length) % focusable.length;
      else i = (i + 1) % focusable.length;
      focusable[i].focus();
      e.preventDefault();
    } else if (e.key === 'Escape') {
      closeModal(modalEl);
    }
  }
  modalEl.addEventListener('keydown', keyHandler);
}

// ---------- Modais ----------
function openModal(modalEl) {
  modalEl.hidden = false;
  modalEl.setAttribute('aria-hidden', 'false');
  trapFocus(modalEl);
}
function closeModal(modalEl) {
  modalEl.hidden = true;
  modalEl.setAttribute('aria-hidden', 'true');
}
modalPlace.querySelector('.modal__close').addEventListener('click', () => closeModal(modalPlace));
modalChallenge.querySelector('.modal__close').addEventListener('click', () => closeModal(modalChallenge));

// ---------- Fetchers ----------
async function fetchImage(query) {
  try {
    const resp = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}`);
    const j = await resp.json();
    return j.url;
  } catch {
    return `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`;
  }
}
async function fetchGeneratedMessage(prompt) {
  const key = `rg_msg_${prompt}`;
  const cached = localStorage.getItem(key);
  if (cached) return cached;
  try {
    const resp = await fetch(`/api/deepseek?prompt=${encodeURIComponent(prompt)}`);
    const j = await resp.json();
    if (j.message) {
      localStorage.setItem(key, j.message);
      return j.message;
    }
  } catch {}
  return `Um lugar romântico chamado ${prompt} ❤️`;
}

// ---------- Progresso / Conquistas ----------
function updateProgress() {
  const total = romanticPlaces.length;
  const done = unlocked.size;
  const percent = Math.round((done / total) * 100);
  document.getElementById('progress-bar').style.width = percent + '%';
  document.getElementById('progress-text').textContent = `${done}/${total} desbloqueados`;
  if (done === 1) showToast('🎖️ Primeira descoberta!');
  if (done === Math.floor(total / 2)) showToast('🏅 Você chegou na metade!');
  if (done === total) showToast('🏆 Mapa completo!');
}

// ---------- UI ----------
async function showPlaceModal(place) {
  modalTitle.textContent = place.name;
  modalImage.src = await fetchImage(place.imageQuery || place.name);
  modalImage.alt = `Imagem de ${place.name}`;
  modalDesc.textContent = place.customMessage 
    ? place.customMessage 
    : await fetchGeneratedMessage(place.name);

  btnFavorite.onclick = () => {
    if (favorites.has(place.id)) {
      favorites.delete(place.id);
      showToast('Removido dos favoritos 💔');
    } else {
      favorites.add(place.id);
      showToast('Adicionado aos favoritos ❤️');
    }
    updateFavoritesBadge();
  };
  btnShare.onclick = async () => {
    const text = `Olha este lugar romântico: ${place.name}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copiado para a área de transferência 📋');
    } catch {
      showToast('Não foi possível copiar 😢');
    }
  };
  openModal(modalPlace);
}

// ---------- Desafios ----------
function showChallengeModal(place) {
  challengeTitle.textContent = place.challenge.question;
  challengeBody.innerHTML = '';
  const type = place.challenge.type;
  const map = {
    password: renderPasswordChallenge,
    quiz: renderQuizChallenge,
    riddle: renderRiddleChallenge
  };
  (map[type] || (() => showToast('Tipo não suportado')))(place);
  openModal(modalChallenge);
}
function markUnlockedAndShow(place) {
  unlocked.add(place.id);
  updateUnlocked();
  closeModal(modalChallenge);
  showToast('Desbloqueado com sucesso 🔓');
  showPlaceModal(place);
}

// tipos de desafio (exemplos)
function renderPasswordChallenge(place) {
  const input = document.createElement('input');
  input.type = 'password';
  input.placeholder = 'Digite a senha';
  const btn = document.createElement('button');
  btn.className = 'btn btn--primary';
  btn.textContent = 'Desbloquear';
  btn.onclick = () => input.value.trim() === place.challenge.answer
    ? markUnlockedAndShow(place)
    : showToast('Senha incorreta 💔');
  challengeBody.append(input, btn);
}
function renderQuizChallenge(place) {
  place.challenge.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'btn btn--secondary';
    btn.textContent = opt;
    btn.onclick = () => opt === place.challenge.answer
      ? markUnlockedAndShow(place)
      : showToast('Resposta errada 💔');
    challengeBody.append(btn);
  });
}
function renderRiddleChallenge(place) {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Resposta da charada';
  const btn = document.createElement('button');
  btn.className = 'btn btn--primary';
  btn.textContent = 'Responder';
  btn.onclick = () => input.value.trim().toLowerCase() === place.challenge.answer.toLowerCase()
    ? markUnlockedAndShow(place)
    : showToast('Resposta incorreta 💔');
  challengeBody.append(input, btn);
}

// cria o “pin” luz
function createLight(place) {
  const el = document.createElement('div');
  el.style.width = '8px';
  el.style.height = '40px';
  el.style.borderRadius = '4px';
  el.style.cursor = 'pointer';
  el.style.background = unlocked.has(place.id)
    ? 'dodgerblue'
    : place.challenge ? '#8b0000' : 'dodgerblue';
  el.style.boxShadow = `0 0 20px ${unlocked.has(place.id) ? 'dodgerblue' : place.challenge ? '#8b0000' : 'dodgerblue'}`;
  el.title = place.name;
  el.addEventListener('click', () => {
    if (unlocked.has(place.id) || !place.challenge) showPlaceModal(place);
    else showChallengeModal(place);
  });
  return el;
}

// ---------- Inicialização do globo ----------
async function init() {
  try {
    await window.loadGlobeLibs();
    globeInstance = Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .htmlElementsData(romanticPlaces)
      .htmlElement(d => createLight(d))
      .backgroundColor('#000')
      (globeContainer);
    globeLoading.remove();
    updateFavoritesBadge();
    updateProgress();
  } catch (err) {
    console.error(err);
    showToast('Não foi possível carregar o globo 😢');
  }
}

// ---------- Botões header ----------
document.getElementById('btn-day-night').addEventListener('click', () => {
  const isDark = document.body.dataset.theme === 'dark';
  document.body.dataset.theme = isDark ? 'light' : 'dark';
});
document.getElementById('btn-favorites').addEventListener('click', () => {
  const favPlaces = romanticPlaces.filter(p => favorites.has(p.id));
  if (!favPlaces.length) showToast('Nenhum favorito ainda ❤️');
  else showToast(`Você tem ${favPlaces.length} favoritos ❤️`);
});
document.getElementById('btn-achievements').addEventListener('click', () => {
  showToast(`Você desbloqueou ${unlocked.size} de ${romanticPlaces.length} lugares!`);
});
document.getElementById('btn-reset').addEventListener('click', () => {
  unlocked.clear();
  updateUnlocked();
  updateProgress();
  showToast('Progresso resetado 🔄');
});
document.getElementById('btn-unlock').addEventListener('click', () => {
  romanticPlaces.forEach(p => unlocked.add(p.id));
  updateUnlocked();
  showToast('Todos os lugares desbloqueados 🔓');
});
document.getElementById('btn-route').addEventListener('click', () => {
  showToast('Função de rota em breve 📍');
});

// ---------- Start ----------
init();
