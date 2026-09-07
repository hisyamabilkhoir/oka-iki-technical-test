import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isOwner = computed(() => user.value?.role === 'owner');
  const isStaff = computed(() => user.value?.role === 'staff');
  const tenant = computed(() => user.value?.tenant || null);

  async function login(email, password) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/login', { email, password });
      token.value = response.data.token;
      user.value = response.data.user;

      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Login gagal. Periksa kembali email dan password.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const response = await api.get('/me');
      user.value = response.data.user;
      localStorage.setItem('user', JSON.stringify(user.value));
    } catch (err) {
      logout();
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await api.post('/logout');
      }
    } catch (e) {
      // ignore logout errors on backend
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isOwner,
    isStaff,
    tenant,
    login,
    fetchUser,
    logout,
  };
});
