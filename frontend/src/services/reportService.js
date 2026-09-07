import api from '../api/axios';

/**
 * Report API Service
 */
export const reportService = {
  /**
   * Fetch revenue reports (Owner only)
   * @param {Object} params - Query params (start_date, end_date)
   * @returns {Promise<Object>} API response data
   */
  async getReports(params = {}) {
    const response = await api.get('/reports', { params });
    return response.data;
  },
};
