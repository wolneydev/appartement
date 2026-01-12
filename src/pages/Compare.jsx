import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { mockApartments } from '../data/mockData';
import './Compare.css';

function Compare() {
  const location = useLocation();
  const navigate = useNavigate();
  const apartmentIds = location.state?.apartmentIds || [];
  const apartments = mockApartments.filter(apt => apartmentIds.includes(apt.id));

  if (apartments.length < 2) {
    return (
      <div className="compare">
        <Header />
        <div className="compare-container">
          <p>Selecione pelo menos 2 apartamentos para comparar</p>
          <button onClick={() => navigate('/')}>Voltar para Home</button>
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
    if (score >= 9) return 'Excelente';
    if (score >= 8) return 'Ótimo';
    if (score >= 7) return 'Muito Bom';
    return 'Bom';
  };

  const getHighlight = (apartment) => {
    if (!apartment.badges || apartment.badges.length === 0) return null;
    if (apartment.badges.includes('MELHOR PONTUAÇÃO')) return { text: 'MELHOR PONTUAÇÃO', icon: '✓', color: '#22c55e' };
    if (apartment.badges.includes('MAIS BARATO')) return { text: 'MAIS BARATO', icon: '🏷️', color: '#3b82f6' };
    if (apartment.badges.includes('MAIS COMPLETO')) return { text: 'MAIS COMPLETO', icon: '📄', color: '#f59e0b' };
    return null;
  };

  const hasMetro = (apartment) => {
    return apartment.transport && apartment.transport.length > 0;
  };

  const getBakeriesCount = (apartment) => {
    if (!apartment.bakeries) return '0';
    const count = apartment.bakeries.filter(b => !b.type.includes('Others')).length;
    const more = apartment.bakeries.find(b => b.type.includes('Others'));
    if (more) {
      const match = more.name.match(/(\d+)\+/);
      if (match) return `${count}+`;
    }
    return count.toString();
  };

  const getGymsCount = (apartment) => {
    return apartment.wellness ? apartment.wellness.length : 0;
  };

  return (
    <div className="compare">
      <Header />
      <div className="compare-container">
        <div className="compare-header">
          <div>
            <h1 className="compare-title">Comparativo de Apartamentos</h1>
            <p className="compare-subtitle">
              Compare métricas financeiras, pontuação de infraestrutura e proximidade com serviços essenciais.
            </p>
          </div>
          <div className="compare-actions">
            <button className="share-btn">
              <span>🔗</span> Compartilhar
            </button>
            <button className="new-property-btn" onClick={() => navigate('/')}>
              <span>+</span> Novo Imóvel
            </button>
          </div>
        </div>

        <div className="compare-table-container">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="attribute-col">ATRIBUTOS</th>
                {apartments.map(apt => (
                  <th key={apt.id} className="apartment-col">
                    <div className="apartment-header">
                      <div className="apartment-name">{apt.title}</div>
                      <div className="apartment-location">{apt.location}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="attribute-label">Destaque</td>
                {apartments.map(apt => {
                  const highlight = getHighlight(apt);
                  return (
                    <td key={apt.id}>
                      {highlight ? (
                        <span className="highlight-badge" style={{ backgroundColor: highlight.color }}>
                          <span>{highlight.icon}</span> {highlight.text}
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="attribute-label">Score de Localização</td>
                {apartments.map(apt => (
                  <td key={apt.id}>
                    <div className="score-display">
                      <div className="score-circle-small" style={{ borderColor: getScoreColor(apt.score) }}>
                        {apt.score}
                      </div>
                      <div className="score-label-small">{getScoreLabel(apt.score)}</div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="attribute-label">Valor Mensal (Total)</td>
                {apartments.map(apt => (
                  <td key={apt.id}>
                    <div className="price-display">
                      <div className="price-value">R$ {apt.price.toLocaleString('pt-BR')}</div>
                      <div className="price-note">Inclui Cond. + IPTU</div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="attribute-label">Tamanho</td>
                {apartments.map(apt => (
                  <td key={apt.id}>
                    <span className={apt.area >= 90 ? 'highlight-area' : ''}>{apt.area} m²</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="attribute-label">Dormitórios</td>
                {apartments.map(apt => (
                  <td key={apt.id}>
                    {apt.bedrooms} Quarto{apt.bedrooms > 1 ? 's' : ''}
                    {apt.bedrooms >= 3 && ` (${apt.bedrooms - 1} Suítes)`}
                  </td>
                ))}
              </tr>
              <tr className="sub-header">
                <td colSpan={apartments.length + 1} className="sub-header-cell">
                  Facilidades Próximas
                </td>
              </tr>
              <tr>
                <td className="attribute-label">Metrô/Trem (500m)</td>
                {apartments.map(apt => (
                  <td key={apt.id}>
                    {hasMetro(apt) ? (
                      <div className="metro-display">
                        <span className="metro-icon">🚇</span>
                        <span>{apt.transport.length} Estação{apt.transport.length > 1 ? 'ões' : ''}</span>
                      </div>
                    ) : (
                      <span className="no-metro">Nenhuma</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="attribute-label">Padarias & Cafés</td>
                {apartments.map(apt => {
                  const count = getBakeriesCount(apt);
                  return (
                    <td key={apt.id}>
                      <span className={`bakeries-badge ${parseInt(count) >= 5 ? 'many' : parseInt(count) >= 3 ? 'medium' : 'few'}`}>
                        {count}
                      </span>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="attribute-label">Academias</td>
                {apartments.map(apt => {
                  const gymsCount = getGymsCount(apt);
                  return (
                    <td key={apt.id}>
                      {gymsCount} {gymsCount === 1 ? 'Local' : 'Unidades'}
                      {gymsCount >= 2 && ` (${apt.wellness?.slice(0, 2).map(g => g.name.split(' ')[0]).join(', ')})`}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td></td>
                {apartments.map(apt => (
                  <td key={apt.id}>
                    <button 
                      className="view-details-btn"
                      onClick={() => navigate(`/apartment/${apt.id}`)}
                    >
                      Ver Detalhes
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="insights-section">
          <div className="insight-card market-insight">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h3 className="insight-title">Insight de Mercado</h3>
              <p className="insight-text">
                O {apartments[0]?.title || 'Apartamento'} está 12% abaixo da média do bairro por m². Ótima oportunidade de investimento.
              </p>
            </div>
          </div>
          <div className="insight-card mobility-insight">
            <div className="insight-icon">🚶</div>
            <div className="insight-content">
              <h3 className="insight-title">Mobilidade Urbana</h3>
              <p className="insight-text">
                O {apartments.find(apt => !hasMetro(apt))?.title || apartments[0]?.title || 'Apartamento'} tem o menor score de mobilidade, 
                mas oferece 2 vagas de garagem demarcadas.
              </p>
            </div>
          </div>
          <div className="insight-card convenience-insight">
            <div className="insight-icon">🏢</div>
            <div className="insight-content">
              <h3 className="insight-title">Comodidade</h3>
              <p className="insight-text">
                O {apartments.find(apt => apt.amenities?.nearby >= 30)?.title || apartments[0]?.title || 'Apartamento'} é classificado como 
                "Ultra-Conectado" devido aos 40+ serviços em 10min de caminhada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compare;

