import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertiesAPI } from '../services/api';
import './PropertyRegistration.css';

// Função para converter tipo da API para o formato do formulário
const mapPropertyTypeFromAPI = (type) => {
  const typeMap = {
    'apartamento': 'Apartamento',
    'casa': 'Casa',
    'loft': 'Loft',
    'studio': 'Studio',
    'terreno': 'Terreno',
    'comercial': 'Comercial',
    'outro': 'Outro',
  };
  return typeMap[type] || 'Apartamento';
};

// Função para formatar preço para o formato brasileiro
const formatPrice = (price) => {
  if (!price) return '0,00';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function PropertyRegistration() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [currentStep, setCurrentStep] = useState(3);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'Apartamento',
    price: '0,00',
    isForRent: false,
    area: '',
    originalUrl: '',
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    pool: false,
    address: '',
    zipCode: '',
    latitude: null,
    longitude: null,
    photos: []
  });
  const [amenities, setAmenities] = useState([
    { id: 1, name: 'Padaria Delícia', distance: '120m', checked: true },
    { id: 2, name: 'Smart Fit - Unidade X', distance: '350m', checked: true },
    { id: 3, name: 'Parada Brigadeiro', distance: '50m', checked: true },
    { id: 4, name: 'Farmácia Popular', distance: 'Sugerido pelo sistema', checked: false }
  ]);

  // Carregar dados existentes se estiver editando
  useEffect(() => {
    if (isEditMode && id) {
      const loadPropertyData = async () => {
        setLoadingData(true);
        setError(null);
        try {
          const response = await propertiesAPI.getById(id);
          // A API pode retornar { success: true, data: {...} } ou diretamente o objeto
          const property = (response.success && response.data) ? response.data : (response.data || response);
          
          // Converter dados da API para o formato do formulário
          setFormData({
            title: property.title || '',
            propertyType: mapPropertyTypeFromAPI(property.property_type),
            price: formatPrice(property.price || property.sale_price), // Suporta ambos para compatibilidade
            isForRent: property.is_for_rent || false,
            area: property.usable_area ? String(property.usable_area) : '',
            originalUrl: property.original_url || '',
            bedrooms: property.bedrooms || 2,
            bathrooms: property.bathrooms || 1,
            parking: property.parking_spaces || 1,
            pool: property.has_pool || false,
            address: property.address || '',
            zipCode: property.zip_code || '',
            latitude: property.latitude || null,
            longitude: property.longitude || null,
            photos: property.cover_photo ? [{
              id: Date.now(),
              preview: property.cover_photo,
              isCover: true,
              file: null
            }] : []
          });
        } catch (err) {
          console.error('Erro ao carregar propriedade:', err);
          setError('Erro ao carregar dados do imóvel. ' + (err.message || ''));
        } finally {
          setLoadingData(false);
        }
      };

      loadPropertyData();
    }
  }, [id, isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCounterChange = (field, delta) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta)
    }));
  };

  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      preview: URL.createObjectURL(file),
      isCover: formData.photos.length === 0
    }));
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const newPhotos = imageFiles.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      preview: URL.createObjectURL(file),
      isCover: formData.photos.length === 0
    }));
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const setCoverPhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map(photo => ({
        ...photo,
        isCover: photo.id === photoId
      }))
    }));
  };

  const removePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const toggleAmenity = (id) => {
    setAmenities(prev =>
      prev.map(amenity =>
        amenity.id === id ? { ...amenity, checked: !amenity.checked } : amenity
      )
    );
  };

  const getCoverPhotoUrl = () => {
    const coverPhoto = formData.photos.find(photo => photo.isCover);
    if (coverPhoto && coverPhoto.file) {
      // Em produção, você precisaria fazer upload da imagem primeiro
      // Por enquanto, retornamos null ou uma URL temporária
      return coverPhoto.preview;
    }
    return null;
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validar preço
    if (!formData.price || formData.price === '0,00' || formData.price === '0.00') {
      setError('Por favor, informe um preço válido.');
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        status: 'rascunho',
        coverPhoto: getCoverPhotoUrl()
      };

      console.log('Dados sendo enviados (rascunho):', dataToSend); // Debug

      if (isEditMode) {
        await propertiesAPI.update(id, dataToSend);
        setSuccess('Rascunho atualizado com sucesso!');
      } else {
        await propertiesAPI.create(dataToSend);
        setSuccess('Rascunho salvo com sucesso!');
      }
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erro ao salvar rascunho. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validação básica
    if (!formData.title.trim()) {
      setError('Por favor, preencha o título do anúncio.');
      setLoading(false);
      return;
    }

    // Validar preço
    if (!formData.price || formData.price === '0,00' || formData.price === '0.00') {
      setError('Por favor, informe um preço válido.');
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        status: 'publicado',
        coverPhoto: getCoverPhotoUrl()
      };

      console.log('Dados sendo enviados (publicar):', dataToSend); // Debug

      if (isEditMode) {
        await propertiesAPI.update(id, dataToSend);
        setSuccess('Imóvel atualizado e publicado com sucesso!');
      } else {
        await propertiesAPI.create(dataToSend);
        setSuccess('Imóvel publicado com sucesso!');
      }
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erro ao publicar imóvel. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / 5) * 100;

  return (
    <div className="property-registration">
      <header className="pr-header">
        <div className="pr-header-container">
          <div className="pr-logo">ImobiSaaS</div>
          <nav className="pr-nav">
            <a href="#" className="pr-nav-link">Dashboard</a>
            <a href="#" className="pr-nav-link">Imóveis</a>
            <a href="#" className="pr-nav-link">Leads</a>
            <a href="#" className="pr-nav-link">Relatórios</a>
            <a href="#" className="pr-nav-link active">Meu Perfil</a>
            <div className="pr-user-avatar">👤</div>
          </nav>
        </div>
      </header>

      <div className="pr-container">
        {loadingData ? (
          <div className="pr-loading-container">
            <p>Carregando dados do imóvel...</p>
          </div>
        ) : (
        <>
        <div className="pr-main-content">
          <div className="pr-left-column">
            <div className="pr-title-section">
              <h1 className="pr-title">
                {isEditMode ? 'Editar Imóvel' : 'Cadastro de Novo Imóvel'}
              </h1>
              <p className="pr-subtitle">
                {isEditMode 
                  ? 'Edite as informações do imóvel e atualize a pontuação de conveniência.'
                  : 'Anuncie seu imóvel e veja a pontuação de conveniência gerada automaticamente.'}
              </p>
            </div>

            <div className="pr-progress-section">
              <div className="pr-progress-header">
                <span className="pr-step-info">Passo {currentStep} de 5: Galeria & Localização</span>
                <span className="pr-progress-percent">{Math.round(progress)}% Concluído</span>
              </div>
              <div className="pr-progress-bar">
                <div className="pr-progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="pr-form-section">
              <h2 className="pr-section-title">Informações Básicas</h2>
              <div className="pr-form-grid">
                <div className="pr-form-group">
                  <label className="pr-label">Título do Anúncio</label>
                  <input
                    type="text"
                    className="pr-input"
                    placeholder="Ex: Loft Moderno na Vila Madalena"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div className="pr-form-group">
                  <label className="pr-label">Tipo de Imóvel</label>
                  <select
                    className="pr-select"
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  >
                    <option>Apartamento</option>
                    <option>Casa</option>
                    <option>Loft</option>
                    <option>Studio</option>
                    <option>Terreno</option>
                    <option>Comercial</option>
                    <option>Outro</option>
                  </select>
                </div>

                <div className="pr-form-group">
                  <label className="pr-label">Preço (R$)</label>
                  <input
                    type="text"
                    className="pr-input"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Ex: 500.000,00"
                  />
                </div>

                <div className="pr-form-group">
                  <label className="pr-label">Tipo de Transação</label>
                  <div className="pr-transaction-type">
                    <label className="pr-radio-label">
                      <input
                        type="radio"
                        name="transactionType"
                        checked={!formData.isForRent}
                        onChange={() => handleInputChange('isForRent', false)}
                      />
                      <span>Venda</span>
                    </label>
                    <label className="pr-radio-label">
                      <input
                        type="radio"
                        name="transactionType"
                        checked={formData.isForRent}
                        onChange={() => handleInputChange('isForRent', true)}
                      />
                      <span>Aluguel</span>
                    </label>
                  </div>
                </div>

                <div className="pr-form-group">
                  <label className="pr-label">Área Útil (m²)</label>
                  <input
                    type="text"
                    className="pr-input"
                    placeholder="Ex: 85"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                  />
                </div>

                <div className="pr-form-group pr-form-group-full">
                  <label className="pr-label">
                    Link do Anúncio Original (URL)
                    <span className="pr-optional">OPCIONAL</span>
                  </label>
                  <input
                    type="url"
                    className="pr-input"
                    placeholder="https://www.siteoriginal.com.br/anuncio-do-imovel"
                    value={formData.originalUrl}
                    onChange={(e) => handleInputChange('originalUrl', e.target.value)}
                  />
                  <p className="pr-helper-text">
                    Utilize este campo para importar dados automaticamente ou manter uma referência externa.
                  </p>
                </div>
              </div>
            </div>

            <div className="pr-form-section">
              <h2 className="pr-section-title">Características</h2>
              <div className="pr-characteristics-grid">
                <div className="pr-characteristic">
                  <label className="pr-characteristic-label">QUARTOS</label>
                  <div className="pr-counter">
                    <button
                      className="pr-counter-btn"
                      onClick={() => handleCounterChange('bedrooms', -1)}
                    >
                      −
                    </button>
                    <span className="pr-counter-value">{formData.bedrooms}</span>
                    <button
                      className="pr-counter-btn"
                      onClick={() => handleCounterChange('bedrooms', 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pr-characteristic">
                  <label className="pr-characteristic-label">BANHEIROS</label>
                  <div className="pr-counter">
                    <button
                      className="pr-counter-btn"
                      onClick={() => handleCounterChange('bathrooms', -1)}
                    >
                      −
                    </button>
                    <span className="pr-counter-value">{formData.bathrooms}</span>
                    <button
                      className="pr-counter-btn"
                      onClick={() => handleCounterChange('bathrooms', 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pr-characteristic">
                  <label className="pr-characteristic-label">VAGAS</label>
                  <div className="pr-counter">
                    <button
                      className="pr-counter-btn"
                      onClick={() => handleCounterChange('parking', -1)}
                    >
                      −
                    </button>
                    <span className="pr-counter-value">{formData.parking}</span>
                    <button
                      className="pr-counter-btn"
                      onClick={() => handleCounterChange('parking', 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pr-characteristic">
                  <label className="pr-characteristic-label">PISCINA</label>
                  <div
                    className={`pr-toggle ${formData.pool ? 'active' : ''}`}
                    onClick={() => handleToggle('pool')}
                  >
                    <div className="pr-toggle-slider"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pr-form-section">
              <h2 className="pr-section-title">Localização</h2>
              <div className="pr-location-search">
                <input
                  type="text"
                  className="pr-search-input"
                  placeholder="Digite o endereço completo ou CEP"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
                <span className="pr-search-icon">🔍</span>
              </div>
              <div className="pr-form-grid" style={{ marginTop: '1rem' }}>
                <div className="pr-form-group">
                  <label className="pr-label">CEP</label>
                  <input
                    type="text"
                    className="pr-input"
                    placeholder="Ex: 01310-100"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  />
                </div>
                <div className="pr-form-group">
                  <label className="pr-label">Latitude (opcional)</label>
                  <input
                    type="number"
                    step="any"
                    className="pr-input"
                    placeholder="Ex: -23.5505"
                    value={formData.latitude || ''}
                    onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
                <div className="pr-form-group">
                  <label className="pr-label">Longitude (opcional)</label>
                  <input
                    type="number"
                    step="any"
                    className="pr-input"
                    placeholder="Ex: -46.6333"
                    value={formData.longitude || ''}
                    onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
              </div>
              <div className="pr-map-container">
                <div className="pr-map-placeholder">
                  <p>Mapa de São Paulo</p>
                  <p className="pr-map-note">Vila Madalena, Pinheiros, Itaim Bibi, Perdizes, Brás, Tatuapé</p>
                </div>
              </div>
            </div>

            <div className="pr-form-section">
              <h2 className="pr-section-title">Galeria de Fotos</h2>
              <div
                className="pr-upload-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="photo-upload"
                  className="pr-file-input"
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="photo-upload" className="pr-upload-label">
                  <span className="pr-upload-icon">☁️</span>
                  <span className="pr-upload-text">
                    Arraste e solte suas fotos aqui ou clique para selecionar arquivos (JPG, PNG)
                  </span>
                </label>
              </div>
              {formData.photos.length > 0 && (
                <div className="pr-photos-grid">
                  {formData.photos.map((photo) => (
                    <div key={photo.id} className="pr-photo-item">
                      <img src={photo.preview} alt="Preview" className="pr-photo-preview" />
                      {photo.isCover && <span className="pr-photo-cover-badge">CAPA</span>}
                      <div className="pr-photo-actions">
                        {!photo.isCover && (
                          <button
                            className="pr-photo-action-btn"
                            onClick={() => setCoverPhoto(photo.id)}
                          >
                            Definir como capa
                          </button>
                        )}
                        <button
                          className="pr-photo-action-btn delete"
                          onClick={() => removePhoto(photo.id)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                  {formData.photos.length < 10 && (
                    <label htmlFor="photo-upload" className="pr-photo-add">
                      <span className="pr-photo-add-icon">+</span>
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pr-right-column">
            {error && (
              <div className="pr-alert pr-alert-error">
                {error}
              </div>
            )}
            {success && (
              <div className="pr-alert pr-alert-success">
                {success}
              </div>
            )}
            <div className="pr-action-buttons">
              <button 
                className="pr-btn-secondary" 
                onClick={handleSaveDraft}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Rascunho'}
              </button>
              <button 
                className="pr-btn-primary" 
                onClick={handlePublish}
                disabled={loading}
              >
                {loading ? 'Publicando...' : 'Publicar Imóvel'}
              </button>
            </div>

            <div className="pr-score-section">
              <div className="pr-score-header">
                <span className="pr-score-icon">✓</span>
                <h3 className="pr-score-title">Score de Conveniência</h3>
              </div>
              <p className="pr-score-subtitle">Calculado baseado na localização atual</p>
              <div className="pr-score-value">8.4/10</div>
            </div>

            <div className="pr-amenities-section">
              <h3 className="pr-amenities-title">ITENS DETECTADOS PELO SISTEMA</h3>
              <p className="pr-amenities-description">
                Confirme as comodidades em um raio de 500m para validar sua pontuação.
              </p>
              <div className="pr-amenities-list">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="pr-amenity-item">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity.id}`}
                      checked={amenity.checked}
                      onChange={() => toggleAmenity(amenity.id)}
                      className="pr-amenity-checkbox"
                    />
                    <label htmlFor={`amenity-${amenity.id}`} className="pr-amenity-label">
                      <span className="pr-amenity-name">{amenity.name}</span>
                      <span className="pr-amenity-distance">{amenity.distance}</span>
                    </label>
                  </div>
                ))}
              </div>
              <button className="pr-add-manual-btn">
                <span>+</span> Adicionar item manualmente
              </button>
            </div>

            <div className="pr-visibility-section">
              <div className="pr-visibility-header">
                <span className="pr-visibility-icon">✓</span>
                <h3 className="pr-visibility-title">VISIBILIDADE</h3>
              </div>
              <p className="pr-visibility-text">
                Imóveis com score acima de 8.0 recebem o selo "Prime Location" e têm 3x mais destaque nas buscas.
              </p>
            </div>
          </div>
        </div>

        <div className="pr-footer-actions">
          <button className="pr-back-btn" onClick={() => navigate(-1)}>
            ← Voltar
          </button>
          <button className="pr-continue-btn">Continuar para Resumo</button>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

export default PropertyRegistration;

