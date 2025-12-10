import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showFlavorDropdown, setShowFlavorDropdown] = useState(false);
  const { addToCartWithFlavor } = useCart();

  useEffect(() => {
    const products = getProducts();
    const foundProduct = products.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
    
    if (foundProduct && foundProduct.category === 'liquids' && foundProduct.flavors) {
      const firstFlavor = Object.keys(foundProduct.flavors)[0];
      setSelectedFlavor(firstFlavor);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product.category === 'liquids') {
      if (!selectedFlavor) {
        alert('Пожалуйста, выберите вкус');
        return;
      }
      
      const availableStock = product.flavors[selectedFlavor];
      if (availableStock < quantity) {
        alert(`Доступно только ${availableStock} банок вкуса "${selectedFlavor}"`);
        return;
      }

      addToCartWithFlavor(product, selectedFlavor, quantity);
    } else {
      addToCartWithFlavor(product, null, quantity);
    }
    
    navigate('/');
  };

  const getAvailableStock = (flavor) => {
    return product.flavors[flavor] || 0;
  };

  if (!product) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Назад к товарам
        </button>
        
        <div className="product-detail">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>
            <p className="product-description">{product.description}</p>
            <div className="product-price">{product.price} BYN</div>
            
            {product.category === 'liquids' && product.flavors && (
              <div className="flavor-selector">
                <label>Выберите вкус:</label>
                <div className="flavor-dropdown">
                  <button 
                    className="flavor-dropdown-btn"
                    onClick={() => setShowFlavorDropdown(!showFlavorDropdown)}
                  >
                    {selectedFlavor || 'Выберите вкус'} ↓
                  </button>
                  
                  {showFlavorDropdown && (
                    <div className="flavor-dropdown-content">
                      {Object.entries(product.flavors).map(([flavor, stock]) => (
                        <div 
                          key={flavor}
                          className={`flavor-option ${stock === 0 ? 'out-of-stock' : ''}`}
                          onClick={() => {
                            if (stock > 0) {
                              setSelectedFlavor(flavor);
                              setShowFlavorDropdown(false);
                              setQuantity(1);
                            }
                          }}
                        >
                          <span className="flavor-name">{flavor}</span>
                          <span className="flavor-stock">
                            {stock > 0 ? `${stock} банок` : 'Нет в наличии'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="quantity-selector">
              <label>Количество:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                  min="1"
                  max={product.category === 'liquids' && selectedFlavor ? getAvailableStock(selectedFlavor) : 99}
                />
                <button 
                  onClick={() => {
                    const maxStock = product.category === 'liquids' && selectedFlavor 
                      ? getAvailableStock(selectedFlavor) 
                      : 99;
                    setQuantity(Math.min(maxStock, quantity + 1));
                  }}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="product-actions">
              <button 
                onClick={handleAddToCart}
                className="add-to-cart-btn"
                disabled={
                  (product.category === 'liquids' && (!selectedFlavor || getAvailableStock(selectedFlavor) < quantity)) ||
                  !product.inStock
                }
              >
                {!product.inStock ? 'Нет в наличии' : 'Добавить в корзину'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
