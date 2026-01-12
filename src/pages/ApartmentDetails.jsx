import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { mockApartments } from '../data/mockData';
import './ApartmentDetails.css';

function ApartmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apartment = mockApartments.find(apt => apt.id === parseInt(id));

  if (!apartment) {
    return (
      <div className="details">
        <Header />
        <div className="details-container">
          <p>Apartamento não encontrado</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 9) return '#22c55e';
    if (score >= 8) return '#3b82f6';
    if (score >= 7) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 9) return 'EXCELLENT';
    if (score >= 8) return 'VERY GOOD';
    if (score >= 7) return 'GOOD';
    return 'FAIR';
  };

  return (
    <div className="details">
      <Header />
      <div className="details-container">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} className="breadcrumb-link">Search Results</span>
          <span> › </span>
          <span>São Paulo</span>
          <span> › </span>
          <span>{apartment.location.split(',')[0]}</span>
        </div>

        <div className="details-header">
          <div>
            <h1 className="details-title">{apartment.title}</h1>
            <div className="details-address">
              <span className="location-icon">📍</span>
              {apartment.address}
            </div>
          </div>
          <div className="details-actions">
            <button className="share-btn">
              <span>🔗</span> Share
            </button>
            <button className="schedule-btn">Agendar Visita</button>
          </div>
        </div>

        <div className="details-gallery">
          <div className="main-image">
            <img src={apartment.image} alt={apartment.title} />
          </div>
          <div className="gallery-thumbnails">
            <div className="thumbnail">
              <img src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400" alt="Kitchen" />
            </div>
            <div className="thumbnail">
              <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400" alt="Bathroom" />
            </div>
            <div className="thumbnail">
              <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400" alt="Bedroom" />
            </div>
            <div className="thumbnail">
              <div className="more-photos">+12 Photos</div>
            </div>
          </div>
        </div>

        <div className="details-cards">
          <div className="detail-card">
            <div className="detail-card-label">Selling Price</div>
            <div className="detail-card-value">R$ {apartment.price.toLocaleString('pt-BR')}</div>
            <div className="detail-card-sub">IPTV: R$ {apartment.iptu}/yr</div>
          </div>
          <div className="detail-card">
            <div className="detail-card-icon">🏠</div>
            <div className="detail-card-value">{apartment.area} m²</div>
          </div>
          <div className="detail-card">
            <div className="detail-card-icon">🛏️</div>
            <div className="detail-card-value">{apartment.bedrooms}</div>
            <div className="detail-card-icon">🚿</div>
            <div className="detail-card-value">1</div>
          </div>
          <div className="detail-card">
            <div className="detail-card-label">Condominium</div>
            <div className="detail-card-value">R$ {apartment.condominium} /mo</div>
          </div>
        </div>

        <div className="score-analysis">
          <div className="score-circle">
            <div className="score-number" style={{ color: getScoreColor(apartment.score) }}>
              {apartment.score}
            </div>
            <div className="score-label">{getScoreLabel(apartment.score)}</div>
          </div>
          <div className="score-content">
            <h2 className="score-title">Imobi Score Analysis</h2>
            <p className="score-description">
              This property ranks in the top 5% of {apartment.location.split(',')[0]} based on connectivity and market pricing. 
              High score driven by exceptional proximity to Metro Fradique Coutinho.
            </p>
            <div className="score-bars">
              <div className="score-bar-item">
                <div className="score-bar-label">PRICE WEIGHT</div>
                <div className="score-bar">
                  <div 
                    className="score-bar-fill" 
                    style={{ width: `${apartment.priceWeight}%`, backgroundColor: getScoreColor(apartment.score) }}
                  ></div>
                  <span className="score-bar-value">{apartment.priceWeight}%</span>
                </div>
              </div>
              <div className="score-bar-item">
                <div className="score-bar-label">AMENITY WEIGHT</div>
                <div className="score-bar">
                  <div 
                    className="score-bar-fill" 
                    style={{ width: `${apartment.amenityWeight}%`, backgroundColor: getScoreColor(apartment.score) }}
                  ></div>
                  <span className="score-bar-value">{apartment.amenityWeight}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="amenities-section">
          <h2 className="amenities-title">
            <span className="amenities-icon">🏢</span>
            Nearby Amenities
          </h2>
          <div className="amenities-content">
            <div className="amenities-list">
              {apartment.transport && apartment.transport.length > 0 && (
                <div className="amenity-category">
                  <div className="category-header">
                    <span className="category-icon">🚌</span>
                    <span className="category-title">TRANSPORT</span>
                  </div>
                  {apartment.transport.map((item, index) => (
                    <div key={index} className="amenity-item">
                      <div className="amenity-name">{item.name} ({item.line})</div>
                      <div className="amenity-distance">{item.distance} ({item.walkTime})</div>
                    </div>
                  ))}
                </div>
              )}

              {apartment.bakeries && apartment.bakeries.length > 0 && (
                <div className="amenity-category">
                  <div className="category-header">
                    <span className="category-icon">🍞</span>
                    <span className="category-title">BAKERIES & FOOD</span>
                  </div>
                  {apartment.bakeries.map((item, index) => (
                    <div key={index} className="amenity-item">
                      <div className="amenity-name">{item.name} ({item.type})</div>
                      <div className="amenity-distance">{item.distance} ({item.walkTime})</div>
                    </div>
                  ))}
                </div>
              )}

              {apartment.wellness && apartment.wellness.length > 0 && (
                <div className="amenity-category">
                  <div className="category-header">
                    <span className="category-icon">🧘</span>
                    <span className="category-title">WELLNESS</span>
                  </div>
                  {apartment.wellness.map((item, index) => (
                    <div key={index} className="amenity-item">
                      <div className="amenity-name">{item.name} ({item.type})</div>
                      <div className="amenity-distance">{item.distance} ({item.walkTime})</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="amenities-map">
              <div className="map-placeholder">
                <span className="map-icon">📍</span>
                <div className="map-text">{apartment.location.split(',')[0]} Map View</div>
              </div>
            </div>
          </div>
        </div>

        <div className="details-sidebar">
          <div className="agent-card">
            <div className="agent-avatar">👤</div>
            <div className="agent-name">Marina Silva</div>
            <div className="agent-title">Prime Listing Agent</div>
            <div className="agent-form">
              <div className="form-field">
                <label>YOUR NAME</label>
                <input type="text" placeholder="Full name" />
              </div>
              <div className="form-field">
                <label>PHONE NUMBER</label>
                <input type="tel" placeholder="(11) 99999-9999" />
              </div>
              <button className="schedule-visit-btn">Agendar Visita</button>
              <button className="whatsapp-btn">WhatsApp Enquiry</button>
              <div className="verified-text">VERIFIED PROPERTY & AGENT</div>
            </div>
          </div>

          <div className="market-insight-card">
            <div className="insight-icon">📈</div>
            <h3 className="insight-title">Market Insight</h3>
            <p className="insight-text">
              Properties in this sector have appreciated by +12% in the last 12 months. 
              Demand for high-score studio apartments is currently high.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApartmentDetails;

