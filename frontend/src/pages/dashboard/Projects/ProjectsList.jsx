import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Alert from '../../../components/ui/Alert'
import { FiSearch, FiPlus, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { projectsService } from '../../../services/projectsService'

export default function ProjectsList() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await projectsService.getAll()
      setProjects(data)
    } catch (err) {
      setError('Erro ao carregar projetos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id) => {
    try {
      await projectsService.delete(id)
      loadProjects()
    } catch {
      setError('Erro ao excluir projeto.')
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '32px', fontWeight: '700', color: '#1F1F1F', margin: '0 0 8px 0' }}>
          Listagem de Projetos
        </h1>
        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px', color: '#555555', margin: 0 }}>
          Gerencie e visualize todos os projetos cadastrados e em desenvolvimento do LABIC.
        </p>
      </div>

      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <Input
            placeholder="Buscar projeto por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="primary" onClick={() => navigate('/dashboard/projetos/novo')}>
          <FiPlus size={16} style={{ marginRight: '8px' }} />
          Novo Projeto
        </Button>
      </div>

      {/* ERROR */}
      {error && (
        <div style={{ marginBottom: '16px' }}>
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px', color: '#555555' }}>Carregando projetos...</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && filteredProjects.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px', color: '#555555', margin: '0 0 16px 0' }}>
              {searchTerm ? 'Nenhum projeto encontrado para esta busca.' : 'Nenhum projeto cadastrado ainda.'}
            </p>
            {!searchTerm && (
              <Button variant="primary" onClick={() => navigate('/dashboard/projetos/novo')}>
                <FiPlus size={16} style={{ marginRight: '8px' }} />
                Criar Primeiro Projeto
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* TABLE */}
      {!loading && !error && filteredProjects.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <Card>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                  <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: '#1F1F1F', fontFamily: 'Inter, sans-serif' }}>Título</th>
                  <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: '#1F1F1F', fontFamily: 'Inter, sans-serif' }}>Início</th>
                  <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: '#1F1F1F', fontFamily: 'Inter, sans-serif' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '700', color: '#1F1F1F', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#1F1F1F' }}>{project.title}</td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#555555' }}>{project.startDate || '-'}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <Badge
                        variant={
                          project.status === 'Ativo' ? 'success'
                          : project.status === 'Em Execução' ? 'warning'
                          : project.status === 'Concluído' ? 'primary'
                          : 'info'
                        }
                      >
                        {project.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }} title="Visualizar">
                          <FiEye size={16} color="#4B5563" />
                        </button>
                        <button 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }} 
                          title="Editar"
                          onClick={() => navigate(`/dashboard/projetos/editar/${project.id}`)}
                        >
                          <FiEdit2 size={16} color="#2B5DFA" />
                        </button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }} title="Excluir" onClick={() => handleDelete(project.id)}>
                          <FiTrash2 size={16} color="#E57373" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  )
}
