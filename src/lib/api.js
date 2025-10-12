const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('token') || '';
}
function setToken(token) {
  if (token) localStorage.setItem('token', token);
}
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('tutorId');
  localStorage.removeItem('isAdmin');
}
function setUserMeta({ tutorId, isAdmin }) {
  if (tutorId) localStorage.setItem('tutorId', tutorId);
  if (typeof isAdmin === 'boolean') localStorage.setItem('isAdmin', isAdmin ? '1' : '0');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data;
}

// Auth
export async function login(email, senha) {
  const data = await request('/autenticacao', { method: 'POST', body: { email, senha } });
  const token = data.token || data.jwt || data.accessToken || data.access_token;
  if (token) setToken(token);
  // Tenta pegar id e is_admin se vierem
  const tutorId = data?.tutor?.id || data?.user?.id || data?.id;
  const isAdmin = data?.tutor?.is_admin ?? data?.user?.is_admin ?? data?.is_admin;
  setUserMeta({ tutorId, isAdmin: !!isAdmin });
  return data;
}
export function logout() { clearAuth(); }

// Tutores
export async function createTutor(payload) {
  const data = await request('/tutores', { method: 'POST', body: payload });
  const tutorId = data?.id;
  setUserMeta({ tutorId, isAdmin: !!data?.is_admin });
  return data;
}
export async function getTutorById(id) {
  return request(`/tutores/${id}`, { auth: true });
}
export async function updateTutor(id, payload) {
  return request(`/tutores/${id}`, { method: 'PATCH', body: payload, auth: true });
}

// Animais (público)
export async function listAnimals() { return request('/animais'); }
// Admin animais
export async function adminListAnimals() { return request('/admin/animais', { auth: true }); }
export async function adminCreateAnimal(payload) { return request('/animais', { method: 'POST', body: payload, auth: true }); }
export async function adminGetAnimal(id) { return request(`/animais/${id}`, { auth: true }); }
export async function adminUpdateAnimal(id, payload) { return request(`/admin/animais/${id}`, { method: 'PATCH', body: payload, auth: true }); }
export async function adminDeleteAnimal(id) { return request(`/admin/animais/${id}`, { method: 'DELETE', auth: true }); }

// Adoções
export async function createAdoption(animal_id) { return request('/adocoes', { method: 'POST', body: { animal_id }, auth: true }); }
export async function cancelAdoption(id) { return request(`/adocoes/${id}`, { method: 'DELETE', auth: true }); }

// Questionário
export async function submitQuestionnaire(payload) { return request('/questionario', { method: 'POST', body: payload, auth: true }); }

// Doações
export async function createDonation(payload) { return request('/doacoes', { method: 'POST', body: payload }); }

export function isLoggedIn() { return !!getToken(); }
export function isAdmin() { return localStorage.getItem('isAdmin') === '1'; }