// src/services/authService.js

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const ACCESS_KEY  = 'labic_access_token'
const REFRESH_KEY = 'labic_refresh_token'

export const authService = {
  /**
   * Autentica o usuário na API.
   * POST {API_BASE_URL}/auth/login/ → { access, refresh }
   * Salva os tokens no localStorage em caso de sucesso.
   * Lança Error com mensagem amigável em caso de 400 / 401.
   */
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      // 400 (bad request) ou 401 (credenciais erradas)
      throw new Error('Credenciais inválidas. Verifique o email e a senha.')
    }

    const { access, refresh } = await response.json()

    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)

    return { access, refresh }
  },

  /**
   * Encerra a sessão limpando os tokens do localStorage.
   */
  logout: () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },

  /**
   * Retorna true se houver um access token salvo.
   */
  isAuthenticated: () => {
    return Boolean(localStorage.getItem(ACCESS_KEY))
  },

  /**
   * Retorna o access token atual ou null.
   */
  getToken: () => {
    return localStorage.getItem(ACCESS_KEY)
  },

  /**
   * Decodifica o payload do JWT e retorna os dados do usuário logado.
   * O SimpleJWT inclui os campos padrão; o nome é montado a partir de
   * first_name + last_name quando disponíveis, com fallback para username.
   * Retorna null se não houver token.
   */
  getCurrentUser: () => {
    const token = localStorage.getItem(ACCESS_KEY)
    if (!token) return null
    try {
      // O payload JWT é a segunda parte separada por '.'
      const payload = JSON.parse(atob(token.split('.')[1]))
      const name = [payload.first_name, payload.last_name]
        .filter(Boolean)
        .join(' ') || payload.username || payload.email || 'Usuário'
      return { name, email: payload.email ?? payload.username ?? '' }
    } catch {
      return null
    }
  },
}