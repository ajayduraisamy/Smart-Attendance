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
    backgroundColor: "rgba(249, 115, 22, 0.05)",
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
  const [statusFilter, setStatusFilter] = useState('all');
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
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 shadow-xl"
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

      <motion.div 
        className="card overflow-hidden"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="px-6 py-4" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
          <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            {editingId ? (
              <>
                <Pencil className="w-4 h-4" style={{ color: 'var(--orange-accent)' }} />
                Edit Office
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" style={{ color: 'var(--orange-accent)' }} />
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
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Office Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter office name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none"
                  style={{ 
                    borderColor: 'var(--border-color)', 
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--orange-accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all outline-none"
                  style={{ 
                    borderColor: 'var(--border-color)', 
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--orange-accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <motion.button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 ${
                editingId 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' 
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
              }`}
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
                className="px-6 py-3 rounded-lg btn-secondary text-white font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
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

      <motion.div 
        className="card p-4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search offices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border transition-all outline-none"
              style={{ 
                borderColor: 'var(--border-color)', 
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-primary)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--orange-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border transition-all outline-none"
              style={{ 
                borderColor: 'var(--border-color)', 
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-primary)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--orange-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="card overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--orange-bg)' }}>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Office Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
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
                          className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg text-white"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Building2 className="w-4 h-4" />
                        </motion.div>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{office.name}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <MapPin className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
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
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: 'var(--orange-accent)' }}
                          whileHover={{ scale: 1.1, backgroundColor: 'var(--orange-bg)' }}
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
                      <Building2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                    </motion.div>
                    <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No offices found</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
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

        <div className="px-6 py-4" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Showing <span className="font-semibold" style={{ color: 'var(--orange-accent)' }}>{filteredOffices.length}</span> of{' '}
            <span className="font-semibold" style={{ color: 'var(--orange-accent)' }}>{list.length}</span> offices
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
