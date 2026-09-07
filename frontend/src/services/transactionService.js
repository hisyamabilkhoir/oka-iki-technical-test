import api from '../api/axios';

/**
 * Transaction API Service
 */
export const transactionService = {
  /**
   * Fetch transaction list with optional pagination, search, and date filters
   * @param {Object} params - Query params (page, per_page, search, role, start_date, end_date)
   * @returns {Promise<Object>} API response data
   */
  async getTransactions(params = {}) {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  /**
   * Submit POS checkout transaction
   * @param {Object} payload - { items: [{ product_id, quantity }] }
   * @returns {Promise<Object>} API response data
   */
  async createTransaction(payload) {
    const response = await api.post('/transactions', payload);
    return response.data;
  },
};
