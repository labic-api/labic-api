import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

export default function Topbar() {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  // Gera as iniciais do nome para o avatar (ex: "João Silva" → "JS")
  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')
    : '?'

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <header style={styles.topbar}>
      <div style={styles.profileContainer}>
        {/* Avatar com iniciais — sem foto fake */}
        <div style={styles.avatar}>
          <span style={styles.avatarInitials}>{initials}</span>
        </div>

        <span style={styles.username}>
          {user?.name ?? 'Usuário'}
        </span>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  )
}

const styles = {
  topbar: {
    height: '72px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 32px',
    width: '100%',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgb(43, 93, 250)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.5px',
  },
  username: {
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '16px',
    color: '#1F1F1F',
    fontWeight: '400',
  },
  logoutBtn: {
    fontFamily: 'Open Sans, sans-serif',
    border: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
    color: '#1F1F1F',
    padding: '6px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: '0.2s ease',
    fontWeight: '600',
  },
}