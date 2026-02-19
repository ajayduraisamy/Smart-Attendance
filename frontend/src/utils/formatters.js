// Date formatting
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  return new Date(dateTime).toLocaleString('en-US');
};

export const formatTime = (time) => {
  if (!time) return '';
  return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Number formatting
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCurrency = (num) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

// String utilities
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str, length = 50) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

// Status colors
export const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    present: 'success',
    absent: 'danger',
  };
  return colors[status?.toLowerCase()] || 'default';
};
