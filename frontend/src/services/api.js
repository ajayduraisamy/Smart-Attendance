import api from '../api';
import { API_ENDPOINTS } from '../constants/endpoints';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    return data;
  },

  register: async (userData) => {
    const { data } = await api.post(API_ENDPOINTS.REGISTER, userData);
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await api.get(API_ENDPOINTS.ME);
    return data;
  },
};

export const employeeService = {
  getAll: async () => {
    const { data } = await api.get(API_ENDPOINTS.EMPLOYEES);
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(API_ENDPOINTS.EMPLOYEE_BY_ID(id));
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post(API_ENDPOINTS.EMPLOYEES, payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(API_ENDPOINTS.EMPLOYEE_BY_ID(id), payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(API_ENDPOINTS.EMPLOYEE_BY_ID(id));
    return data;
  },
};

export const attendanceService = {
  mark: async (payload) => {
    const { data } = await api.post(API_ENDPOINTS.MARK_ATTENDANCE, payload);
    return data;
  },

  getByDate: async (date) => {
    const { data } = await api.get(API_ENDPOINTS.GET_ATTENDANCE(date));
    return data;
  },
};

export const reportService = {
  getDailySummary: async (date) => {
    const { data } = await api.get(API_ENDPOINTS.DAILY_SUMMARY(date));
    return data;
  },

  getAbsentList: async (date) => {
    const { data } = await api.get(API_ENDPOINTS.ABSENT_LIST(date));
    return data;
  },
};

export const leaveService = {
  apply: async (payload) => {
    const { data } = await api.post(API_ENDPOINTS.APPLY_LEAVE, payload);
    return data;
  },

  approve: async (id) => {
    const { data } = await api.put(API_ENDPOINTS.APPROVE_LEAVE(id));
    return data;
  },

  getAll: async () => {
    const { data } = await api.get('/leaves');
    return data;
  },
};

export const officeService = {
  getAll: async () => {
    const { data } = await api.get(API_ENDPOINTS.OFFICES);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post(API_ENDPOINTS.OFFICES, payload);
    return data;
  },
};

export const deviceService = {
  getAll: async () => {
    const { data } = await api.get(API_ENDPOINTS.DEVICES);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post(API_ENDPOINTS.DEVICES, payload);
    return data;
  },

  verify: async (payload) => {
    const { data } = await api.post(API_ENDPOINTS.VERIFY_DEVICE, payload);
    return data;
  },
};

export const biometricService = {
  enrollRfid: async (payload) => {
    const { data } = await api.post(API_ENDPOINTS.ENROLL_RFID, payload);
    return data;
  },

  enrollFingerprint: async (payload) => {
    const { data } = await api.post(API_ENDPOINTS.ENROLL_FINGERPRINT, payload);
    return data;
  },

  enrollFace: async (payload) => {
    const { data } = await api.post(API_ENDPOINTS.ENROLL_FACE, payload);
    return data;
  },
};
