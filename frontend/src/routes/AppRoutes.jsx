import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { authService } from '../services/authService'

// LAYOUTS
import PublicLayout from '../components/layout/PublicLayout'
import DashboardLayout from '../components/layout/DashboardLayout'

// PUBLIC
import Home from '../pages/public/Home'
import Sobre from '../pages/public/Sobre'
import Pesquisa from '../pages/public/Pesquisa'
import Contato from '../pages/public/Contato'

// AUTH
import Login from '../pages/auth/Login'

// DASHBOARD
import Dashboard from '../pages/dashboard/Dashboard'

// RESEARCHERS
import ResearchersList from '../pages/dashboard/Researchers/ResearchersList'
import ResearcherCreate from '../pages/dashboard/Researchers/ResearcherCreate'
import ResearcherEdit from '../pages/dashboard/Researchers/ResearcherEdit'

// PROJECTS
import ProjectsList from '../pages/dashboard/Projects/ProjectsList'
import ProjectCreate from '../pages/dashboard/Projects/ProjectCreate'
import ProjectEdit from '../pages/dashboard/Projects/ProjectEdit'

// ARTICLES
import ArticlesList from '../pages/dashboard/Articles/ArticlesList'
import ArticleCreate from '../pages/dashboard/Articles/ArticleCreate'
import ArticleEdit from '../pages/dashboard/Articles/ArticleEdit'

/**
 * Guarda de rota privada.
 * Redireciona para /login se o usuário não estiver autenticado.
 */
function PrivateRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/sobre" element={<PublicLayout><Sobre /></PublicLayout>} />
        <Route path="/pesquisa" element={<PublicLayout><Pesquisa /></PublicLayout>} />
        <Route path="/contato" element={<PublicLayout><Contato /></PublicLayout>} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* 🛡️ DASHBOARD — protegido por PrivateRoute */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="pesquisadores" element={<ResearchersList />} />
          <Route path="pesquisadores/novo" element={<ResearcherCreate />} />
          <Route path="pesquisadores/editar/:id" element={<ResearcherEdit />} />
          <Route path="projetos" element={<ProjectsList />} />
          <Route path="projetos/novo" element={<ProjectCreate />} />
          <Route path="projetos/editar/:id" element={<ProjectEdit />} />
          <Route path="artigos" element={<ArticlesList />} />
          <Route path="artigos/novo" element={<ArticleCreate />} />
          <Route path="artigos/editar/:id" element={<ArticleEdit />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes