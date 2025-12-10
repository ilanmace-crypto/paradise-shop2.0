import { loadProducts, saveProducts } from './productsStorage';

export const defaultProducts = [
  {
    id: 1,
    name: 'Lost Mary OS5000',
    category: 'disposable',
    price: 35.60,
    image: '/images/lost-mary.jpg',
    description: 'Одноразовое устройство 5000 затяжек',
    inStock: true
  },
  {
    id: 2,
    name: 'ELFBAR BC5000',
    category: 'disposable',
    price: 39.60,
    image: '/images/elfbar.jpg',
    description: 'Популярный одноразовый вейп',
    inStock: true
  },
  {
    id: 3,
    name: 'Juicy Jay\'s Strawberry',
    category: 'liquids',
    price: 19.60,
    image: '/images/strawberry-liquid.jpg',
    description: 'Жидкость с клубничным вкусом 30мл',
    inStock: true,
    flavors: {
      'Клубника': 3,
      'Клубника со сливками': 2,
      'Клубничный cheesecake': 1
    }
  },
  {
    id: 4,
    name: 'Vapetasia Killer Kustard',
    category: 'liquids',
    price: 23.60,
    image: '/images/killer-kustard.jpg',
    description: 'Кремовый десертный вкус 60мл',
    inStock: true,
    flavors: {
      'Ванильный крем': 2,
      'Карамельный крем': 3,
      'Крем брюле': 1
    }
  },
  {
    id: 5,
    name: 'Naked 100 Hawaiian Pog',
    category: 'liquids',
    price: 26.00,
    image: '/images/hawaiian-pog.jpg',
    description: 'Тропический фруктовый микс 60мл',
    inStock: true,
    flavors: {
      'Манго': 2,
      'Ананас': 1,
      'Гуава': 3,
      'Тропический микс': 2
    }
  },
  {
    id: 6,
    name: 'SMOK Nord Replacement Pods',
    category: 'cartridges',
    price: 15.60,
    image: '/images/nord-pods.jpg',
    description: 'Сменные картриджи для SMOK Nord (3шт)',
    inStock: true
  },
  {
    id: 7,
    name: 'Vaporesso XROS Pods',
    category: 'cartridges',
    price: 18.00,
    image: '/images/xros-pods.jpg',
    description: 'Сменные картриджи для XROS (2шт)',
    inStock: true
  },
  {
    id: 8,
    name: 'Uwell Caliburn G Pods',
    category: 'cartridges',
    price: 16.80,
    image: '/images/caliburn-pods.jpg',
    description: 'Сменные картриджи для Caliburn G (4шт)',
    inStock: true
  }
];

export const getProducts = () => {
  const storedProducts = loadProducts();
  if (storedProducts.length === 0) {
    return defaultProducts;
  }
  return storedProducts;
};

export { saveProducts };

export const categories = [
  { id: 'liquids', name: 'Жидкости', description: 'Жидкости для вейпинга' },
  { id: 'cartridges', name: 'Картриджи', description: 'Сменные картриджи' },
  { id: 'disposable', name: 'Одноразовые', description: 'Одноразовые вейпы' }
];
