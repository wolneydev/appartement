import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertiesAPI, nearbyItemsAPI } from '../services/api';
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
  const [manualItems, setManualItems] = useState([]);
  const [availableNearbyItems, setAvailableNearbyItems] = useState([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [loadingNearbyItems, setLoadingNearbyItems] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState(id || null);
  const [newItemForm, setNewItemForm] = useState({
    nearby_item_id: '',
    distance_meters: '',
    walking_time_minutes: '',
    driving_time_minutes: ''
  });

  // Carregar lista de nearby items disponíveis
  useEffect(() => {
    const loadNearbyItems = async () => {
      setLoadingNearbyItems(true);
      try {
        const response = await nearbyItemsAPI.getAll();
        const items = (response.success && response.data) ? response.data : (response.data || []);
        setAvailableNearbyItems(items);
      } catch (err) {
        console.error('Erro ao carregar nearby items:', err);
        setError('Erro ao carregar lista de itens. ' + (err.message || ''));
      } finally {
        setLoadingNearbyItems(false);
      }
    };

    loadNearbyItems();
  }, []);

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
          setCurrentPropertyId(id);
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

  // Carregar itens próximos quando a propriedade e os itens disponíveis estiverem carregados
  useEffect(() => {
    if (isEditMode && currentPropertyId && availableNearbyItems.length > 0) {
      const loadPropertyNearbyItems = async () => {
        try {
          const nearbyItemsResponse = await nearbyItemsAPI.getByPropertyId(currentPropertyId);
          const nearbyItems = (nearbyItemsResponse.success && nearbyItemsResponse.data) 
            ? nearbyItemsResponse.data 
            : (nearbyItemsResponse.data || []);
          
          // Mapear os itens para o formato esperado
          const mappedItems = nearbyItems.map(item => {
            // Buscar o nome do item na lista de itens disponíveis
            const availableItem = availableNearbyItems.find(ai => ai.id === item.nearby_item_id);
            return {
              id: item.id,
              nearby_item_id: item.nearby_item_id,
              name: availableItem?.name || 'Item',
              name_en: availableItem?.name_en || null,
              name_item: item.name_item || null,
              distance_meters: item.distance_meters || null,
              walking_time_minutes: item.walking_time_minutes || null,
              driving_time_minutes: item.driving_time_minutes || null,
              saved: true
            };
          });
          
          setManualItems(mappedItems);
        } catch (nearbyErr) {
          console.error('Erro ao carregar itens próximos:', nearbyErr);
          // Não mostrar erro aqui, apenas logar, pois não é crítico
        }
      };

      loadPropertyNearbyItems();
    }
  }, [isEditMode, currentPropertyId, availableNearbyItems]);

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

  const handleAddItem = () => {
    setShowAddItemModal(true);
    setNewItemForm({
      nearby_item_id: '',
      name_item: '',
      distance_meters: '',
      walking_time_minutes: '',
      driving_time_minutes: ''
    });
  };

  const handleCloseModal = () => {
    setShowAddItemModal(false);
    setNewItemForm({
      nearby_item_id: '',
      name_item: '',
      distance_meters: '',
      walking_time_minutes: '',
      driving_time_minutes: ''
    });
  };

  const handleNewItemInputChange = (field, value) => {
    setNewItemForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveNewItem = async () => {
    if (!newItemForm.nearby_item_id) {
      setError('Por favor, selecione um item.');
      return;
    }

    const selectedItem = availableNearbyItems.find(item => item.id === parseInt(newItemForm.nearby_item_id));
    if (!selectedItem) {
      setError('Item selecionado não encontrado.');
      return;
    }

    // Se já temos property_id, salvar imediatamente
    if (currentPropertyId) {
      setLoading(true);
      setError(null);

      try {
        const itemData = {
          property_id: parseInt(currentPropertyId),
          nearby_item_id: parseInt(newItemForm.nearby_item_id),
          ...(newItemForm.name_item && { name_item: newItemForm.name_item }),
          ...(newItemForm.distance_meters && { distance_meters: parseInt(newItemForm.distance_meters) }),
          ...(newItemForm.walking_time_minutes && { walking_time_minutes: parseInt(newItemForm.walking_time_minutes) }),
          ...(newItemForm.driving_time_minutes && { driving_time_minutes: parseInt(newItemForm.driving_time_minutes) })
        };

        const response = await nearbyItemsAPI.create(itemData);
        
        const newItem = {
          id: response.data?.id || Date.now(),
          nearby_item_id: selectedItem.id,
          name: selectedItem.name,
          name_en: selectedItem.name_en,
          name_item: newItemForm.name_item || null,
          distance_meters: newItemForm.distance_meters ? parseInt(newItemForm.distance_meters) : null,
          walking_time_minutes: newItemForm.walking_time_minutes ? parseInt(newItemForm.walking_time_minutes) : null,
          driving_time_minutes: newItemForm.driving_time_minutes ? parseInt(newItemForm.driving_time_minutes) : null,
          saved: true
        };
        setManualItems(prev => [...prev, newItem]);

        handleCloseModal();
        setSuccess('Item adicionado com sucesso!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.message || 'Erro ao adicionar item. Tente novamente.');
      } finally {
        setLoading(false);
      }
    } else {
      // Se não temos property_id ainda, adicionar localmente e salvar depois
      const newItem = {
        id: Date.now(), // ID temporário
        nearby_item_id: parseInt(newItemForm.nearby_item_id),
        name: selectedItem.name,
        name_en: selectedItem.name_en,
        name_item: newItemForm.name_item || null,
        distance_meters: newItemForm.distance_meters ? parseInt(newItemForm.distance_meters) : null,
        walking_time_minutes: newItemForm.walking_time_minutes ? parseInt(newItemForm.walking_time_minutes) : null,
        driving_time_minutes: newItemForm.driving_time_minutes ? parseInt(newItemForm.driving_time_minutes) : null,
        isPending: true
      };
      setManualItems(prev => [...prev, newItem]);

      handleCloseModal();
      setSuccess('Item adicionado! Será salvo quando você salvar o imóvel.');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleRemoveItem = (itemId) => {
    setManualItems(prev => prev.filter(item => item.id !== itemId));
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

  const saveNearbyItems = async (propertyId) => {
    if (manualItems.length === 0) return;

    const pendingItems = manualItems.filter(item => item.isPending || !item.saved);
    if (pendingItems.length === 0) return;

    for (const item of pendingItems) {
      try {
        const itemData = {
          property_id: parseInt(propertyId),
          nearby_item_id: item.nearby_item_id,
          ...(item.name_item && { name_item: item.name_item }),
          ...(item.distance_meters && { distance_meters: item.distance_meters }),
          ...(item.walking_time_minutes && { walking_time_minutes: item.walking_time_minutes }),
          ...(item.driving_time_minutes && { driving_time_minutes: item.driving_time_minutes })
        };

        await nearbyItemsAPI.create(itemData);
        
        // Marcar como salvo
        setManualItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, isPending: false, saved: true } : i
        ));
      } catch (err) {
        console.error('Erro ao salvar item próximo:', err);
        // Continuar salvando os outros itens mesmo se um falhar
      }
    }
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

      let savedPropertyId = currentPropertyId;
      if (isEditMode) {
        await propertiesAPI.update(id, dataToSend);
        savedPropertyId = id;
        setSuccess('Rascunho atualizado com sucesso!');
      } else {
        const response = await propertiesAPI.create(dataToSend);
        // Extrair o ID do imóvel criado
        const createdProperty = (response.success && response.data) ? response.data : (response.data || response);
        savedPropertyId = createdProperty.id || createdProperty.property_id;
        setCurrentPropertyId(savedPropertyId);
        setSuccess('Rascunho salvo com sucesso!');
      }

      // Salvar itens próximos se houver
      if (savedPropertyId && manualItems.length > 0) {
        await saveNearbyItems(savedPropertyId);
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

      let savedPropertyId = currentPropertyId;
      if (isEditMode) {
        await propertiesAPI.update(id, dataToSend);
        savedPropertyId = id;
        setSuccess('Imóvel atualizado e publicado com sucesso!');
      } else {
        const response = await propertiesAPI.create(dataToSend);
        // Extrair o ID do imóvel criado
        const createdProperty = (response.success && response.data) ? response.data : (response.data || response);
        savedPropertyId = createdProperty.id || createdProperty.property_id;
        setCurrentPropertyId(savedPropertyId);
        setSuccess('Imóvel publicado com sucesso!');
      }

      // Salvar itens próximos se houver
      if (savedPropertyId && manualItems.length > 0) {
        await saveNearbyItems(savedPropertyId);
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
              <h3 className="pr-amenities-title">ITENS PRÓXIMOS</h3>
              <p className="pr-amenities-description">
                Adicione itens próximos ao imóvel para melhorar a pontuação de conveniência.
              </p>
              {manualItems.length > 0 ? (
                <div className="pr-amenities-list">
                  {manualItems.map((item) => (
                    <div key={item.id} className="pr-amenity-item">
                      <div className="pr-amenity-label">
                        <span className="pr-amenity-name">
                          {item.name}
                          {item.name_item && ` - ${item.name_item}`}
                        </span>
                        <div className="pr-amenity-details">
                          {item.distance_meters && (
                            <span className="pr-amenity-distance">Distância: {item.distance_meters}m</span>
                          )}
                          {item.walking_time_minutes && (
                            <span className="pr-amenity-distance">A pé: {item.walking_time_minutes}min</span>
                          )}
                          {item.driving_time_minutes && (
                            <span className="pr-amenity-distance">De carro: {item.driving_time_minutes}min</span>
                          )}
                        </div>
                      </div>
                      <button
                        className="pr-remove-item-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remover item"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pr-empty-items">Nenhum item adicionado ainda.</p>
              )}
              <button className="pr-add-manual-btn" onClick={handleAddItem}>
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

      {/* Modal para adicionar item manualmente */}
      {showAddItemModal && (
        <div className="pr-modal-overlay">
          <div className="pr-modal-content">
            <div className="pr-modal-header">
              <h3 className="pr-modal-title">Adicionar Item Próximo</h3>
              <button className="pr-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="pr-modal-body">
              <div className="pr-form-group">
                <label className="pr-label">Item</label>
                <select
                  className="pr-select"
                  value={newItemForm.nearby_item_id}
                  onChange={(e) => handleNewItemInputChange('nearby_item_id', e.target.value)}
                  disabled={loadingNearbyItems}
                >
                  <option value="">Selecione um item</option>
                  {availableNearbyItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} {item.name_en && `(${item.name_en})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pr-form-group">
                <label className="pr-label">
                  Nome do Item
                  <span className="pr-optional">OPCIONAL</span>
                </label>
                <input
                  type="text"
                  className="pr-input"
                  placeholder="Ex: Padaria do João"
                  value={newItemForm.name_item}
                  onChange={(e) => handleNewItemInputChange('name_item', e.target.value)}
                />
              </div>

              <div className="pr-form-grid">
                <div className="pr-form-group">
                  <label className="pr-label">
                    Distância (metros)
                    <span className="pr-optional">OPCIONAL</span>
                  </label>
                  <input
                    type="number"
                    className="pr-input"
                    placeholder="Ex: 500"
                    value={newItemForm.distance_meters}
                    onChange={(e) => handleNewItemInputChange('distance_meters', e.target.value)}
                    min="0"
                  />
                </div>

                <div className="pr-form-group">
                  <label className="pr-label">
                    Tempo a pé (minutos)
                    <span className="pr-optional">OPCIONAL</span>
                  </label>
                  <input
                    type="number"
                    className="pr-input"
                    placeholder="Ex: 6"
                    value={newItemForm.walking_time_minutes}
                    onChange={(e) => handleNewItemInputChange('walking_time_minutes', e.target.value)}
                    min="0"
                  />
                </div>

                <div className="pr-form-group">
                  <label className="pr-label">
                    Tempo de carro (minutos)
                    <span className="pr-optional">OPCIONAL</span>
                  </label>
                  <input
                    type="number"
                    className="pr-input"
                    placeholder="Ex: 2"
                    value={newItemForm.driving_time_minutes}
                    onChange={(e) => handleNewItemInputChange('driving_time_minutes', e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>
            <div className="pr-modal-footer">
              <button className="pr-btn-secondary" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="pr-btn-primary" onClick={handleSaveNewItem} disabled={loading}>
                {loading ? 'Salvando...' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyRegistration;

