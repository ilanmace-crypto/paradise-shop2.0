export const loadProducts = () => {
  const stored = localStorage.getItem('paradise_shop_products');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

export const saveProducts = (products) => {
  localStorage.setItem('paradise_shop_products', JSON.stringify(products));
};
