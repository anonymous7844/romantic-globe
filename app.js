// app.js — versão otimizada e compatível com GitHub Pages/Vercel

// --------- Carrega dados ---------
async function loadPlaces() {
  const [part1, part2] = await Promise.all([
    fetch('/romantic-places-part1.json').then(r => r.json()),
    fetch('/romantic-places-part2.json').then(r => r.json())
  ]);
  return [...part1, ...part2];
}

// --------- Estado ----------
let romanticPlaces = [];
let globeInstance;
const favorites = new Set(JSON.parse(localStorage.getItem('rg_favorites') || '[]'));
const unlocked = new Set(JSON.parse(localStorage.getItem('rg_unlocked_places') || '[]'));

// --------- Elementos DOM ----------
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

// --------- Utils ----------
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
  t.className = 'toast fade-in';
  t.textContent = msg;
  toastContainer.appendChild(t);
  setTimeout(() => t.remove(), timeout);
}

// --------- Modais ----------
function openModal(modalEl) {
  modalEl.hidden = false;
  modalEl.setAttribute('aria-hidden', 'false');
}
function closeModal(modalEl) {
  modalEl.hidden = true;
  modalEl.setAttribute('aria-hidden', 'true');
}
modalPlace.querySelector('.modal__close').addEventListener('click', () => closeModal(modalPlace));
modalChallenge.querySelector('.modal__close').addEventListener('click', () => closeModal(modalChallenge));

// --------- Fetchers ----------
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

// --------- Progresso / Conquistas ----------
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

// --------- UI ----------
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

// --------- Desafios ----------
function showChallengeModal(place) {
  challengeTitle.textContent = place.challenge.question;
  challengeBody.innerHTML = '';
  renderChallenge(place);
  openModal(modalChallenge);
}
function markUnlockedAndShow(place) {
  unlocked.add(place.id);
  updateUnlocked();
  closeModal(modalChallenge);
  showToast('Desbloqueado com sucesso 🔓');
  showPlaceModal(place);
}

// desafio simples (pode adicionar os outros tipos aqui)
function renderChallenge(place) {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Digite a resposta';
  const btn = document.createElement('button');
  btn.className = 'btn btn--primary';
  btn.textContent = 'Verificar';
  btn.onclick = () => input.value.trim().toLowerCase() === place.challenge.answer.toLowerCase()
    ? markUnlockedAndShow(place)
    : showToast('Resposta incorreta 💔');
  challengeBody.append(input, btn);
}

// cria o “pin” (efeito luz 3D)
function createPin(place) {
  const el = document.createElement('div');
  el.style.width = '14px';
  el.style.height = '14px';
  el.style.borderRadius = '50%';
  el.style.cursor = 'pointer';
  el.style.background = unlocked.has(place.id)
    ? 'dodgerblue'
    : place.challenge
    ? 'crimson'
    : 'dodgerblue';
  el.classList.add('fade-in');
  el.title = place.name;
  el.addEventListener('click', () => {
    if (unlocked.has(place.id) || !place.challenge) showPlaceModal(place);
    else showChallengeModal(place);
  });
  return el;
}

// --------- Inicialização do globo ----------
async function init() {
  romanticPlaces = await loadPlaces();
  // aguarda Globe lib
  await new Promise(res => {
    const check = () => { if (window.Globe) res(); else setTimeout(check, 100); };
    check();
  });
  globeInstance = Globe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .htmlElementsData(romanticPlaces)
    .htmlElement(d => createPin(d))
    .backgroundColor('#000')
    (globeContainer);
  globeLoading.remove();
  updateFavoritesBadge();
  updateProgress();
}

// --------- Botões header ----------
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

// --------- Start ----------
document.addEventListener('DOMContentLoaded', init);
