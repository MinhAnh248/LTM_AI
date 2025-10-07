import axios from 'axios';

// LAN: const API_BASE_URL = 'http://10.67.148.12:5000/api';
// Ngrok: Thay URL bên dưới bằng URL từ ngrok
// Thay URL bên dưới bằng URL mới từ Ngrok
const API_BASE_URL = 'https://uniocular-abraham-phrenetically.ngrok-free.dev/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// API endpoints
const apiService = {
  // Expense operations
  getExpenses: (params = {}) => api.get('/expenses', { params }),
  addExpense: (data) => api.post('/expenses', data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  clearAllExpenses: () => api.delete('/expenses/clear-all'),
  createSampleData: () => api.post('/create-sample-data'),
  
  // OCR scanning
  scanReceipt: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/scan-receipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Category prediction
  predictCategory: (description) => api.post('/predict-category', { description }),
  
  // Dashboard data
  getSummary: () => api.get('/summary'),
  getCategoryBreakdown: () => api.get('/category-breakdown'),
  getDailySpending: () => api.get('/daily-spending'),
  
  // Analysis
  getAnalysis: () => api.get('/analysis'),
  
  // Budget
  getBudgets: () => api.get('/budget'),
  setBudget: (data) => api.post('/budget', data),
  
  // Authentication
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  
  // Income operations
  getIncomes: () => api.get('/incomes'),
  addIncome: (data) => api.post('/incomes', data),
  deleteIncome: (id) => api.delete(`/incomes/${id}`),
  updateIncome: (id, data) => api.put(`/incomes/${id}`, data),
  getIncomeSummary: () => api.get('/income-summary'),
  
  // Budget Alerts
  getBudgetAlerts: () => api.get('/budget-alerts'),
  getSpendingStatus: () => api.get('/spending-status'),
  
  // Debt Management
  getDebts: () => api.get('/debts'),
  addDebt: (data) => api.post('/debts', data),
  deleteDebt: (id) => api.delete(`/debts/${id}`),
  makeDebtPayment: (debtId, data) => api.post(`/debts/${debtId}/payment`, data),
  getDebtSummary: () => api.get('/debt-summary'),
  getPaymentHistory: (debtId) => api.get('/payment-history', { params: { debt_id: debtId } }),
  
  // Savings Management
  getSavingsGoals: () => api.get('/savings-goals'),
  addSavingsGoal: (data) => api.post('/savings-goals', data),
  deleteSavingsGoal: (id) => api.delete(`/savings-goals/${id}`),
  makeSavingsDeposit: (goalId, data) => api.post(`/savings-goals/${goalId}/deposit`, data),
  getSavingsSummary: () => api.get('/savings-summary'),
  getDepositHistory: (goalId) => api.get('/deposit-history', { params: { goal_id: goalId } }),
  getMonthlySuggestion: (goalId) => api.get(`/savings-goals/${goalId}/suggestion`),
  
  // Reminder Management
  getReminders: (includeCompleted = false) => api.get('/reminders', { params: { include_completed: includeCompleted } }),
  addReminder: (data) => api.post('/reminders', data),
  deleteReminder: (id) => api.delete(`/reminders/${id}`),
  completeReminder: (id) => api.post(`/reminders/${id}/complete`),
  getDueReminders: (daysAhead = 7) => api.get('/due-reminders', { params: { days_ahead: daysAhead } }),
  getReminderSummary: () => api.get('/reminder-summary'),
};

export default apiService;