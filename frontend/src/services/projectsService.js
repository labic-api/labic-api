// src/services/projectsService.js

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

export const projectsService = {
  /** GET /projetos/ — Lista todos os projetos */
  getAll: async () => {
    const response = await apiFetch('/projetos/')
    if (!response.ok) {
      throw await parseError(response, 'Erro ao buscar projetos.')
    }
    return response.json()
  },

  /**
   * POST /projetos/ — Cria um novo projeto.
   * Campos esperados: title, status (opcional), startDate (opcional), endDate (opcional)
   */
  create: async (data) => {
    const response = await apiFetch('/projetos/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw await parseError(response, 'Erro ao criar projeto.')
    }
    return response.json()
  },

  /** DELETE /projetos/{id}/ — Remove um projeto pelo ID */
  delete: async (id) => {
    const response = await apiFetch(`/projetos/${id}/`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw await parseError(response, 'Erro ao remover projeto.')
    }
    return true
  },
}