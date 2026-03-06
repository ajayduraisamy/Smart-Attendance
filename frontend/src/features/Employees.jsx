import React, { useEffect, useState } from "react";
import client from "../api/client";

export default function EmployeesPage() {
  const emptyForm = {
    emp_id: "",
    name: "",
    email: "",
    phone: "",
    position: "",
    joined_date: "",
    office_id: ""
  };

  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [offices, setOffices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Load employees
  const loadEmployees = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await client.get("/employees/");
      setList(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  // Load offices
  const loadOffices = async () => {
    try {
      const res = await client.get("/offices/");
      setOffices(res.data);
    } catch (err) {
      console.log("Office load error", err);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadOffices();
  }, []);

  // Create employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await client.post("/employees/", {
        ...form,
        office_id: Number(form.office_id)
      });

      setForm(emptyForm);
      setShowForm(false);
      loadEmployees();

    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create employee");
    }
  };

  // Edit employee
  const handleEdit = (emp) => {
    setForm({
      emp_id: emp.emp_id,
      name: emp.name,
      email: emp.email || "",
      phone: emp.phone || "",
      position: emp.position,
      joined_date: emp.joined_date,
      office_id: emp.office_id
    });

    setEditingId(emp.id);
    setShowForm(true);
  };

  // Update employee
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await client.put(`/employees/${form.emp_id}`, {
        ...form,
        office_id: Number(form.office_id)
      });

      setEditingId(null);
      setForm(emptyForm);
      setShowForm(false);
      loadEmployees();

    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    }
  };

  // Deactivate employee
  const deactivateEmployee = async (emp_id) => {
    if (!window.confirm("Are you sure you want to deactivate this employee?")) return;

    try {
      await client.delete(`/employees/${emp_id}`);
      loadEmployees();
    } catch (err) {
      setError(err.response?.data?.detail || "Deactivate failed");
    }
  };

  const getOfficeName = (id) => {
    const office = offices.find((o) => o.id === id);
    return office ? office.name : "-";
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section with Animation */}
        <div className="flex justify-between items-center animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Employees Directory
            </h1>
            <p className="text-slate-600 mt-1">Manage your team members efficiently</p>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {showForm ? 'Close Form' : 'Add New Employee'}
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Form Card with Slide Animation */}
        <div className={`transform transition-all duration-500 ease-in-out ${
          showForm ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full h-0 overflow-hidden'
        }`}>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              {editingId ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            
            <form
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              onSubmit={editingId ? handleUpdate : handleSubmit}
            >
              <Input 
                label="Employee ID" 
                value={form.emp_id} 
                onChange={(v) => setForm({ ...form, emp_id: v })} 
                required 
                icon={
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                }
              />
              
              <Input 
                label="Full Name" 
                value={form.name} 
                onChange={(v) => setForm({ ...form, name: v })} 
                required 
                icon={
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              
              <Input 
                label="Email" 
                type="email" 
                value={form.email} 
                onChange={(v) => setForm({ ...form, email: v })} 
                icon={
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              
              <Input 
                label="Phone" 
                value={form.phone} 
                onChange={(v) => setForm({ ...form, phone: v })} 
                icon={
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
              
              <Input 
                label="Position" 
                value={form.position} 
                onChange={(v) => setForm({ ...form, position: v })} 
                required 
                icon={
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              
              <Input 
                label="Joined Date" 
                type="date" 
                value={form.joined_date} 
                onChange={(v) => setForm({ ...form, joined_date: v })} 
                required 
                icon={
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />

          
<div className="space-y-1">
  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
    <span>Office *</span> 
  </label>
  <select
    required
    value={form.office_id}
    onChange={(e) => setForm({ ...form, office_id: e.target.value })}
    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
  >
    <option value="">Select Office</option>
    {offices.map((office) => (
      <option key={office.id} value={office.id}>
        {office.name}
      </option>
    ))}
  </select>
</div>

              
              <div className="md:col-span-2 lg:col-span-3 flex gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {editingId ? 'Update Employee' : 'Add Employee'}
                </button>
                
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-6 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="md:col-span-2 lg:col-span-3 animate-shake">
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-slide-up">
          <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Employee List</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {list.length} {list.length === 1 ? 'Employee' : 'Employees'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-blue-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Emp ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Position</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Joined</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Office</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <p className="text-lg font-medium">No employees found</p>
                        <p className="text-sm">Click "Add New Employee" to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  list.map((emp, index) => (
                    <tr 
                      key={emp.id} 
                      className="hover:bg-blue-50/50 transition-colors duration-150 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">{emp.emp_id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{emp.email || "-"}</td>
                      <td className="px-4 py-3">{emp.phone || "-"}</td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {emp.position}
                        </span>
                      </td>
                      <td className="px-4 py-3">{emp.joined_date}</td>
                      <td className="px-4 py-3">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          {getOfficeName(emp.office_id)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          emp.status 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            emp.status ? 'bg-green-500' : 'bg-gray-500'
                          }`}></span>
                          {emp.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                            title="Edit"
                          >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deactivateEmployee(emp.emp_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                            title="Deactivate"
                          >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required, icon }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
        {icon}
        <span>{label}{required ? " *" : ""}</span>
      </label>
      <div className={`relative transition-all duration-200 ${
        focused ? 'scale-105' : ''
      }`}>
        <input
          type={type}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        {focused && (
          <div className="absolute inset-0 rounded-xl bg-blue-500/5 pointer-events-none animate-pulse"></div>
        )}
      </div>
    </div>
  );
}