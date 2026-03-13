import React, { useEffect, useState } from "react";
import client from "../api/client";
import {
  Fingerprint,
  CreditCard,
  Camera,
  X,
  Save,
  Loader,
  Shield,
  AlertCircle,
  CheckCircle,
  Briefcase,
  Radio,
  ScanLine,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

export default function AddEmployeePage() {
  const emptyForm = {
    emp_id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    blood_group: "",
    date_of_birth: "",
    position: "",
    joined_date: "",
    office_id: "",
    photo: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [employeeSaved, setEmployeeSaved] = useState(false);
  
  // State for tracking biometric enrollment
  const [enrollingBio, setEnrollingBio] = useState({
    type: null,
    index: null,
    waiting: false,
    startTime: null
  });

  // State for face previews
  const [facePreviews, setFacePreviews] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null
  });

  // State for fingerprint status
  const [fingerStatus, setFingerStatus] = useState({
    1: false,
    2: false,
    3: false,
    4: false
  });

  // State for RFID status
  const [rfidStatus, setRfidStatus] = useState(null);

  // Load offices
  useEffect(() => {
    loadOffices();
  }, []);

  const loadOffices = async () => {
    try {
      const res = await client.get("/offices/");
      setOffices(res.data);
    } catch (err) {
      console.error("Failed to load offices:", err);
    }
  };

  // Fetch employee RFID status
  const fetchEmployeeRFID = async (showSuccessMessage = true) => {
    if (!form.emp_id) return false;
    
    try {
      const res = await client.get(`/employees/${form.emp_id}`);
      console.log("Employee data after RFID scan:", res.data);
      
      if (res.data.rfid_uid) {
        setRfidStatus(res.data.rfid_uid);
        if (showSuccessMessage) {
          setSuccess(`RFID ${res.data.rfid_uid} captured successfully!`);
          setTimeout(() => setSuccess(""), 3000);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error fetching employee data:", err);
      return false;
    }
  };

  // Check hardware response during enrollment
 useEffect(() => {
  if (!enrollingBio.waiting) return;
  
  let checkCount = 0;
  const maxChecks = 30; // 60 seconds max (30 * 2 seconds)
  
  const interval = setInterval(async () => {
    checkCount++;
    
    try {
      const res = await client.get("/hardware/command");
      console.log("Hardware state:", res.data);
      
      // Check if command was processed (command reset to 0)
      if (res.data.command === 0) {
        // Get the captured data
        if (enrollingBio.type === 'face' && enrollingBio.index) {
          try {
            // IMPORTANT: Add emp_id as query parameter
            const previewRes = await client.get(`/hardware/face-preview/${enrollingBio.index}?emp_id=${form.emp_id}`);
            console.log("Face preview response:", previewRes.data);
            
           // Inside your useEffect tracking hardware response
if (previewRes.data.image) {
  // Check if the string already has the prefix, if not, add it
  const base64Image = previewRes.data.image.startsWith('data:image') 
    ? previewRes.data.image 
    : `data:image/jpeg;base64,${previewRes.data.image}`;

  setFacePreviews(prev => ({
    ...prev,
    [enrollingBio.index]: base64Image
  }));
  
  setSuccess(`Face ${enrollingBio.index} captured successfully!`);

            } else {
              // If no image but data was saved, still show success
              setFacePreviews(prev => ({
                ...prev,
                [enrollingBio.index]: 'captured'
              }));
              setSuccess(`Face ${enrollingBio.index} data saved!`);
            }
          } catch (err) {
            console.error("Error fetching face preview:", err);
            // Still mark as captured even if preview fails
            setFacePreviews(prev => ({
              ...prev,
              [enrollingBio.index]: 'captured'
            }));
            setSuccess(`Face ${enrollingBio.index} captured!`);
          }
        } 
        else if (enrollingBio.type === 'finger' && enrollingBio.index) {
          setFingerStatus(prev => ({
            ...prev,
            [enrollingBio.index]: true
          }));
          
          setSuccess(`Fingerprint ${enrollingBio.index} captured successfully!`);
        } 
        else if (enrollingBio.type === 'rfid') {
          // AUTOMATICALLY fetch RFID data
          const found = await fetchEmployeeRFID(true);
          if (!found) {
            setError("RFID captured but data not found");
            setTimeout(() => setError(""), 3000);
          }
        }
        
        setEnrollingBio({ type: null, index: null, waiting: false, startTime: null });
        
      } else if (checkCount >= maxChecks) {
        // Timeout after 60 seconds
        console.log("Enrollment timeout - resetting");
        setEnrollingBio({ type: null, index: null, waiting: false, startTime: null });
        setError(`${getBioType(enrollingBio.type)} capture timeout - please try again`);
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      console.error("Error checking hardware:", err);
    }
  }, 2000);
  
  return () => clearInterval(interval);
}, [enrollingBio.waiting, enrollingBio.type, enrollingBio.index, form.emp_id]); // ← Added form.emp_id here

  // Send command to hardware
  const captureBiometric = async (type, index = null) => {
    if (!form.emp_id) {
      setError("Please enter Employee ID first");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!employeeSaved) {
      setError("Please save employee details first");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      console.log(`Sending ${type} command for employee ${form.emp_id}, index: ${index}`);
      
      // Reset any pending command
      await client.post("/hardware/reset");
      
      // Determine command number
      let command = 1; // RFID
      if (type === 'finger') command = 2;
      if (type === 'face') command = 3;
      
      // Send command to hardware
      const response = await client.post("/hardware/command", {
        emp_id: form.emp_id,
        command: command,
        index: index
      });
      
      console.log("Command response:", response.data);
      
      setEnrollingBio({ 
        type, 
        index, 
        waiting: true,
        startTime: Date.now()
      });
      
      setSuccess(`Waiting for ${getBioType(type)} ${index || ''} from Raspberry Pi...`);
      
    } catch (err) {
      console.error("Error sending command:", err);
      setError("Failed to send command to hardware");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Clear face preview
  const clearFacePreview = (index) => {
    setFacePreviews(prev => ({
      ...prev,
      [index]: null
    }));
  };

  // Retry face capture
  const retryFaceCapture = (index) => {
    captureBiometric('face', index);
  };

  // Submit form - FIRST save employee, THEN enable biometrics
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await client.post("/employees/", {
        ...form,
        office_id: Number(form.office_id)
      });

      setEmployeeSaved(true);
      setSuccess("Employee saved successfully! Now you can capture biometrics.");
      
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save employee");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getBioType = (type) => {
    const types = { rfid: 'RFID', finger: 'Fingerprint', face: 'Face' };
    return types[type] || type;
  };

  // Reset only face biometrics
  const resetFaceBiometrics = () => {
    setFacePreviews({ 1: null, 2: null, 3: null, 4: null, 5: null });
    setSuccess("Face biometrics reset successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Reset all form data
  const resetForm = () => {
    setForm(emptyForm);
    setEmployeeSaved(false);
    setEnrollingBio({ type: null, index: null, waiting: false, startTime: null });
    setFacePreviews({ 1: null, 2: null, 3: null, 4: null, 5: null });
    setFingerStatus({ 1: false, 2: false, 3: false, 4: false });
    setRfidStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Add New Employee</h1>
                <p className="text-sm text-gray-500">
                  {employeeSaved 
                    ? "Employee saved - now capture biometrics" 
                    : "Fill details and save employee first"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Status Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Info Banner when employee not saved */}
        {!employeeSaved && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Step 1: Fill employee details and click "Save Employee" first. 
              Biometric enrollment will be available after saving.
            </p>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.emp_id}
                    onChange={e => setForm({...form, emp_id: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="EMP001"
                    disabled={employeeSaved}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    disabled={employeeSaved}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                    placeholder="john@company.com"
                    disabled={employeeSaved}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                    placeholder="+1234567890"
                    disabled={employeeSaved}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    value={form.address}
                    onChange={e => setForm({...form, address: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                    placeholder="123 Main St, City"
                    disabled={employeeSaved}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={e => setForm({...form, gender: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                    disabled={employeeSaved}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <input
                    value={form.blood_group}
                    onChange={e => setForm({...form, blood_group: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                    placeholder="O+"
                    disabled={employeeSaved}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={e => setForm({...form, date_of_birth: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                    disabled={employeeSaved}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.position}
                    onChange={e => setForm({...form, position: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                    placeholder="Software Engineer"
                    disabled={employeeSaved}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joined Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.joined_date}
                    onChange={e => setForm({...form, joined_date: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                    disabled={employeeSaved}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.office_id}
                    onChange={e => setForm({...form, office_id: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
                    disabled={employeeSaved}
                  >
                    <option value="">Select Office</option>
                    {offices.map(office => (
                      <option key={office.id} value={office.id}>{office.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Biometric Enrollment - Only show after employee is saved */}
            {employeeSaved && (
              <div className="mb-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Fingerprint className="h-5 w-5 text-blue-600" />
                    Biometric Enrollment
                  </h2>
                  
                  {/* Face Reset Button */}
                  <button
                    type="button"
                    onClick={resetFaceBiometrics}
                    className="px-3 py-1.5 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 flex items-center gap-2 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset Face Only
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  Step 2: Click buttons below to capture biometric data from Raspberry Pi
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* RFID */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-700">RFID Card</span>
                      {rfidStatus && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-mono">
                          {rfidStatus}
                        </span>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => captureBiometric('rfid')}
                      disabled={enrollingBio.waiting}
                      className={`w-full p-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        rfidStatus
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                      } disabled:opacity-50`}
                    >
                      {enrollingBio.waiting && enrollingBio.type === 'rfid' ? (
                        <>
                          <Radio className="h-4 w-4 animate-pulse" />
                          <span>Waiting for RFID card...</span>
                        </>
                      ) : rfidStatus ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>RFID Scanned: {rfidStatus}</span>
                        </>
                      ) : (
                        <>
                          <ScanLine className="h-4 w-4" />
                          <span>Tap RFID Card</span>
                        </>
                      )}
                    </button>

                    {/* Show hint when waiting */}
                    {enrollingBio.waiting && enrollingBio.type === 'rfid' && (
                      <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded-lg text-center animate-pulse">
                        Please tap RFID card on the reader...
                      </div>
                    )}
                  </div>

                  {/* Fingerprint */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-700">Fingerprints</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map(i => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => captureBiometric('finger', i)}
                          disabled={enrollingBio.waiting || fingerStatus[i]}
                          className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                            fingerStatus[i]
                              ? 'bg-green-100 text-green-700'
                              : enrollingBio.waiting && enrollingBio.type === 'finger' && enrollingBio.index === i
                              ? 'bg-blue-100 text-blue-700 animate-pulse'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } disabled:opacity-50`}
                        >
                          {fingerStatus[i] ? (
                            <div className="flex items-center justify-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>F{i}</span>
                            </div>
                          ) : enrollingBio.waiting && enrollingBio.type === 'finger' && enrollingBio.index === i ? (
                            <div className="flex items-center justify-center gap-1">
                              <Loader className="h-3 w-3 animate-spin" />
                              <span>F{i}</span>
                            </div>
                          ) : (
                            `Finger ${i}`
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Face */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-gray-700">Face Recognition</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => captureBiometric('face', i)}
                              disabled={enrollingBio.waiting}
                              className={`flex-1 p-3 rounded-lg text-sm font-medium transition-colors ${
                                facePreviews[i]
                                  ? 'bg-green-100 text-green-700'
                                  : enrollingBio.waiting && enrollingBio.type === 'face' && enrollingBio.index === i
                                  ? 'bg-blue-100 text-blue-700 animate-pulse'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              } disabled:opacity-50`}
                            >
                              {facePreviews[i] ? (
                                <div className="flex items-center justify-center gap-1">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Face {i}</span>
                                </div>
                              ) : enrollingBio.waiting && enrollingBio.type === 'face' && enrollingBio.index === i ? (
                                <div className="flex items-center justify-center gap-2">
                                  <Loader className="h-4 w-4 animate-spin" />
                                  <span>Capturing...</span>
                                </div>
                              ) : (
                                `Capture Face ${i}`
                              )}
                            </button>
                            
                            {facePreviews[i] && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => clearFacePreview(i)}
                                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Clear preview"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => retryFaceCapture(i)}
                                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                  title="Retry capture"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                          
                          {/* Face Preview */}
                          {facePreviews[i] && (
                            <div className="relative mt-2 border rounded-lg overflow-hidden bg-gray-50">
                             <img 
  src={facePreviews[i]} 
  alt={`Face ${i} preview`}
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                                Face {i}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Full Reset
              </button>
              <button
                type="submit"
                disabled={loading || employeeSaved}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors text-sm font-medium"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : employeeSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Employee Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Employee
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}