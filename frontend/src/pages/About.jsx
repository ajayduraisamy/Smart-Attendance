import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaShieldAlt, FaRocket, FaUsers, FaChartLine, FaBullseye,
  FaEye, FaHeart, FaHandshake, FaGlobe, FaAward, FaQuoteRight,
  FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaArrowRight, FaCrown, FaGem, FaBolt
} from 'react-icons/fa';

export default function About() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeValue, setActiveValue] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Auto-rotate values
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % 6);
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-[#0A0F1E] selection:bg-violet-500/20 selection:text-white">
      {/* Premium Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
        scrolled 
          ? 'bg-[#0A0F1E]/90 backdrop-blur-xl border-b border-violet-500/20 shadow-2xl shadow-violet-500/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/30 group-hover:shadow-violet-500/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <FaCrown className="text-white text-xl" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Attendance</span>
            </span>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {[
              { name: 'Home', path: '/' },
              { name: 'Features', path: '/features' },
              { name: 'Enterprise', path: '/enterprise' },
              { name: 'About', path: '/about' },
              { name: 'Contact', path: '/contact' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`relative group px-4 py-2 ${
                  item.name === 'About' ? 'text-white' : 'text-gray-300'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2 text-sm font-medium">
                  {item.name}
                </span>
                {item.name === 'About' && (
                  <span className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400"></span>
                )}
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></span>
              </button>
            ))}
          </div>

          {/* Sign In Button */}
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

      {/* Hero Section with Animated Background */}
      <section className="relative pt-40 pb-16 px-8 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1E] via-violet-950/30 to-fuchsia-950/30"></div>
          <div className="absolute top-20 -left-4 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 -right-4 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 px-4 py-2 rounded-full text-violet-300 text-sm font-medium mb-6 backdrop-blur-sm border border-violet-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
            </span>
            Our Story
          </div>

          <h1 className="text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-white">About</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 ml-4">
              SmartAttendance
            </span>
          </h1>
          
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Transforming workforce management with intelligent technology since 2016, 
            empowering over 5,000 enterprises worldwide
          </p>

          {/* Stats highlight */}
          <div className="mt-12 flex justify-center gap-8">
            <div className="flex items-center gap-3">
              <FaAward className="text-violet-400 text-2xl" />
              <span className="text-white font-semibold">10+ Years Excellence</span>
            </div>
            <div className="flex items-center gap-3">
              <FaUsers className="text-fuchsia-400 text-2xl" />
              <span className="text-white font-semibold">150+ Team Members</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision with Premium Cards */}
      <section className="relative py-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-3xl p-12 border border-violet-500/20 hover:border-violet-500/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500 blur-xl"></div>
              
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
                  <FaBullseye className="text-white text-3xl" />
                </div>
                
                <h2 className="text-4xl font-bold mb-6">
                  <span className="text-white">Our</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 ml-3">Mission</span>
                </h2>
                
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  To revolutionize workforce management by providing enterprises with intelligent, 
                  secure, and scalable attendance solutions that adapt to modern work environments.
                </p>
                
                <p className="text-gray-400 text-lg leading-relaxed">
                  We believe that accurate attendance tracking is the foundation of effective 
                  workforce management, and our mission is to make this process seamless, 
                  transparent, and beneficial for both employers and employees.
                </p>

                {/* Highlight points */}
                <div className="mt-8 space-y-4">
                  {['99.9% Accuracy Rate', 'Real-time Processing', 'Enterprise Security'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full"></div>
                      <span className="text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-3xl p-12 border border-violet-500/20 hover:border-violet-500/50 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500 blur-xl"></div>
              
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-600 to-violet-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-2xl">
                  <FaEye className="text-white text-3xl" />
                </div>
                
                <h2 className="text-4xl font-bold mb-6">
                  <span className="text-white">Our</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400 ml-3">Vision</span>
                </h2>
                
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  To create a world where workforce management is intelligent, automated, 
                  and seamlessly integrated with every aspect of your HR ecosystem, 
                  enabling businesses to focus on what truly matters - growth and innovation.
                </p>

                {/* Vision points */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <FaRocket />, text: 'AI-Powered' },
                    { icon: <FaShieldAlt />, text: 'Secure by Design' },
                    { icon: <FaUsers />, text: 'Employee First' },
                    { icon: <FaGlobe />, text: 'Global Scale' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-violet-500/20">
                      <div className="text-violet-400">{item.icon}</div>
                      <span className="text-white text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values with Interactive Cards */}
      <section className="relative py-32 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1E] via-violet-950/20 to-[#0A0F1E]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-violet-400 uppercase tracking-wider bg-violet-500/10 px-4 py-2 rounded-full border border-violet-500/20">
              What Drives Us
            </span>
            <h2 className="text-5xl lg:text-6xl font-bold mt-6 mb-4 tracking-tight">
              <span className="text-white">Our Core</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 ml-3">Values</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: <FaShieldAlt />, title: 'Security First', desc: 'Enterprise-grade security and data privacy are non-negotiable.', color: 'from-violet-500 to-indigo-500' },
              { icon: <FaRocket />, title: 'Innovation', desc: 'We continuously push boundaries, investing heavily in R&D.', color: 'from-fuchsia-500 to-pink-500' },
              { icon: <FaHeart />, title: 'Customer Success', desc: 'Your success is our success. Committed to exceptional support.', color: 'from-amber-500 to-orange-500' },
              { icon: <FaAward />, title: 'Excellence', desc: 'We maintain the highest standards in everything we do.', color: 'from-emerald-500 to-teal-500' },
              { icon: <FaHandshake />, title: 'Integrity', desc: 'We conduct business with honesty, transparency, and ethical principles.', color: 'from-blue-500 to-cyan-500' },
              { icon: <FaGlobe />, title: 'Global Impact', desc: 'Creating positive impact by enabling businesses to operate efficiently.', color: 'from-purple-500 to-violet-500' }
            ].map((value, idx) => (
              <div
                key={idx}
                className={`group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-all duration-500 border ${
                  activeValue === idx ? 'border-violet-500/50 bg-violet-600/10' : 'border-violet-500/20 hover:border-violet-500/50'
                }`}
                onMouseEnter={() => setActiveValue(idx)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500 blur-xl`}></div>
                
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                    <div className="text-white text-2xl">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                    {value.desc}
                  </p>
                </div>

                {/* Active indicator */}
                {activeValue === idx && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
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
          <h2 className="text-white text-4xl lg:text-5xl font-bold text-center mb-16">By The Numbers</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '10+', label: 'Years in Business', icon: <FaAward className="text-4xl" /> },
              { number: '5000+', label: 'Enterprise Clients', icon: <FaUsers className="text-4xl" /> },
              { number: '50M+', label: 'Transactions Daily', icon: <FaChartLine className="text-4xl" /> },
              { number: '99.9%', label: 'Uptime SLA', icon: <FaBolt className="text-4xl" /> }
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

      {/* Team Section */}
      <section className="relative py-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-violet-400 uppercase tracking-wider bg-violet-500/10 px-4 py-2 rounded-full border border-violet-500/20">
              Leadership
            </span>
            <h2 className="text-5xl lg:text-6xl font-bold mt-6 mb-4 tracking-tight">
              <span className="text-white">Meet Our</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 ml-3">Team</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experienced leaders and innovators dedicated to transforming workforce management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { 
                name: 'Rajesh Kumar', 
                title: 'CEO & Founder', 
                bio: 'Serial entrepreneur with 15+ years in enterprise software',
                quote: 'Building the future of workforce management',
                initials: 'RK',
                color: 'from-violet-600 to-indigo-600'
              },
              { 
                name: 'Priya Sharma', 
                title: 'CTO', 
                bio: 'PhD in Computer Science, expert in biometric systems',
                quote: 'Innovation through technology',
                initials: 'PS',
                color: 'from-fuchsia-600 to-pink-600'
              },
              { 
                name: 'Amit Patel', 
                title: 'VP Product', 
                bio: 'Previously led product for Fortune 500 HR tech company',
                quote: 'User-centric design at scale',
                initials: 'AP',
                color: 'from-amber-600 to-orange-600'
              }
            ].map((member, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-3xl p-8 border border-violet-500/20 hover:border-violet-500/50 transition-all duration-500 hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500 blur-xl`}></div>
                
                <div className="relative">
                  {/* Profile Image */}
                  <div className={`w-24 h-24 bg-gradient-to-br ${member.color} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <span className="text-white font-bold text-2xl">{member.initials}</span>
                  </div>

                  {/* Quote icon */}
                  <FaQuoteRight className="absolute top-0 right-0 text-violet-500/20 text-4xl" />

                  <h3 className="text-white text-2xl font-bold mb-2 text-center">{member.name}</h3>
                  <p className={`text-transparent bg-clip-text bg-gradient-to-r ${member.color} font-semibold text-center mb-4`}>
                    {member.title}
                  </p>
                  <p className="text-gray-400 text-sm text-center mb-6">{member.bio}</p>
                  
                  <div className="border-t border-violet-500/20 pt-6 mt-6">
                    <p className="text-white text-sm italic text-center">"{member.quote}"</p>
                  </div>

                  {/* Social links */}
                  <div className="flex justify-center gap-4 mt-6">
                    <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-300">
                      <FaTwitter />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-300">
                      <FaLinkedin />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-violet-400 transition-colors duration-300">
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1E] via-violet-950/30 to-fuchsia-950/30"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Floating elements */}
          <div className="absolute -top-10 left-0 w-32 h-32 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-10 right-0 w-32 h-32 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-white">Join Our</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 ml-3">Journey</span>
          </h2>
          
          <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the future of workforce management. Start your free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium overflow-hidden shadow-2xl shadow-violet-600/30 hover:shadow-violet-600/50 transition-all duration-500 text-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Free Trial
                <FaRocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-violet-500/30 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300 text-lg flex items-center gap-2"
            >
              <FaEnvelope className="w-5 h-5" />
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-[#0A0F1E] border-t border-violet-500/20">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FaCrown className="text-white text-xl" />
                </div>
                <span className="text-white font-bold text-xl">SmartAttendance</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
                Next-generation attendance management platform for modern enterprises.
              </p>
              <div className="flex gap-4">
                <FaMapMarkerAlt className="text-violet-400" />
                <span className="text-gray-400 text-sm">San Francisco, CA</span>
              </div>
            </div>
            
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Integrations'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Resources', links: ['Docs', 'API', 'Support', 'Status'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Compliance'] }
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="text-white font-semibold text-sm mb-6 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
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
              © 2026 Smart Attendance. All rights reserved.
            </p>
            <div className="flex gap-6 order-1 lg:order-2">
              {[
                { icon: <FaTwitter />, name: 'Twitter' },
                { icon: <FaLinkedin />, name: 'LinkedIn' },
                { icon: <FaGithub />, name: 'GitHub' },
                { icon: <FaEnvelope />, name: 'Email' }
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