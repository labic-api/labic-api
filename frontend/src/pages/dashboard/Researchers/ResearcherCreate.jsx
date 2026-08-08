import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import { researchersService } from '../../../services/researchersService'; // Importação do serviço

export default function ResearcherCreate() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    area: '',
    bio: '',
    link: ''
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado de travamento

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const clone = { ...prev };
        delete clone[name];
        return clone;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'O arquivo selecionado deve ser uma imagem válida.' }));
        setPhotoFile(null);
        setPhotoName('');
        return;
      }
      
      setPhotoFile(file);
      setPhotoName(file.name);
      
      if (errors.photo) {
        setErrors(prev => {
          const clone = { ...prev };
          delete clone['photo'];
          return clone;
        });
      }
    }
  };

  const validateForm = () => {
    const currentErrors = {};

    if (formData.name.trim().length < 6) {
      currentErrors.name = 'O nome completo deve conter pelo menos 6 caracteres.';
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      currentErrors.email = 'O e-mail inserido deve ser um endereço válido.';
    }
    if (formData.area.trim().length < 3) {
      currentErrors.area = 'Informe uma área de pesquisa válida.';
    }
    if (formData.bio.trim().length < 30) {
      currentErrors.bio = 'A biografia acadêmica deve ser mais descritiva (mínimo de 30 caracteres).';
    }
    if (!photoFile) {
      currentErrors.photo = 'É obrigatório selecionar uma foto de perfil para o pesquisador.';
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const researcherData = {
        ...formData,
        // Em uma API real, você enviaria photoFile via FormData
      };

      await researchersService.create(researcherData);
      navigate('/dashboard/pesquisadores');
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErrors(prev => ({ ...prev, submit: error.message || 'Erro ao comunicar com o servidor.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>Cadastro de Pesquisador</h1>
        <p style={styles.subtitle}>Preencha os campos abaixo para integrar nossa equipe de pesquisa.</p>
        
        <hr style={styles.divider} />

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          
          {/* Alerta de erro global */}
          {errors.submit && (
            <div style={styles.globalError}>
              <FiAlertCircle /> {errors.submit}
            </div>
          )}

          {/* Nome Completo */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome completo</label>
            <input
              type="text"
              name="name"
              placeholder="Seu nome completo"
              style={{ ...styles.input, borderColor: errors.name ? '#E57373' : '#E5E7EB' }}
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.name && <span style={styles.errorText}><FiAlertCircle /> {errors.name}</span>}
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Seu email"
              style={{ ...styles.input, borderColor: errors.email ? '#E57373' : '#E5E7EB' }}
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.email && <span style={styles.errorText}><FiAlertCircle /> {errors.email}</span>}
          </div>

          {/* Área de Pesquisa */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Área de pesquisa</label>
            <input
              type="text"
              name="area"
              placeholder="Ex: Inteligência Artificial"
              style={{ ...styles.input, borderColor: errors.area ? '#E57373' : '#E5E7EB' }}
              value={formData.area}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.area && <span style={styles.errorText}><FiAlertCircle /> {errors.area}</span>}
          </div>

          {/* Biografia */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Biografia</label>
            <textarea
              name="bio"
              placeholder="Sua breve biografia acadêmica e profissional"
              style={{ ...styles.textarea, borderColor: errors.bio ? '#E57373' : '#E5E7EB' }}
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              disabled={isSubmitting}
            />
            {errors.bio && <span style={styles.errorText}><FiAlertCircle /> {errors.bio}</span>}
          </div>

          {/* Foto (Upload) */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Foto</label>
            <div style={{ ...styles.fileContainer, borderColor: errors.photo ? '#E57373' : '#E5E7EB', backgroundColor: isSubmitting ? '#F9FAFB' : '#FFFFFF' }}>
              <input 
                type="file" 
                id="file-upload" 
                accept="image/*"
                style={styles.fileInput} 
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <label htmlFor="file-upload" style={{ ...styles.fileBtn, pointerEvents: isSubmitting ? 'none' : 'auto', color: isSubmitting ? '#9CA3AF' : '#1F1F1F' }}>
                Selecionar arquivo
              </label>
              <span style={{ ...styles.fileInstructions, color: photoName ? '#1F1F1F' : '#6B7280' }}>
                {photoName ? photoName : 'Nenhum arquivo selecionado'}
              </span>
            </div>
            {errors.photo && <span style={styles.errorText}><FiAlertCircle /> {errors.photo}</span>}
          </div>

          {/* Currículo/Link */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Currículo/link</label>
            <input
              type="url"
              name="link"
              placeholder="URL do Lattes ou link do currículo"
              style={styles.input}
              value={formData.link}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Ações */}
          <div style={styles.actions}>
            <button 
              type="button" 
              style={{ ...styles.cancelBtn, opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }} 
              onClick={() => navigate('/dashboard/pesquisadores')}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              style={{ ...styles.saveBtn, opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '20px 0', fontFamily: 'Open Sans, sans-serif' },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB', width: '100%', maxWidth: '720px' },
  title: { fontFamily: 'Inter, sans-serif', fontSize: '32px', fontWeight: '700', color: '#1F1F1F', textAlign: 'center', marginBottom: '8px' },
  subtitle: { fontSize: '16px', color: '#555555', textAlign: 'center', marginBottom: '24px' },
  divider: { border: '0', borderTop: '1px solid #E5E7EB', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '16px', fontWeight: '600', color: '#1F1F1F', fontFamily: 'Inter, sans-serif' },
  input: { height: '46px', padding: '0 14px', borderRadius: '5px', border: '1px solid #E5E7EB', fontSize: '15px', fontFamily: 'Open Sans, sans-serif', outline: 'none', transition: '0.2s ease' },
  textarea: { padding: '12px 14px', borderRadius: '5px', border: '1px solid #E5E7EB', fontSize: '15px', fontFamily: 'Open Sans, sans-serif', outline: 'none', resize: 'vertical' },
  fileContainer: { display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '5px', overflow: 'hidden', height: '46px', backgroundColor: '#FFFFFF' },
  fileInput: { display: 'none' },
  fileBtn: { display: 'flex', alignItems: 'center', height: '100%', padding: '0 16px', backgroundColor: '#F3F4F6', borderRight: '1px solid #E5E7EB', cursor: 'pointer', fontSize: '14px', color: '#1F1F1F', flexShrink: 0, transition: '0.2s ease' },
  fileInstructions: { fontSize: '14px', paddingLeft: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' },
  cancelBtn: { backgroundColor: '#FFFFFF', color: '#1F1F1F', border: '1px solid #E5E7EB', borderRadius: '5px', padding: '12px 24px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: '0.2s ease' },
  saveBtn: { backgroundColor: 'rgb(43, 93, 250)', color: '#FFFFFF', border: 'none', borderRadius: '5px', padding: '12px 24px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: '0.2s ease' },
  errorText: { color: '#E57373', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' },
  globalError: { backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '5px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }
};