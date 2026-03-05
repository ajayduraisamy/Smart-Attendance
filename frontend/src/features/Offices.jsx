import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  Check,
  AlertCircle,
  Power,
  Search,
  Filter
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

export default function OfficesPage() {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [deleteLoading, setDeleteLoading] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await client.get('/offices');
      setList(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load offices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setName('');
    setLocation('');
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
        await client.put(`/offices/${editingId}`, {
          name,
          location,
          status: true
        });
        setSuccess('Office updated successfully!');
      } else {
        await client.post('/offices', { name, location });
        setSuccess('Office added successfully!');
      }

      resetForm();
      await load();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (office) => {
    setEditingId(office.id);
    setName(office.name);
    setLocation(office.location || '');
    setError('');
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this office?')) return;

    setDeleteLoading(id);
    setError('');

    try {
      await client.delete(`/offices/${id}`);
      await load();
      setSuccess('Office deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete office');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter offices based on search and status
  const filteredOffices = list.filter(office => {
    const matchesSearch = office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (office.location && office.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' ? true :
                         statusFilter === 'active' ? office.status :
                         !office.status;
    return matchesSearch && matchesStatus;
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-xl"
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
            <Building2 className="w-8 h-8 text-white" />
          </motion.div>
          
          <div>
            <motion.h1 
              className="text-3xl font-bold text-white"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Office Management
            </motion.h1>
            <motion.p 
              className="text-white/80 text-sm"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage your organization's offices and locations
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
                Edit Office
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-indigo-600" />
                Add New Office
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
                Office Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter office name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
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
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
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
              {editingId ? 'Update Office' : 'Add Office'}
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

      {/* Search and Filter Section */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg border border-slate-100 p-4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search offices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
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
              <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Office Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredOffices.map((office, index) => (
                  <motion.tr
                    key={office.id}
                    variants={tableRowVariants}
                    whileHover="hover"
                    custom={index}
                    layout
                    className="group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Building2 className="w-4 h-4" />
                        </motion.div>
                        <span className="font-medium text-slate-900">{office.name}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {office.location || '-'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <motion.span 
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          office.status 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-rose-100 text-rose-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Power className="w-3 h-3" />
                        {office.status ? 'Active' : 'Inactive'}
                      </motion.span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => handleEdit(office)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          onClick={() => handleDelete(office.id)}
                          disabled={deleteLoading === office.id}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Delete"
                        >
                          {deleteLoading === office.id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full"
                            />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {filteredOffices.length === 0 && (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td className="px-6 py-12 text-center" colSpan={4}>
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block"
                    >
                      <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-slate-500 font-medium">No offices found</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your filters' 
                        : 'Add your first office to get started'}
                    </p>
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-t">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-indigo-600">{filteredOffices.length}</span> of{' '}
            <span className="font-semibold text-indigo-600">{list.length}</span> offices
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}