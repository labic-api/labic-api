import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Alert from '../../../components/ui/Alert'
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { projectsService } from '../../../services/projectsService'

export default function ProjectCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    responsavel: '',
    area: '',
    data_inicio: '',
    status: 'Ativo',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const clone = { ...prev }
        delete clone[name]
        return clone
      })
    }
  }

  const validateForm = () => {
    const currentErrors = {}

    if (formData.titulo.trim().length < 6) {
      currentErrors.titulo = 'O título deve conter pelo menos 6 caracteres.'
    }
    if (formData.descricao.trim().length < 20) {
      currentErrors.descricao = 'A descrição deve conter pelo menos 20 caracteres.'
    }
    if (formData.responsavel.trim().length < 6) {
      currentErrors.responsavel = 'Informe o nome completo do responsável.'
    }
    if (formData.area.trim().length < 3) {
      currentErrors.area = 'Informe a área de pesquisa do projeto.'
    }

    setErrors(currentErrors)
    return Object.keys(currentErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setAlert(null)

    try {
      const projectData = {
        title: formData.titulo, // Mapeamento para o campo title do backend
        descricao: formData.descricao,
        responsavel: formData.responsavel,
        area: formData.area,
        startDate: formData.data_inicio,
        status: formData.status
      };

      await projectsService.create(projectData);
      
      setAlert({ type: 'success', message: 'Projeto cadastrado com sucesso!' })
      setTimeout(() => {
        setAlert(null)
        navigate('/dashboard/projetos')
      }, 2000)
    } catch (error) {
      console.error("Erro na requisição:", error);
      setAlert({ type: 'error', message: error.message || 'Erro ao comunicar com o servidor.' });
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
      <div style={{ width: '100%', maxWidth: '720px' }}>
        <Card title="Cadastro de Projeto">
          <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '15px', color: '#555555', margin: '0 0 24px 0' }}>
            Preencha os campos abaixo para cadastrar um novo projeto de pesquisa.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} noValidate>
            {/* Título */}
            <div>
              <Input
                label="Título do Projeto"
                name="titulo"
                placeholder="Ex: Deep Learning para Diagnóstico"
                value={formData.titulo}
                onChange={handleChange}
              />
              {errors.titulo && (
                <span style={{ color: '#E57373', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <FiAlertCircle size={14} /> {errors.titulo}
                </span>
              )}
            </div>

            {/* Descrição */}
            <div>
              <Input
                label="Descrição"
                name="descricao"
                type="textarea"
                placeholder="Descreva o projeto em detalhes..."
                value={formData.descricao}
                onChange={handleChange}
              />
              {errors.descricao && (
                <span style={{ color: '#E57373', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <FiAlertCircle size={14} /> {errors.descricao}
                </span>
              )}
            </div>

            {/* Linha dupla: Responsável e Área */}
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <Input
                  label="Responsável"
                  name="responsavel"
                  placeholder="Nome do responsável"
                  value={formData.responsavel}
                  onChange={handleChange}
                />
                {errors.responsavel && (
                  <span style={{ color: '#E57373', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <FiAlertCircle size={14} /> {errors.responsavel}
                  </span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <Input
                  label="Área de Pesquisa"
                  name="area"
                  placeholder="Ex: Inteligência Artificial"
                  value={formData.area}
                  onChange={handleChange}
                />
                {errors.area && (
                  <span style={{ color: '#E57373', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <FiAlertCircle size={14} /> {errors.area}
                  </span>
                )}
              </div>
            </div>

            {/* Status (select nativo) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '16px', fontWeight: '600', color: '#1F1F1F', fontFamily: 'Inter, sans-serif' }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{
                  height: '46px',
                  padding: '0 14px',
                  borderRadius: '5px',
                  border: '1px solid #E5E7EB',
                  fontSize: '15px',
                  fontFamily: 'Open Sans, sans-serif',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                }}
              >
                <option value="Ativo">Ativo</option>
                <option value="Em Execução">Em Execução</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>

            {/* Data de Início */}
            <div>
              <Input
                label="Data de Início"
                name="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={handleChange}
              />
            </div>

            {/* ALERT */}
            {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            )}

            {/* AÇÕES */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/projetos')}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                loading={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Projeto'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
