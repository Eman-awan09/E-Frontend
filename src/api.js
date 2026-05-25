// import axios from 'axios';

// const API = axios.create({
//   // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
// baseURL: 'https://e-backend-bay.vercel.app/api',
// timeout: 60000,
// });

// export const emailAPI = {
//   removeDuplicates: (emails) => API.post('/emails/remove-duplicates', { emails }),
//   shuffle: (emails) => API.post('/emails/shuffle', { emails }),
// };

// export const urlAPI = {
//   clean: (urls) => API.post('/urls/clean', { urls }),
//   extractEmails: (urls) => API.post('/urls/extract-emails', { urls }),
// };

// export const senderAPI = {
//   testSmtp: (smtpConfig) => API.post('/sender/test-smtp', { smtpConfig }),
//   createCampaign: (data) => API.post('/sender/campaigns', data),
//   getAllCampaigns: () => API.get('/sender/campaigns'),
//   getCampaign: (id) => API.get(`/sender/campaigns/${id}`),
//   startCampaign: (id) => API.post(`/sender/campaigns/${id}/start`),
//   pauseCampaign: (id) => API.post(`/sender/campaigns/${id}/pause`),
//   deleteCampaign: (id) => API.delete(`/sender/campaigns/${id}`),
//   getDailyStats: (id) => API.get(`/sender/campaigns/${id}/daily-stats`),
// };

// import axios from 'axios';

// const API = axios.create({
//   // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
//   baseURL: 'https://e-backend-bay.vercel.app/api',
//   timeout: 30000,
// });

// export const emailAPI = {
//   removeDuplicates: (emails) => API.post('/emails/remove-duplicates', { emails }),
//   shuffle:          (emails) => API.post('/emails/shuffle', { emails }),
// };

// export const urlAPI = {
//   clean:         (urls) => API.post('/urls/clean', { urls }),
//   extractEmails: (urls) => API.post('/urls/extract-emails', { urls }),
// };

// export const senderAPI = {
//   testSmtp:       (smtpConfig) => API.post('/sender/test-smtp', { smtpConfig }),
//   createCampaign: (data)       => API.post('/sender/campaigns', data),
//   getAllCampaigns: ()           => API.get('/sender/campaigns'),
//   getCampaign:    (id)         => API.get(`/sender/campaigns/${id}`),
//   startCampaign:  (id)         => API.post(`/sender/campaigns/${id}/start`),
//   pauseCampaign:  (id)         => API.post(`/sender/campaigns/${id}/pause`),
//   sendNext:       (id)         => API.post(`/sender/campaigns/${id}/send-next`),  // ← NEW
//   deleteCampaign: (id)         => API.delete(`/sender/campaigns/${id}`),
//   getDailyStats:  (id)         => API.get(`/sender/campaigns/${id}/daily-stats`),
// };

// import axios from 'axios';

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
//   timeout: 30000,
// });

// // Attach JWT token to every request automatically
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem('et_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Auto logout on 401
// API.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response?.status === 401) {
//       const path = window.location.pathname;
//       if (!path.includes('login')) {
//         localStorage.removeItem('et_token');
//         localStorage.removeItem('et_user');
//         window.location.reload();
//       }
//     }
//     return Promise.reject(err);
//   }
// );

// export const authAPI = {
//   login:          (email, password)              => API.post('/auth/login', { email, password }),
//   register:       (email, password, setupKey)    => API.post('/auth/register', { email, password, setupKey }),
//   verify:         ()                             => API.get('/auth/verify'),
//   changePassword: (currentPassword, newPassword) => API.post('/auth/change-password', { currentPassword, newPassword }),
// };

// export const emailAPI = {
//   removeDuplicates: (emails) => API.post('/emails/remove-duplicates', { emails }),
//   shuffle:          (emails) => API.post('/emails/shuffle', { emails }),
// };

// export const urlAPI = {
//   clean:         (urls) => API.post('/urls/clean', { urls }),
//   extractEmails: (urls) => API.post('/urls/extract-emails', { urls }),
// };

// export const senderAPI = {
//   testSmtp:       (smtpConfig) => API.post('/sender/test-smtp', { smtpConfig }),
//   createCampaign: (data)       => API.post('/sender/campaigns', data),
//   getAllCampaigns: ()           => API.get('/sender/campaigns'),
//   getCampaign:    (id)         => API.get(`/sender/campaigns/${id}`),
//   startCampaign:  (id)         => API.post(`/sender/campaigns/${id}/start`),
//   pauseCampaign:  (id)         => API.post(`/sender/campaigns/${id}/pause`),
//   sendNext:       (id)         => API.post(`/sender/campaigns/${id}/send-next`),
//   deleteCampaign: (id)         => API.delete(`/sender/campaigns/${id}`),
//   getDailyStats:  (id)         => API.get(`/sender/campaigns/${id}/daily-stats`),
// };

import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('et_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If token expired/invalid → clear storage so login page shows
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('et_token');
      localStorage.removeItem('et_user');
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login:          (email, password)              => API.post('/auth/login',           { email, password }),
  register:       (email, password, setupKey)    => API.post('/auth/register',        { email, password, setupKey }),
  verify:         ()                             => API.get('/auth/verify'),
  changePassword: (currentPassword, newPassword) => API.post('/auth/change-password', { currentPassword, newPassword }),
};

export const emailAPI = {
  removeDuplicates: (emails) => API.post('/emails/remove-duplicates', { emails }),
  shuffle:          (emails) => API.post('/emails/shuffle',           { emails }),
};

export const urlAPI = {
  clean:         (urls) => API.post('/urls/clean',          { urls }),
  extractEmails: (urls) => API.post('/urls/extract-emails', { urls }),
};

export const senderAPI = {
  testSmtp:       (smtpConfig) => API.post('/sender/test-smtp',                    { smtpConfig }),
  createCampaign: (data)       => API.post('/sender/campaigns',                    data),
  getAllCampaigns: ()           => API.get('/sender/campaigns'),
  getCampaign:    (id)         => API.get(`/sender/campaigns/${id}`),
  startCampaign:  (id)         => API.post(`/sender/campaigns/${id}/start`),
  pauseCampaign:  (id)         => API.post(`/sender/campaigns/${id}/pause`),
  sendNext:       (id)         => API.post(`/sender/campaigns/${id}/send-next`),
  deleteCampaign: (id)         => API.delete(`/sender/campaigns/${id}`),
  getDailyStats:  (id)         => API.get(`/sender/campaigns/${id}/daily-stats`),
};

export const adminAPI = {
  getStats:         ()          => API.get('/admin/stats'),
  getAllUsers:       ()          => API.get('/admin/users'),
  getUserDetail:    (id)        => API.get(`/admin/users/${id}`),
  updateUser:       (id, data)  => API.put(`/admin/users/${id}`, data),
  toggleBlock:      (id)        => API.post(`/admin/users/${id}/toggle-block`),
  deleteUser:       (id)        => API.delete(`/admin/users/${id}`),
  deleteCampaign:   (id)        => API.delete(`/admin/campaigns/${id}`),
};
