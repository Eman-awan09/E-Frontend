import axios from 'axios';

const API = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
baseURL: 'https://e-backend-bay.vercel.app/api',
timeout: 60000,
});

export const emailAPI = {
  removeDuplicates: (emails) => API.post('/emails/remove-duplicates', { emails }),
  shuffle: (emails) => API.post('/emails/shuffle', { emails }),
};

export const urlAPI = {
  clean: (urls) => API.post('/urls/clean', { urls }),
  extractEmails: (urls) => API.post('/urls/extract-emails', { urls }),
};

export const senderAPI = {
  testSmtp: (smtpConfig) => API.post('/sender/test-smtp', { smtpConfig }),
  createCampaign: (data) => API.post('/sender/campaigns', data),
  getAllCampaigns: () => API.get('/sender/campaigns'),
  getCampaign: (id) => API.get(`/sender/campaigns/${id}`),
  startCampaign: (id) => API.post(`/sender/campaigns/${id}/start`),
  pauseCampaign: (id) => API.post(`/sender/campaigns/${id}/pause`),
  deleteCampaign: (id) => API.delete(`/sender/campaigns/${id}`),
  getDailyStats: (id) => API.get(`/sender/campaigns/${id}/daily-stats`),
};
