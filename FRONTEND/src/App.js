import React, { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import './App.css';

function AppContent() {
  const { user, loading } = useContext(AuthContext);
  const [view, setView] = useState('home');
  const [cars, setCars] = useState([]);

  // Fetch cars on component mount
  React.useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();
      setCars(data);
    } catch (err) {
      console.error('Error fetching cars:', err);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  // Render pages based on view/auth state
  if (!user && view === 'login') {
    return <Login onSwitchToRegister={() => setView('register')} />;
  }

  if (!user && view === 'register') {
    return <Register onSwitchToLogin={() => setView('login')} />;
  }

  if (user && view === 'account') {
    return <Account />;
  }

  // Home page
  return (
    <div className="app">
      <header className="header">
        <h1>CarScout</h1>
        <p>Find Your Perfect Car</p>
        <nav className="navbar">
          <button onClick={() => setView('home')} className={view === 'home' ? 'active' : ''}>
            Home
          </button>
          {user ? (
            <>
              <span className="user-info">Welcome, {user.name}!</span>
              <button onClick={() => setView('account')} className={view === 'account' ? 'active' : ''}>
                My Account
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setView('login')} className={view === 'login' ? 'active' : ''}>
                Login
              </button>
              <button onClick={() => setView('register')} className={view === 'register' ? 'active' : ''}>
                Register
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="container">
        <h2>Available Cars</h2>
        {cars.length === 0 ? (
          <p>No cars available</p>
        ) : (
          <div className="cars-grid">
            {cars.map((car) => (
              <div key={car._id} className="car-card">
                <h3>{car.year} {car.make} {car.model}</h3>
                <p><strong>Price:</strong> ${car.price.toLocaleString()}</p>
                <p><strong>Mileage:</strong> {car.mileage.toLocaleString()} miles</p>
                {car.description && <p><strong>Description:</strong> {car.description}</p>}
                {car.photos && car.photos.length > 0 && (
                  <div className="car-photos">
                    {car.photos.map((photo, idx) => (
                      <img key={idx} src={photo.filepath} alt={`${car.make} ${car.model}`} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
