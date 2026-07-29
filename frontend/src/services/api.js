// src/services/api.js

import { authService } from './authService'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

/**
 * Wrapper central de fetch para a API Django.
 *
 * - Monta a URL completa a partir de VITE_API_URL.
 * - Injeta `Authorization: Bearer <token>` quando o usuário estiver autenticado.
 * - Em resposta 401, limpa a sessão e redireciona para /login.
 *
 * @param {string} path    - Caminho relativo, ex: '/auth/login/'
 * @param {RequestInit} options - Opções nativas do fetch (method, body, headers…)
 * @returns {Promise<Response>}
 */
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`

  // Monta os headers base
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Injeta o token de autenticação quando disponível
  const token = authService.getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, { ...options, headers })

  // Sessão expirada ou token inválido — redireciona para login
  if (response.status === 401) {
    authService.logout()
    window.location.href = '/login'
    // Lança para interromper o fluxo do chamador
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  return response
}