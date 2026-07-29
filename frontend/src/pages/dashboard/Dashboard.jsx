import { useState, useEffect } from 'react'
import { FiUsers, FiBookOpen, FiClipboard, FiFileText } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import StatsCard from '../../components/dashboard/StatsCard'
import ProjectTable from '../../components/dashboard/ProjectTable'
import ResearchTable from '../../components/dashboard/ResearchTable'
import ArticleTable from '../../components/dashboard/ArticleTable'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import { projectsService } from '../../services/projectsService'
import { researchersService } from '../../services/researchersService'
import { articlesService } from '../../services/articlesService'

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [projects, setProjects] = useState([])
  const [researchers, setResearchers] = useState([])
  const [articles, setArticles] = useState([])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [proj, res, arts] = await Promise.all([
          projectsService.getAll(),
          researchersService.getAll(),
          articlesService.getAll(),
        ])
        setProjects(proj)
        setResearchers(res)
        setArticles(arts)
      } catch {
        setError('Erro ao carregar dados do dashboard.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: '32px', fontWeight: '700', color: '#1F1F1F', margin: '0 0 8px 0' }}>Dashboard</h1>
        <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '16px', color: '#555555', margin: 0 }}>
          Visão geral do LABIC — pesquisas, projetos e artigos
        </p>
      </div>

      {error && (
        <div style={{ marginBottom: '16px' }}>
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <StatsCard title="Pesquisadores" value={loading ? '...' : String(researchers.length)} variant="primary" icon={<FiUsers />} loading={loading} />
        <StatsCard title="Projetos Ativos" value={loading ? '...' : String(projects.filter(p => p.status === 'Ativo' || p.status === 'Em Execução').length)} variant="success" icon={<FiClipboard />} loading={loading} />
        <StatsCard title="Linhas de Pesquisa" value="4" variant="warning" icon={<FiBookOpen />} />
        <StatsCard title="Artigos Publicados" value={loading ? '...' : String(articles.length)} variant="error" icon={<FiFileText />} loading={loading} />
      </div>

      {!loading && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <ProjectTable data={projects} loading={loading} limit={3} />
            <ResearchTable data={researchers} loading={loading} limit={3} />
          </div>
          <ArticleTable data={articles} loading={loading} limit={3} />
        </>
      )}

      <div style={{ marginTop: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button variant="primary" onClick={() => navigate('/dashboard/projetos/novo')}>+ Novo Projeto</Button>
        <Button variant="primary" onClick={() => navigate('/dashboard/pesquisadores/novo')}>+ Novo Pesquisador</Button>
        <Button variant="primary" onClick={() => navigate('/dashboard/artigos/novo')}>+ Novo Artigo</Button>
      </div>
    </div>
  )
}
