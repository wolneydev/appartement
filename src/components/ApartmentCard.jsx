import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './ApartmentCard.css';

function ApartmentCard({ apartment, onSelect, isSelected, showCompare }) {
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/property-registration/${apartment.id}`);
  };

  return (
    <div className={`apartment-card ${isSelected ? 'selected' : ''}`}>
      <div className="card-image-container">
        <img src={apartment.image} alt={apartment.title} className="card-image" />
        {apartment.badges && apartment.badges.length > 0 && (
          <div className="card-badges">
            {apartment.badges.map((badge, index) => (
              <span key={index} className={`badge ${badge === 'MELHOR PREÇO' || badge === 'MELHOR PONTUAÇÃO' ? 'badge-green' : badge === 'DESTAQUE' ? 'badge-green' : 'badge-gray'}`}>
                {badge}
              </span>
            ))}
          </div>
        )}
        <div className="card-score">
          {apartment.score} SCORE TOTAL
        </div>
        <button 
          className="card-edit-btn"
          onClick={handleEdit}
          title="Editar imóvel"
        >
          ✏️
        </button>
        {showCompare && (
          <div className="card-checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(apartment.id)}
            />
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{apartment.title}</h3>
        <div className="card-price">R$ {apartment.price.toLocaleString('pt-BR')} /mês</div>
        <div className="card-details">
          <span>{apartment.area}m²</span>
          <span>{apartment.bedrooms} Quarto{apartment.bedrooms > 1 ? 's' : ''}</span>
          <span>{apartment.parking} Vaga{apartment.parking !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-amenities">
          <div className="amenities-label">COMODIDADES PRÓXIMAS</div>
          <div className="amenities-icons">
            {apartment.amenities.items.slice(0, 3).map((item, index) => (
              <span key={index} className="amenity-icon">📍</span>
            ))}
            <span className="amenities-count">+{apartment.amenities.nearby - 3} itens</span>
          </div>
        </div>
        <Link to={`/apartment/${apartment.id}`} className="card-button">
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}

export default ApartmentCard;

