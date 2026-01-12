import { useState } from 'react';
import './Filters.css';

function Filters({ filters, onFilterChange, onApplyFilters }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNearbyToggle = (item) => {
    setLocalFilters(prev => ({
      ...prev,
      nearby: prev.nearby.includes(item)
        ? prev.nearby.filter(n => n !== item)
        : [...prev.nearby, item]
    }));
  };

  const handleBedroomsToggle = (count) => {
    setLocalFilters(prev => ({
      ...prev,
      minBedrooms: prev.minBedrooms === count ? 0 : count
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApplyFilters();
  };

  return (
    <div className="filters">
      <h2 className="filters-title">Filtros</h2>
      
      <div className="filter-section">
        <label className="filter-label">PRIORIDADE DO SCORE</label>
        <div className="score-priority">
          <span>FOCO EM PREÇO</span>
          <input
            type="range"
            min="0"
            max="100"
            value={localFilters.scorePriority}
            onChange={(e) => handleChange('scorePriority', parseInt(e.target.value))}
            className="slider"
          />
          <span>FOCO EM COMODIDADES</span>
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Faixa de Preço</label>
        <div className="price-inputs">
          <div className="price-input">
            <span>Min</span>
            <input
              type="number"
              value={localFilters.minPrice}
              onChange={(e) => handleChange('minPrice', parseInt(e.target.value) || 0)}
              placeholder="R$ 2.500"
            />
          </div>
          <div className="price-input">
            <span>Max</span>
            <input
              type="number"
              value={localFilters.maxPrice}
              onChange={(e) => handleChange('maxPrice', parseInt(e.target.value) || 0)}
              placeholder="R$ 8.000"
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Área (m²)</label>
        <div className="area-slider">
          <span>40m²</span>
          <input
            type="range"
            min="40"
            max="500"
            value={localFilters.minArea}
            onChange={(e) => handleChange('minArea', parseInt(e.target.value))}
            className="slider"
          />
          <span>500m²+</span>
        </div>
        <div className="area-value">{localFilters.minArea}m²</div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Quartos</label>
        <div className="bedrooms-buttons">
          {[1, 2, 3, 4].map(count => (
            <button
              key={count}
              className={`bedroom-btn ${localFilters.minBedrooms === count ? 'active' : ''}`}
              onClick={() => handleBedroomsToggle(count)}
            >
              {count}+
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Próximo de</label>
        <div className="nearby-buttons">
          {['Padaria', 'Metrô', 'Academia', 'Mercado'].map(item => (
            <button
              key={item}
              className={`nearby-btn ${localFilters.nearby.includes(item) ? 'active' : ''}`}
              onClick={() => handleNearbyToggle(item)}
            >
              {item === 'Padaria' && '🍞'}
              {item === 'Metrô' && '🚇'}
              {item === 'Academia' && '💪'}
              {item === 'Mercado' && '🛒'}
              <span>{item}</span>
            </button>
          ))}
        </div>
      </div>

      <button className="apply-filters-btn" onClick={handleApply}>
        Aplicar Filtros
      </button>
    </div>
  );
}

export default Filters;

