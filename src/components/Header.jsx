import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🏠</span>
          <span className="logo-text">Busca & Ranking</span>
        </Link>
        <nav className="nav">
          <Link to="/favorites" className="nav-link">Meus Favoritos</Link>
          <Link to="/history" className="nav-link">Histórico</Link>
          <div className="user-profile">
            <div className="profile-icon">👤</div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

