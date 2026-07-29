import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import { authService } from '../../services/authService'

import './Login.css'

// Valida formato básico de e-mail
const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

function Login() {
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)

  // ── Validação dos campos ───────────────────────────────────────────────────
  const validate = () => {
    const next = {}

    if (!email.trim()) {
      next.email = 'O e-mail é obrigatório.'
    } else if (!isValidEmail(email)) {
      next.email = 'Informe um endereço de e-mail válido.'
    }

    if (!password) {
      next.password = 'A senha é obrigatória.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    if (!validate()) return

    setLoading(true)
    try {
      await authService.login(email.trim(), password)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.message || 'Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      {/* Logo */}
      <div className="login-page__logo-wrapper">
        <img
          src="/labicLogo.webp"
          alt="LABIC — Logotipo"
          className="login-page__logo"
        />
      </div>

      {/* Card */}
      <Card title="Acesso restrito" className="login-page__card">
        <form
          className="login-page__form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulário de login"
        >
          <p className="login-page__subtitle">
            Insira suas credenciais para acessar o painel administrativo.
          </p>

          {/* Alerta de erro da API */}
          <Alert
            type="error"
            message={apiError}
            onClose={() => setApiError('')}
          />

          {/* Campo e-mail */}
          <Input
            label="E-mail"
            name="email"
            type="email"
            placeholder="coordenacao@labic.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
            }}
            error={errors.email}
            required
            disabled={loading}
            autoComplete="email"
          />

          {/* Campo senha */}
          <Input
            label="Senha"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
            }}
            error={errors.password}
            required
            disabled={loading}
            autoComplete="current-password"
          />

          {/* Botão de submit */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="login-page__submit"
          >
            Entrar
          </Button>
        </form>
      </Card>
    </main>
  )
}

export default Login