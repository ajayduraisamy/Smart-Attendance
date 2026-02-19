import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SA</span>
            </div>
            <span className="text-slate-900 font-semibold text-lg">Smart Attendance</span>
          </button>

          <div className="flex items-center gap-12">
            <button onClick={() => navigate('/')} className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm font-medium">
              Home
            </button>
            <button onClick={() => navigate('/services')} className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm font-medium">
              Services
            </button>
            <button onClick={() => navigate('/about')} className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm font-medium">
              About
            </button>
            <button onClick={() => navigate('/contact')} className="text-slate-900 transition-colors duration-200 text-sm font-medium border-b-2 border-slate-900">
              Contact
            </button>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-slate-900 text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Have questions? Our team is ready to help. Reach out to us and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Section - 2 Column */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-slate-900 text-3xl font-bold mb-8">Send us a message</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                  <div className="text-5xl mb-4">✓</div>
                  <h3 className="text-slate-900 font-bold text-xl mb-2">Message Sent!</h3>
                  <p className="text-slate-600 font-normal">Thank you for reaching out. Our team will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-slate-900 font-semibold text-sm mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-900 font-semibold text-sm mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="john@company.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-900 font-semibold text-sm mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-900 font-semibold text-sm mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Your Company"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-slate-900 font-semibold text-sm mb-2">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="demo">Request a Demo</option>
                      <option value="pricing">Pricing Inquiry</option>
                      <option value="support">Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-slate-900 font-semibold text-sm mb-2">Message</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows="5"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 resize-none"
                      placeholder="Tell us more about your needs..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-6 py-3.5 bg-slate-900 text-white font-semibold text-base rounded-lg hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
            
            {/* Contact Info */}
            <div>
              <h2 className="text-slate-900 text-3xl font-bold mb-8">Contact Information</h2>
              
              <div className="space-y-8">
                <div className="border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200">
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-slate-900 font-bold text-xl mb-2">Address</h3>
                  <p className="text-slate-600 font-normal text-base leading-relaxed">123 Innovation Drive<br/>San Francisco, CA 94105<br/>United States</p>
                </div>
                
                <div className="border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200">
                  <div className="text-4xl mb-4">📞</div>
                  <h3 className="text-slate-900 font-bold text-xl mb-2">Phone</h3>
                  <p className="text-slate-600 font-normal text-base">+1 (555) 123-4567</p>
                  <p className="text-slate-500 font-normal text-sm mt-1">Monday - Friday, 9AM - 6PM PST</p>
                </div>
                
                <div className="border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200">
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-slate-900 font-bold text-xl mb-2">Email</h3>
                  <p className="text-slate-600 font-normal text-base">info@smartattendance.com</p>
                  <p className="text-slate-500 font-normal text-sm mt-1">We'll respond within 24 hours</p>
                </div>
                
                <div className="border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200">
                  <div className="text-4xl mb-4">🕐</div>
                  <h3 className="text-slate-900 font-bold text-xl mb-2">Business Hours</h3>
                  <p className="text-slate-600 font-normal text-base">Monday - Friday<br/>9:00 AM - 6:00 PM (PST)</p>
                  <p className="text-slate-600 font-normal text-base mt-3">24/7 Support for Enterprise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors duration-200">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors duration-200">About</a></li>
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors duration-200">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors duration-200">Docs</a></li>
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors duration-200">API</a></li>
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors duration-200">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors duration-200">Privacy</a></li>
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors duration-200">Terms</a></li>
                <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex items-center justify-between">
            <p className="text-slate-400 text-sm">© 2026 Smart Attendance. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
