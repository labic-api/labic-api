import Card from '../ui/Card'
import Badge from '../ui/Badge'

/**
 * Tabela de pesquisadores recentes usada no Dashboard.
 * Recebe `data` (array vindo da API) e `loading` via props —
 * sem dados hardcoded.
 */
export default function ResearchTable({ data = [], loading = false, limit }) {
  const researchers = limit ? data.slice(0, limit) : data

  return (
    <Card title="Pesquisadores Recentes">
      {loading && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#555555' }}>Carregando pesquisadores...</p>
        </div>
      )}
      {!loading && researchers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#555555', margin: 0 }}>Nenhum pesquisador cadastrado.</p>
        </div>
      )}
      {!loading && researchers.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700', color: '#1F1F1F', fontFamily: 'Inter, sans-serif' }}>Nome</th>
              <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700', color: '#1F1F1F', fontFamily: 'Inter, sans-serif' }}>Área</th>
              <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700', color: '#1F1F1F', fontFamily: 'Inter, sans-serif' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {researchers.map((res) => (
              <tr key={res.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#1F1F1F' }}>{res.name}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555555' }}>{res.area || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge variant={res.status === 'Ativo' ? 'success' : 'warning'}>{res.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  )
}
