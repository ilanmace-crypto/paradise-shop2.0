const express = require('express');
const router = express.Router();
const pool = require('../config/supabase');

// GET /api/products - получить все товары
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name, pf.flavor_name, pf.stock as flavor_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_flavors pf ON p.id = pf.product_id
      WHERE p.is_active = true
      ORDER BY p.name, pf.flavor_name
    `);
    
    // Group products with flavors
    const products = {};
    result.rows.forEach(row => {
      if (!products[row.id]) {
        products[row.id] = {
          id: row.id,
          name: row.name,
          category_id: row.category_id,
          category_name: row.category_name,
          price: parseFloat(row.price),
          description: row.description,
          image_url: row.image_url,
          stock: row.stock,
          is_active: row.is_active,
          created_at: row.created_at,
          updated_at: row.updated_at,
          flavors: []
        };
      }
      
      if (row.flavor_name) {
        products[row.id].flavors.push({
          flavor_name: row.flavor_name,
          stock: row.flavor_stock
        });
      }
    });
    
    res.json(Object.values(products));
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - получить товар по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 AND p.is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = result.rows[0];
    
    // Get flavors for this product
    const flavorsResult = await pool.query(`
      SELECT flavor_name, stock
      FROM product_flavors
      WHERE product_id = $1
      ORDER BY flavor_name
    `, [id]);
    
    product.flavors = flavorsResult.rows;
    product.price = parseFloat(product.price);
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - добавить новый товар
router.post('/', async (req, res) => {
  try {
    const { name, category_id, price, description, image_url, stock, flavors } = req.body;
    
    if (!name || !category_id || !price || !stock) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Insert product
      const productResult = await client.query(`
        INSERT INTO products (id, name, category_id, price, description, image_url, stock)
        VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [name, category_id, parseFloat(price), description, image_url, parseInt(stock)]);
      
      const product = productResult.rows[0];
      
      // Insert flavors if provided
      if (flavors && Array.isArray(flavors)) {
        for (const flavor of flavors) {
          if (flavor.flavor_name && flavor.stock) {
            await client.query(`
              INSERT INTO product_flavors (product_id, flavor_name, stock)
              VALUES ($1, $2, $3)
            `, [product.id, flavor.flavor_name, parseInt(flavor.stock)]);
          }
        }
      }
      
      await client.query('COMMIT');
      res.status(201).json(product);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// PUT /api/products/:id - обновить товар
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, price, description, image_url, stock, is_active } = req.body;
    
    const result = await pool.query(`
      UPDATE products 
      SET name = COALESCE($1, name),
          category_id = COALESCE($2, category_id),
          price = COALESCE($3, price),
          description = COALESCE($4, description),
          image_url = COALESCE($5, image_url),
          stock = COALESCE($6, stock),
          is_active = COALESCE($7, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [name, category_id, price ? parseFloat(price) : null, description, image_url, stock ? parseInt(stock) : null, is_active, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - удалить товар (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      UPDATE products 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully', product: result.rows[0] });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
