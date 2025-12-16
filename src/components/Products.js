import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="products-container">
      <h1>PARADISE SHOP</h1>
      
      {/* Фильтр по категориям */}
      <div className="categories">
        <h2>Категории</h2>
        {categories.map(category => (
          <button key={category.id} className="category-btn">
            {category.name}
          </button>
        ))}
      </div>

      {/* Список товаров */}
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
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
                    {Object.entries(product.flavors).map(([flavor, price]) => (
                      <li key={flavor}>{flavor}: ${price}</li>
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
              >
                {product.in_stock ? 'В корзину' : 'Недоступно'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-products">
          <p>Товары не найдены</p>
        </div>
      )}
    </div>
  );
}

export default Products;
