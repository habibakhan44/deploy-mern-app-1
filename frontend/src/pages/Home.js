import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:8080/products', {
      headers: {
        Authorization: `Bearer secret-123`
      }
    })
    .then(res => {
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setError('Invalid product data received from server');
      }
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    });
  }, []);

  return (
    <div>
      <h1>Product List</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {products.length > 0 ? (
        products.map((item, index) => (
          <ul key={index}>
            <li>{item.name} - ${item.price}</li>
          </ul>
        ))
      ) : (
        !error && <p>Loading products or no products found.</p>
      )}
    </div>
  );
}

export default Home;
