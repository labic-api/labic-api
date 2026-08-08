// src/services/researchersService.js

import { apiFetch } from './api'

/**
 * Extrai a mensagem de erro do corpo da resposta da API ou usa um fallback.
 * O DRF normalmente retorna { detail: "..." } ou { campo: ["erro"] }.
 */
async function parseError(response, fallback) {
  try {
    const body = await response.json()
    const message =
      body?.detail ||
      Object.values(body).flat().join(' ') ||
      fallback
    return new Error(message)
  } catch {
    return new Error(fallback)
  }
}

export const researchersService = {
  /** GET /pesquisadores/ — Lista todos os pesquisadores */
  getAll: async () => {
    const response = await apiFetch('/pesquisadores/')
    if (!response.ok) {
      throw await parseError(response, 'Erro ao buscar pesquisadores.')
    }
    return response.json()
  },

  /**
   * POST /pesquisadores/ — Cadastra um novo pesquisador.
   * Campos esperados: name, email, area, link, bio, password (opcional), nivel_acesso (opcional)
   */
  create: async (data) => {
    const response = await apiFetch('/pesquisadores/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw await parseError(response, 'Erro ao cadastrar pesquisador.')
    }
    return response.json()
  },

  /** GET /pesquisadores/{id}/ — Busca um pesquisador específico */
  getById: async (id) => {
    const response = await apiFetch(`/pesquisadores/${id}/`)
    if (!response.ok) {
      throw await parseError(response, 'Erro ao buscar o pesquisador.')
    }
    return response.json()
  },

  /** PUT /pesquisadores/{id}/ — Atualiza um pesquisador */
  update: async (id, data) => {
    const response = await apiFetch(`/pesquisadores/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw await parseError(response, 'Erro ao atualizar pesquisador.')
    }
    return response.json()
  },

  /** DELETE /pesquisadores/{id}/ — Remove um pesquisador pelo ID */
  delete: async (id) => {
    const response = await apiFetch(`/pesquisadores/${id}/`, {
      method: 'DELETE',
    })
    // 204 No Content é sucesso sem corpo
    if (!response.ok) {
      throw await parseError(response, 'Erro ao remover pesquisador.')
    }
    return true
  },
}