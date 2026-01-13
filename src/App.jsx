import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ApartmentDetails from './pages/ApartmentDetails';
import Compare from './pages/Compare';
import PropertyRegistration from './pages/PropertyRegistration';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apartment/:id" element={<ApartmentDetails />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/property-registration" element={<PropertyRegistration />} />
        <Route path="/property-registration/:id" element={<PropertyRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;

