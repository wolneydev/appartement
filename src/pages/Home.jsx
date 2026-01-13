import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Filters from '../components/Filters';
import ApartmentCard from '../components/ApartmentCard';
import { mockApartments, filterApartments, sortApartments } from '../data/mockData';
import { propertiesAPI } from '../services/api';
import './Home.css';

// Função para converter dados da API para o formato esperado pelo componente
const convertApiDataToApartment = (apiProperty) => {
  console.log('Converting property:', apiProperty); // Debug
  
  // Converter preço de string para número
  let price = 0;
  const priceValue = apiProperty.price || apiProperty.sale_price; // Suporta ambos para compatibilidade
  if (priceValue) {
    if (typeof priceValue === 'string') {
      price = parseFloat(priceValue.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    } else {
      price = priceValue;
    }
  }
  
  // Converter área de string para número
  let area = 0;
  if (apiProperty.usable_area) {
    if (typeof apiProperty.usable_area === 'string') {
      area = parseFloat(apiProperty.usable_area.replace(',', '.')) || 0;
    } else {
      area = apiProperty.usable_area;
    }
  }
  
  // Extrair localização do endereço
  let location = 'São Paulo';
  if (apiProperty.address) {
    // Se o address for uma URL, tentar extrair algo útil
    if (apiProperty.address.startsWith('http')) {
      // Tentar extrair da URL se possível
      try {
        const url = new URL(apiProperty.address);
        const query = url.searchParams.get('q');
        if (query) {
          const match = query.match(/maps\s+(.+?)(?:,|$)/i);
          if (match) {
            location = match[1].trim();
          }
        }
      } catch (e) {
        location = 'São Paulo';
      }
    } else {
      const parts = apiProperty.address.split(',');
      location = parts[0] || 'São Paulo';
    }
  }
  
  const converted = {
    id: apiProperty.id,
    title: apiProperty.title || 'Sem título',
    location: location,
    price: price,
    area: Math.round(area),
    bedrooms: apiProperty.bedrooms || 0,
    parking: apiProperty.parking_spaces || 0,
    score: apiProperty.convenience_score ? parseFloat(apiProperty.convenience_score) : 8.4,
    badges: apiProperty.status === 'publicado' ? ['PUBLICADO'] : [],
    image: apiProperty.cover_photo || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    amenities: {
      nearby: 12,
      items: ['Padaria', 'Academia', 'Parque', 'Metrô', 'Mercado', 'Farmácia']
    },
    description: apiProperty.title || '',
    address: apiProperty.address || '',
    propertyType: apiProperty.property_type || 'apartamento'
  };
  
  console.log('Converted property:', converted); // Debug
  return converted;
};

function Home() {
  const navigate = useNavigate();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    scorePriority: 50,
    minPrice: 0,
    maxPrice: 10000000, // Aumentado para aceitar valores de venda
    minArea: 0,
    minBedrooms: 0,
    nearby: []
  });
  const [sortBy, setSortBy] = useState('score');
  const [selectedApartments, setSelectedApartments] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  // Buscar dados da API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await propertiesAPI.getAll();
        console.log('API Response:', response); // Debug
        
        // A API retorna: { success: true, data: { data: [...], ... } }
        let propertiesArray = [];
        
        if (response.success && response.data) {
          // Laravel pagination: response.data.data contém o array
          propertiesArray = response.data.data || [];
        } else if (Array.isArray(response)) {
          // Se retornar array diretamente
          propertiesArray = response;
        } else if (response.data && Array.isArray(response.data)) {
          // Se response.data for array
          propertiesArray = response.data;
        }
        
        console.log('Properties Array:', propertiesArray); // Debug
        
        if (propertiesArray.length > 0) {
          const convertedApartments = propertiesArray.map(convertApiDataToApartment);
          console.log('Converted Apartments:', convertedApartments); // Debug
          setApartments(convertedApartments);
        } else {
          console.warn('Nenhuma propriedade encontrada na API, usando dados mockados');
          setApartments(mockApartments);
        }
      } catch (err) {
        console.error('Erro ao buscar propriedades:', err);
        setError('Erro ao carregar imóveis. Usando dados mockados.');
        // Fallback para dados mockados em caso de erro
        setApartments(mockApartments);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredAndSorted = useMemo(() => {
    console.log('Apartments before filter:', apartments); // Debug
    console.log('Filters:', filters); // Debug
    const filtered = filterApartments(apartments, filters);
    console.log('Filtered apartments:', filtered); // Debug
    const sorted = sortApartments(filtered, sortBy);
    console.log('Sorted apartments:', sorted); // Debug
    return sorted;
  }, [apartments, filters, sortBy]);

  const handleSelectApartment = (id) => {
    setSelectedApartments(prev => {
      if (prev.includes(id)) {
        return prev.filter(aptId => aptId !== id);
      } else if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    if (selectedApartments.length >= 2) {
      navigate('/compare', { state: { apartmentIds: selectedApartments } });
    }
  };

  return (
    <div className="home">
      <Header />
      <div className="home-container">
        <div className="home-sidebar">
          <Filters
            filters={filters}
            onFilterChange={setFilters}
            onApplyFilters={() => {}}
          />
        </div>
        <div className="home-main">
          <div className="home-header">
            <div>
              <h1 className="home-title">Apartamentos em São Paulo</h1>
              <p className="home-subtitle">
                {filteredAndSorted.length} imóveis encontrados seguindo seus critérios
              </p>
            </div>
            <div className="home-actions">
              <button
                className="register-property-btn"
                onClick={() => navigate('/property-registration')}
              >
                + Cadastrar Imóvel
              </button>
              <button
                className={`compare-toggle-btn ${showCompare ? 'active' : ''}`}
                onClick={() => {
                  setShowCompare(!showCompare);
                  if (!showCompare) setSelectedApartments([]);
                }}
              >
                {showCompare ? 'Cancelar Seleção' : 'Comparar Apartamentos'}
              </button>
              {showCompare && selectedApartments.length >= 2 && (
                <button className="compare-btn" onClick={handleCompare}>
                  Comparar ({selectedApartments.length})
                </button>
              )}
            </div>
          </div>
          <div className="sort-section">
            <span className="sort-label">Ordenar por:</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="score">Melhor Score (Recomendado)</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="area-asc">Menor Área</option>
              <option value="area-desc">Maior Área</option>
            </select>
          </div>
          {loading ? (
            <div className="home-loading">
              <p>Carregando imóveis...</p>
            </div>
          ) : error ? (
            <div className="home-error">
              <p>{error}</p>
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="home-empty">
              <p>Nenhum imóvel encontrado com os filtros selecionados.</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Total de imóveis carregados: {apartments.length}
              </p>
              <button 
                onClick={() => setFilters({
                  scorePriority: 50,
                  minPrice: 0,
                  maxPrice: 10000000,
                  minArea: 0,
                  minBedrooms: 0,
                  nearby: []
                })}
                style={{ 
                  marginTop: '1rem', 
                  padding: '0.5rem 1rem', 
                  background: '#2563eb', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <>
              <div className="apartments-grid">
                {filteredAndSorted.map(apartment => {
                  console.log('Rendering apartment:', apartment); // Debug
                  return (
                    <ApartmentCard
                      key={apartment.id}
                      apartment={apartment}
                      onSelect={handleSelectApartment}
                      isSelected={selectedApartments.includes(apartment.id)}
                      showCompare={showCompare}
                    />
                  );
                })}
              </div>
              {filteredAndSorted.length > 0 && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', fontSize: '0.875rem', color: '#0369a1' }}>
                  Exibindo {filteredAndSorted.length} de {apartments.length} imóveis
                </div>
              )}
            </>
          )}
          <div className="pagination">
            <button className="page-btn">‹</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span className="page-dots">...</span>
            <button className="page-btn">12</button>
            <button className="page-btn">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

