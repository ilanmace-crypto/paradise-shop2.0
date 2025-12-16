import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  
  const { addToCartWithFlavor } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        // Загружаем товары с категориями
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*, categories(name)')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        // Загружаем категории
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('id');

        if (categoriesError) throw categoriesError;

        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    if (product.flavors && Object.keys(product.flavors).length > 0) {
      alert('Пожалуйста, выберите вкус');
      return;
    }
    addToCartWithFlavor(product, null, 1);
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category_id === parseInt(selectedCategory));

  return (
    <div className="home-page">
      <div className="container">
        <div className="hero-section">
          <h1 className="page-title">PARADISE_SHOP</h1>
          <p className="page-subtitle">Лучший выбор vape продукции</p>
        </div>
        
        <div className="categories">
          <button 
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Все товары
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id.toString() ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id.toString())}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="products-section">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Загрузка товаров...</div>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <h3>Товары не найдены</h3>
              <p>Попробуйте выбрать другую категорию или вернитесь позже</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {!imageErrors[product.id] && product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        onError={() => handleImageError(product.id)}
                      />
                    ) : (
                      <div className="no-image">Нет изображения</div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>
                    <p className="price">${product.price}</p>
                    <p className="category">Категория: {product.categories?.name}</p>
                    
                    {product.flavors && (
                      <div className="flavors">
                        <strong>Вкусы:</strong>
                        <ul>
                          {Object.entries(product.flavors).map(([flavor, stock]) => (
                            <li key={flavor}>
                              {flavor}: {stock > 0 ? `${stock} банок` : 'Нет в наличии'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="stock-info">
                      <span className={`stock ${product.in_stock ? 'in-stock' : 'out-stock'}`}>
                        {product.in_stock ? 'В наличии' : 'Нет в наличии'}
                      </span>
                      {product.stock > 0 && (
                        <span className="stock-count">Остаток: {product.stock}</span>
                      )}
                    </div>
                    
                    <button 
                      className={`add-to-cart ${!product.in_stock ? 'disabled' : ''}`}
                      disabled={!product.in_stock}
                      onClick={() => handleAddToCart(product)}
                    >
                      {product.in_stock ? 'В корзину' : 'Недоступно'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
