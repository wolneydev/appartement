import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Filters from '../components/Filters';
import ApartmentCard from '../components/ApartmentCard';
import { mockApartments, filterApartments, sortApartments } from '../data/mockData';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    scorePriority: 50,
    minPrice: 2500,
    maxPrice: 8000,
    minArea: 40,
    minBedrooms: 0,
    nearby: []
  });
  const [sortBy, setSortBy] = useState('score');
  const [selectedApartments, setSelectedApartments] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const filteredAndSorted = useMemo(() => {
    const filtered = filterApartments(mockApartments, filters);
    return sortApartments(filtered, sortBy);
  }, [filters, sortBy]);

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
          <div className="apartments-grid">
            {filteredAndSorted.map(apartment => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onSelect={handleSelectApartment}
                isSelected={selectedApartments.includes(apartment.id)}
                showCompare={showCompare}
              />
            ))}
          </div>
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

