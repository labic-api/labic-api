// src/services/articlesService.js

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

export const articlesService = {
  /** GET /artigos/ — Lista todos os artigos */
  getAll: async () => {
    const response = await apiFetch('/artigos/')
    if (!response.ok) {
      throw await parseError(response, 'Erro ao buscar artigos.')
    }
    return response.json()
  },

  /**
   * POST /artigos/ — Cadastra um novo artigo.
   * Campos esperados: title, authors (opcional), status (opcional), relatedArea (opcional)
   */
  create: async (data) => {
    const response = await apiFetch('/artigos/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw await parseError(response, 'Erro ao cadastrar artigo.')
    }
    return response.json()
  },

  /** GET /artigos/{id}/ — Busca um artigo específico */
  getById: async (id) => {
    const response = await apiFetch(`/artigos/${id}/`)
    if (!response.ok) {
      throw await parseError(response, 'Erro ao buscar o artigo.')
    }
    return response.json()
  },

  /** PUT /artigos/{id}/ — Atualiza um artigo */
  update: async (id, data) => {
    const response = await apiFetch(`/artigos/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw await parseError(response, 'Erro ao atualizar artigo.')
    }
    return response.json()
  },

  /** DELETE /artigos/{id}/ — Remove um artigo pelo ID */
  delete: async (id) => {
    const response = await apiFetch(`/artigos/${id}/`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw await parseError(response, 'Erro ao remover artigo.')
    }
    return true
  },
}