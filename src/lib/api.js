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
function getTutorId() {
  return localStorage.getItem('tutorId') || '';
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw { status: res.status, data };
  return data;
}

function asArray(resp) {
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.data)) return resp.data;
  return [];
}

// Auth
export async function login(email, senha) {
  const data = await request('/autenticacao', { method: 'POST', body: { email, senha } });
  const token = data.token || data.jwt || data.accessToken || data.access_token;
  if (token) setToken(token);
  const tutorId = data?.user?.id || data?.tutor?.id || data?.id || '';
  const isAdmin = data?.user?.is_admin ?? data?.tutor?.is_admin ?? data?.is_admin ?? false;
  setUserMeta({ tutorId, isAdmin: !!isAdmin });
  return data;
}
export function logout() { clearAuth(); }
export function isLoggedIn() { return !!getToken(); }
export function isAdmin() { return localStorage.getItem('isAdmin') === '1'; }

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
export async function listAnimals() {
  const resp = await request('/animais');
  return asArray(resp);
}

// Admin animais
export async function adminListAnimals() { 
  const resp = await request('/admin/animais', { auth: true }); 
  return asArray(resp);
}
export async function adminCreateAnimal(payload) { 
  return request('/animais', { method: 'POST', body: payload, auth: true }); 
}
export async function adminGetAnimal(id) { 
  return request(`/animais/${id}`, { auth: true }); 
}
export async function adminUpdateAnimal(id, payload) { 
  return request(`/admin/animais/${id}`, { method: 'PATCH', body: payload, auth: true }); 
}
export async function adminDeleteAnimal(id) { 
  return request(`/admin/animais/${id}`, { method: 'DELETE', auth: true }); 
}

// Adoções
export async function createAdoption(animal_id) {
  const tutor_id = getTutorId();
  return request('/adocoes', { method: 'POST', body: { tutor_id, animal_id }, auth: true });
}
export async function cancelAdoption(id) {
  return request(`/adocoes/${id}`, { method: 'DELETE', auth: true });
}

// Questionário
export async function submitQuestionnaire(payload) {
  const tutor_id = getTutorId();
  return request('/questionario', { method: 'POST', body: { tutor_id, ...payload }, auth: true });
}

// Doações
export async function createDonation(payload) { 
  return request('/doacoes', { method: 'POST', body: payload }); 
}