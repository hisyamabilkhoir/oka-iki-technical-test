import api from '../api/axios';

/**
 * Product API Service
 */
export const productService = {
  /**
   * Fetch products with optional pagination, search, and sorting params
   * @param {Object} params - Query params (page, per_page, search, sort, min_price, max_price)
   * @returns {Promise<Object>} API response data
   */
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  /**
   * Create a new product
   * @param {Object} data - { name, price }
   * @returns {Promise<Object>} API response data
   */
  async createProduct(data) {
    const response = await api.post('/products', data);
    return response.data;
  },

  /**
   * Update an existing product
   * @param {number|string} id - Product ID
   * @param {Object} data - { name, price }
   * @returns {Promise<Object>} API response data
   */
  async updateProduct(id, data) {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  /**
   * Delete a product
   * @param {number|string} id - Product ID
   * @returns {Promise<Object>} API response data
   */
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
