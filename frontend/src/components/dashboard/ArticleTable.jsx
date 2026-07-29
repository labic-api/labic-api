import Card from '../ui/Card'
import Badge from '../ui/Badge'

/**
 * Tabela de artigos recentes usada no Dashboard.
 * Recebe `data` (array vindo da API) e `loading` via props —
 * sem dados hardcoded.
 */
export default function ArticleTable({ data = [], loading = false, limit }) {
  const articles = limit ? data.slice(0, limit) : data

  return (
    <Card title="Artigos Recentes">
      {loading && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#555555' }}>Carregando artigos...</p>
        </div>
      )}
      {!loading && articles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '14px', color: '#555555', margin: 0 }}>Nenhum artigo cadastrado.</p>
        </div>
      )}
      {!loading && articles.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '400px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700', color: '#1F1F1F', fontFamily: 'Inter, sans-serif' }}>Título</th>
                <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700', color: '#1F1F1F', fontFamily: 'Inter, sans-serif' }}>Autor(es)</th>
                <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700', color: '#1F1F1F', fontFamily: 'Inter, sans-serif' }}>Data</th>
                <th style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700', color: '#1F1F1F', fontFamily: 'Inter, sans-serif' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((art) => (
                <tr key={art.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#1F1F1F' }}>{art.title}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555555' }}>{art.authors}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555555' }}>{art.date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge
                      variant={
                        art.status === 'Ativo'
                          ? 'success'
                          : art.status === 'Em Execução'
                          ? 'warning'
                          : 'primary'
                      }
                    >
                      {art.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
