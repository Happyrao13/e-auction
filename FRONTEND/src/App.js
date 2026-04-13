import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();
      setCars(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading cars...</p></div>;
  if (error) return <div className="container"><p>Error: {error}</p></div>;

  return (
    <div className="app">
      <header className="header">
        <h1>CarScout</h1>
        <p>Find Your Perfect Car</p>
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
