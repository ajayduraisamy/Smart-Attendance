import { useNavigate } from 'react-router-dom';

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      icon: '👥',
      title: 'Employee Management',
      description: 'Comprehensive employee database with easy registration, profile management, and departmental organization.'
    },
    {
      icon: '⏰',
      title: 'Attendance Tracking',
      description: 'Multi-modal biometric attendance tracking using RFID, Fingerprint, and Face Recognition technology.'
    },
    {
      icon: '📊',
      title: 'Real-time Reports',
      description: 'Generate instant attendance reports, analytics, and insights with customizable dashboards.'
    },
    {
      icon: '🏖️',
      title: 'Leave Management',
      description: 'Streamlined leave application and approval workflow with balance tracking and history.'
    },
    {
      icon: '🏢',
      title: 'Multi-Office Support',
      description: 'Manage multiple office locations with office-specific reports and device assignments.'
    },
    {
      icon: '📱',
      title: 'Device Integration',
      description: 'Seamless integration with biometric devices, real-time sync, and offline support.'
    },
  ];

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
            <button onClick={() => navigate('/services')} className="text-slate-900 transition-colors duration-200 text-sm font-medium border-b-2 border-slate-900">
              Services
            </button>
            <button onClick={() => navigate('/about')} className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm font-medium">
              About
            </button>
            <button onClick={() => navigate('/contact')} className="text-slate-600 hover:text-slate-900 transition-colors duration-200 text-sm font-medium">
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

      {/* Header */}
      <section className="pt-40 pb-16 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-slate-900 text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Complete attendance management solutions designed for modern enterprises at scale
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >
                <div className="text-5xl mb-6 flex justify-center">{service.icon}</div>
                <h3 className="text-slate-900 font-semibold text-lg mb-4 text-center">{service.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed text-center flex-grow">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-white text-5xl font-bold mb-6">Ready to Transform Your Workforce?</h2>
          <p className="text-slate-300 text-lg mb-12 max-w-2xl mx-auto">
            Join thousands of organizations using Smart Attendance to streamline operations
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors duration-200"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-slate-900 font-semibold mb-6">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-600 text-sm hover:text-slate-900 transition-colors duration-200">Features</a></li>
                <li><a href="#" className="text-slate-600 text-sm hover:text-slate-900 transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-slate-600 text-sm hover:text-slate-900 transition-colors duration-200">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-600 text-sm hover:text-slate-900 transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="text-slate-600 text-sm hover:text-slate-900 transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="text-slate-600 text-sm hover:text-slate-900 transition-colors duration-200">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-600 text-sm hover:text-slate-900 transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="text-slate-600 text-sm hover:text-slate-900 transition-colors duration-200">API Reference</a></li>
                <li><a href="#" className="text-slate-600 text-sm hover:text-slate-900 transition-colors duration-200">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-600 text-sm hover:text-slate-900 transition-colors duration-200">Privacy</a></li>
                <li><a href="#" className="text-slate-600 text-sm hover:text-slate-900 transition-colors duration-200">Terms</a></li>
                <li><a href="#" className="text-slate-600 text-sm hover:text-slate-900 transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex items-center justify-between">
            <p className="text-slate-600 text-sm">© 2026 Smart Attendance Systems. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Twitter</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">LinkedIn</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
