export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  ME: '/users/me',

  // Employees
  EMPLOYEES: '/employees',
  EMPLOYEE_BY_ID: (id) => `/employees/${id}`,

  // Attendance
  MARK_ATTENDANCE: '/attendance/mark',
  GET_ATTENDANCE: (date) => `/attendance/by-date/${date}`,

  // Reports
  DAILY_SUMMARY: (date) => `/reports/daily-summary?report_date=${date}`,
  ABSENT_LIST: (date) => `/reports/absent-list?report_date=${date}`,

  // Leaves
  APPLY_LEAVE: '/leaves/apply',
  APPROVE_LEAVE: (id) => `/leaves/approve/${id}`,

  // Devices
  DEVICES: '/devices',
  VERIFY_DEVICE: '/devices/verify',
  SYNC_DATA: '/devices/sync-data',

  // Offices
  OFFICES: '/offices',

  // Biometrics
  ENROLL_RFID: '/biometrics/rfid',
  ENROLL_FINGERPRINT: '/biometrics/fingerprint',
  ENROLL_FACE: '/biometrics/face',
};
