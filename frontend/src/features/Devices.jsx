import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HardDrive, 
  Building2, 
  Key, 
  Plus, 
  Pencil, 
  Power,
  Trash2,
  X,
  Check,
  AlertCircle,
  Search,
  Filter,
  Copy,
  Wifi,
  WifiOff
} from 'lucide-react';
import client from '../api/client';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const tableRowVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  },
  hover: {
    scale: 1.01,
    backgroundColor: "rgba(99, 102, 241, 0.05)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export default function DevicesPage() {
  const [list, setList] = useState([]);
  const [offices, setOffices] = useState([]);
  const [deviceId, setDeviceId] = useState('');
  const [officeId, setOfficeId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [officeFilter, setOfficeFilter] = useState('all');
  const [copySuccess, setCopySuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const res = await client.get('/devices');
      setList(res.data);
      setError('');
    } catch {
      setError('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const loadOffices = async () => {
    try {
      const res = await client.get('/offices');
      setOffices(res.data.filter(o => o.status));
    } catch {
      setError('Failed to load offices');
    }
  };

  useEffect(() => {
    loadDevices();
    loadOffices();
  }, []);

  const resetForm = () => {
    setDeviceId('');
    setOfficeId('');
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (editingId) {
        await client.put(`/devices/${editingId}`, {
          device_id: editingId,
          office_id: Number(officeId)
        });
        setSuccess('Device updated successfully!');
      } else {
        await client.post('/devices', {
          device_id: deviceId,
          office_id: Number(officeId)
        });
        setSuccess('Device added successfully!');
      }

      resetForm();
      await loadDevices();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (device) => {
    setEditingId(device.device_id);
    setDeviceId(device.device_id);
    setOfficeId(device.office_id || '');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleStatus = async (device) => {
    setActionLoading(device.device_id);
    try {
      await client.put(`/devices/${device.device_id}/status?status=${!device.status}`);
      await loadDevices();
      setSuccess(`Device ${!device.status ? 'activated' : 'deactivated'} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update device status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (deviceId) => {
    if (!window.confirm('Are you sure you want to delete this device?')) return;
    
    setActionLoading(deviceId);
    try {
      await client.delete(`/devices/${deviceId}`);
      await loadDevices();
      setSuccess('Device deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to delete device');
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(text);
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const getOfficeName = (id) => {
    const office = offices.find(o => o.id === id);
    return office ? office.name : '-';
  };

  // Filter devices
  const filteredDevices = list.filter(device => {
    const matchesSearch = device.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.api_key?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true :
                         statusFilter === 'active' ? device.status :
                         !device.status;
    const matchesOffice = officeFilter === 'all' ? true :
                         device.office_id === Number(officeFilter);
    return matchesSearch && matchesStatus && matchesOffice;
  });

  return (
    <motion.div 
      className="space-y-6 p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 p-8 shadow-xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        
        <div className="relative flex items-center gap-4">
          <motion.div 
            className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <HardDrive className="w-8 h-8 text-white" />
          </motion.div>
          
          <div>
            <motion.h1 
              className="text-3xl font-bold text-white"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Device Management
            </motion.h1>
            <motion.p 
              className="text-white/80 text-sm"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage attendance devices and their assignments
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-600 flex-1">{error}</p>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div 
            className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg shadow-sm flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Check className="w-5 h-5 text-emerald-500" />
            <p className="text-emerald-600 flex-1">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Section */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            {editingId ? (
              <>
                <Pencil className="w-4 h-4 text-yellow-600" />
                Edit Device
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-blue-600" />
                Register New Device
              </>
            )}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Device ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HardDrive className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  required
                  disabled={editingId !== null}
                  placeholder="Enter unique device ID"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Office <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={officeId}
                  onChange={(e) => setOfficeId(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none bg-white"
                >
                  <option value="">Select an office</option>
                  {offices.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} {o.location ? `- ${o.location}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <motion.button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 ${
                editingId 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
              } transition-all shadow-lg hover:shadow-xl disabled:opacity-50`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />
              )}
              {editingId ? 'Update Device' : 'Register Device'}
            </motion.button>

            {editingId && (
              <motion.button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-slate-500 to-slate-600 text-white font-medium flex items-center gap-2 hover:from-slate-600 hover:to-slate-700 transition-all shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
                Cancel
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Filters Section */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg border border-slate-100 p-4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-400" />
            <select
              value={officeFilter}
              onChange={(e) => setOfficeFilter(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            >
              <option value="all">All Offices</option>
              {offices.map(office => (
                <option key={office.id} value={office.id}>{office.name}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Table Section */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Device ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">API Key</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Office</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredDevices.map((device, index) => (
                  <motion.tr
                    key={device.id}
                    variants={tableRowVariants}
                    whileHover="hover"
                    custom={index}
                    layout
                    className="group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <HardDrive className="w-4 h-4" />
                        </motion.div>
                        <span className="font-mono font-medium text-slate-900">{device.device_id}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative group/key">
                          <code className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-600">
                            {device.api_key?.substring(0, 8)}...{device.api_key?.substring(device.api_key.length - 4)}
                          </code>
                          <motion.button
                            onClick={() => copyToClipboard(device.api_key)}
                            className="ml-2 p-1 text-slate-400 hover:text-blue-600 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            title="Copy API Key"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                          {copySuccess === device.api_key && (
                            <motion.span
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute left-0 -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded"
                            >
                              Copied!
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{getOfficeName(device.office_id)}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <motion.span 
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          device.status 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-rose-100 text-rose-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {device.status ? (
                          <Wifi className="w-3 h-3" />
                        ) : (
                          <WifiOff className="w-3 h-3" />
                        )}
                        {device.status ? 'Active' : 'Inactive'}
                      </motion.span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => handleEdit(device)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          onClick={() => toggleStatus(device)}
                          disabled={actionLoading === device.device_id}
                          className={`p-2 rounded-lg transition-colors ${
                            device.status 
                              ? 'text-yellow-600 hover:bg-yellow-50' 
                              : 'text-emerald-600 hover:bg-emerald-50'
                          } disabled:opacity-50`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title={device.status ? 'Deactivate' : 'Activate'}
                        >
                          {actionLoading === device.device_id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className={`w-4 h-4 border-2 ${
                                device.status ? 'border-yellow-600' : 'border-emerald-600'
                              } border-t-transparent rounded-full`}
                            />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </motion.button>

                        <motion.button
                          onClick={() => handleDelete(device.device_id)}
                          disabled={actionLoading === device.device_id}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {filteredDevices.length === 0 && (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td className="px-6 py-12 text-center" colSpan={5}>
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block"
                    >
                      <HardDrive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-slate-500 font-medium">No devices found</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {searchTerm || statusFilter !== 'all' || officeFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Register your first device to get started'}
                    </p>
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-blue-600">{filteredDevices.length}</span> of{' '}
              <span className="font-semibold text-blue-600">{list.length}</span> devices
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Active: {list.filter(d => d.status).length} • Inactive: {list.filter(d => !d.status).length}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}