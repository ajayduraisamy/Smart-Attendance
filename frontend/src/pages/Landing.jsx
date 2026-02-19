import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaShieldAlt, FaUsers, FaClock, FaChartLine, FaUmbrellaBeach,
  FaArrowRight, FaPlay, FaCheck, FaStar, FaTwitter, FaLinkedin, 
  FaGithub, FaYoutube, FaRocket, FaCrown, FaGem, FaBolt,
  FaBell, FaCalendarCheck, FaFingerprint, FaBrain
} from 'react-icons/fa';

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-[#0A0F1E] selection:bg-violet-500/20 selection:text-white">
      {/* Premium Navigation with Glass Effect */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
        scrolled 
          ? 'bg-[#0A0F1E]/90 backdrop-blur-xl border-b border-violet-500/20 shadow-2xl shadow-violet-500/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          {/* Logo with premium hover */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/30 group-hover:shadow-violet-500/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <FaCrown className="text-white text-xl" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Attendance</span>
            </span>
          </div>

          {/* Navigation Links with glow effect */}
          <div className="flex items-center gap-2">
            {[
              { name: 'Home', path: '/', icon: <FaGem className="w-3 h-3" /> },
              { name: 'About', path: '/about', icon: <FaCrown className="w-3 h-3" /> },
              { name: 'Services', path: '/services', icon: <FaRocket className="w-3 h-3" /> },
             { name: 'Contact', path: '/contact', icon: <FaBell className="w-3 h-3" /> },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="relative group px-4 py-2"
              >
                <span className="relative z-10 flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors duration-300 text-sm font-medium">
                  {item.icon}
                  {item.name}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </button>
            ))}
          </div>

          {/* Premium CTA Button with glow */}
          <button
            onClick={() => navigate('/login')}
            className="relative px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl text-sm font-medium overflow-hidden group shadow-2xl shadow-violet-600/30 hover:shadow-violet-600/50 transition-all duration-500"
          >
            <span className="relative z-10 flex items-center gap-2">
              Sign In
              <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </nav>

      {/* Hero Section with Dynamic Gradient */}
      <section className="relative pt-40 pb-32 px-8 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1E] via-violet-950/30 to-fuchsia-950/30"></div>
          <div className="absolute top-0 -left-4 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Column */}
            <div className="flex flex-col justify-center">
              {/* Premium badge */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 px-4 py-2 rounded-full text-violet-300 text-sm font-medium mb-6 backdrop-blur-sm border border-violet-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
                </span>
                <FaShieldAlt className="w-4 h-4 text-violet-400" />
                Enterprise-grade security
              </div>

              {/* Main heading with gradient */}
              <h1 className="text-7xl lg:text-8xl font-bold leading-tight mb-8 tracking-tight">
                <span className="text-white">Attendance</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                  Reimagined
                </span>
              </h1>

              {/* Animated description */}
              <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-lg">
                Streamline workforce management with{' '}
                <span className="text-white font-semibold relative inline-block">
                  intelligent biometric tracking
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400"></span>
                </span>
                , real-time analytics, and seamless integration for forward-thinking enterprises.
              </p>

              {/* Premium CTA Group */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium overflow-hidden shadow-2xl shadow-violet-600/30 hover:shadow-violet-600/50 transition-all duration-500"
                >
                  <span className="relative z-10 flex items-center gap-2 text-lg">
                    Get Started
                    <FaRocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="group px-8 py-4 bg-white/5 backdrop-blur-sm border border-violet-500/20 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                >
                  <FaPlay className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  Watch Demo
                </button>
              </div>

              {/* Social Proof with avatars */}
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 border-2 border-[#0A0F1E] shadow-xl flex items-center justify-center text-white font-bold text-sm"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FaStar key={i} className="w-4 h-4 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    <span className="font-semibold text-white">100+</span> enterprises onboarded this month
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Interactive 3D Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 backdrop-blur-xl rounded-3xl p-8 border border-violet-500/30 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <FaFingerprint className="text-4xl text-violet-400" />, label: 'Biometric', value: '99.9%' },
                    { icon: <FaBrain className="text-4xl text-fuchsia-400" />, label: 'AI Accuracy', value: '98.5%' },
                    { icon: <FaClock className="text-4xl text-blue-400" />, label: 'Real-time', value: '<1s' },
                    { icon: <FaCalendarCheck className="text-4xl text-emerald-400" />, label: 'Leave Auto', value: 'Smart' },
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className={`bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-violet-500/50 transition-all duration-500 hover:scale-105 cursor-pointer ${
                        activeFeature === idx ? 'border-violet-500/50 bg-violet-600/10' : ''
                      }`}
                    >
                      <div className="mb-2">{item.icon}</div>
                      <div className="text-xs text-gray-400">{item.label}</div>
                      <div className="text-xl font-bold text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
                
                {/* Live activity indicator */}
                <div className="mt-6 flex items-center gap-3 text-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-gray-300">Live tracking: <span className="text-white font-semibold">247 active</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Premium Cards */}
      <section className="relative py-32 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1E] via-violet-950/20 to-[#0A0F1E]"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-violet-400 uppercase tracking-wider bg-violet-500/10 px-4 py-2 rounded-full border border-violet-500/20">
              Why choose us
            </span>
            <h2 className="text-5xl lg:text-6xl font-bold mt-6 mb-4 tracking-tight">
              <span className="text-white">Everything you need,</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                nothing you don't
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Enterprise-grade features wrapped in an intuitive interface
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FaUsers className="text-4xl" />, title: 'Employee Hub', desc: 'Centralized database with role-based access', color: 'from-violet-500 to-indigo-500' },
              { icon: <FaFingerprint className="text-4xl" />, title: 'Smart Tracking', desc: 'Multi-modal biometrics with anti-spoofing', color: 'from-emerald-500 to-teal-500' },
              { icon: <FaBrain className="text-4xl" />, title: 'Live Analytics', desc: 'Real-time dashboards with predictive insights', color: 'from-amber-500 to-orange-500' },
              { icon: <FaUmbrellaBeach className="text-4xl" />, title: 'Leave Flow', desc: 'Automated workflows with smart approvals', color: 'from-rose-500 to-pink-500' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-all duration-500 border border-violet-500/20 hover:border-violet-500/50"
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 blur-xl`}></div>
                
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.desc}
                  </p>
                </div>
                
                {/* Hover arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                  <div className={`w-8 h-8 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center`}>
                    <FaArrowRight className="text-white text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature highlight */}
          <div className="mt-16 grid lg:grid-cols-3 gap-8">
            {[
              { number: '99.9%', label: 'Accuracy Rate', icon: <FaBolt className="text-2xl" /> },
              { number: '< 1s', label: 'Processing Time', icon: <FaClock className="text-2xl" /> },
              { number: '24/7', label: 'AI Monitoring', icon: <FaBrain className="text-2xl" /> },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-violet-500/20">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
                  <div className="text-white">{item.icon}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{item.number}</div>
                  <div className="text-sm text-gray-400">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Gradient */}
      <section className="relative py-32 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { number: '5000+', label: 'Enterprises Trust Us', icon: <FaCrown className="text-4xl" /> },
              { number: '99.9%', label: 'Uptime Guarantee', icon: <FaBolt className="text-4xl" /> },
              { number: '50M+', label: 'Records Processed', icon: <FaChartLine className="text-4xl" /> },
              { number: '24/7', label: 'Customer Support', icon: <FaUsers className="text-4xl" /> },
            ].map((stat, idx) => (
              <div key={idx} className="group text-center">
                <div className="text-white/50 mb-4 group-hover:scale-110 group-hover:text-white transition-all duration-500">
                  {stat.icon}
                </div>
                <div className="text-white text-5xl lg:text-6xl font-bold mb-3 tracking-tight">
                  {stat.number}
                </div>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="relative py-32 px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1E] via-violet-950/30 to-fuchsia-950/30"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Floating elements */}
          <div className="absolute -top-10 left-0 w-32 h-32 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-10 right-0 w-32 h-32 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 px-4 py-2 rounded-full text-violet-300 text-sm font-medium mb-6 backdrop-blur-sm border border-violet-500/20">
            <FaRocket className="w-4 h-4 text-violet-400" />
            Limited time offer
          </span>
          
          <h2 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-white">Ready to transform</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              your workforce?
            </span>
          </h2>
          
          <p className="text-gray-400 text-lg lg:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join 5,000+ organizations already using Smart Attendance to streamline their operations
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium overflow-hidden shadow-2xl shadow-violet-600/30 hover:shadow-violet-600/50 transition-all duration-500 text-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start free trial
                <FaRocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-violet-500/30 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300 text-lg"
            >
              Talk to sales
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-8">
            <FaCheck className="w-4 h-4 inline-block text-violet-400 mr-2" />
            No credit card required • Free 14-day trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-[#0A0F1E] border-t border-violet-500/20">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FaCrown className="text-white text-xl" />
                </div>
                <span className="text-white font-bold text-xl">SmartAttendance</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Next-generation attendance management platform for modern enterprises.
              </p>
              
              {/* Newsletter signup */}
              <div className="mt-6 flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-2 bg-white/5 border border-violet-500/20 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-r-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
            
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Integrations'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Press'] },
              { title: 'Resources', links: ['Documentation', 'API', 'Support', 'Status'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Compliance'] },
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="text-white font-semibold text-sm mb-6 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 text-sm hover:text-violet-400 transition-all duration-300 hover:translate-x-1 inline-block">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-violet-500/20 pt-8 flex flex-col lg:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm order-2 lg:order-1">
              © 2026 Smart Attendance Systems. All rights reserved.
            </p>
            <div className="flex gap-6 order-1 lg:order-2">
              {[
                { icon: <FaTwitter />, name: 'Twitter' },
                { icon: <FaLinkedin />, name: 'LinkedIn' },
                { icon: <FaGithub />, name: 'GitHub' },
                { icon: <FaYoutube />, name: 'YouTube' }
              ].map((social) => (
                <a 
                  key={social.name} 
                  href="#" 
                  className="text-gray-400 hover:text-violet-400 transition-all duration-300 text-lg hover:scale-110 hover:-translate-y-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}