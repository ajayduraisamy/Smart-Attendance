import React, { useEffect, useRef, useState } from 'react';
import { 
  ArrowRight, CheckCircle, Clock, Users, Shield, BarChart3, 
  Fingerprint, Calendar, Mail, Phone, MapPin, Star, Award,
  TrendingUp, Globe, Smartphone, Cloud, Lock, Zap, ChevronRight,
  Play, Quote, Sparkles
} from 'lucide-react';

export default function LandingPage({ section }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const refs = { services: useRef(null), about: useRef(null), contact: useRef(null), features: useRef(null) };

  useEffect(() => {
    if (section && refs[section]?.current) refs[section].current.scrollIntoView({ behavior: 'smooth' });
  }, [section]);

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Hero />
      <section ref={refs.features} id="features" className="py-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">Powerful Features</span>
            <h2 className="text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>Everything you need to manage attendance</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Comprehensive solution with advanced features for modern workforce management</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (<FeatureCard key={index} {...feature} />))}
          </div>
        </div>
      </section>

      <section ref={refs.services} id="services" className="py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">Our Services</span>
            <h2 className="text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>Comprehensive Attendance Solutions</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Tailored services to meet your organization's unique needs</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((s, index) => (<ServiceCard key={index} service={s} index={index} />))}
          </div>
        </div>
      </section>

      <StatsSection />
      <AboutSection refs={refs} />
      <TestimonialsSection activeTestimonial={activeTestimonial} setActiveTestimonial={setActiveTestimonial} />
     
      <ContactSection refs={refs} />
    </div>
  );
}

function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);

  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #292524 100%)' }}>
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative container mx-auto px-4 py-8 lg:py-12">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-stone-200">3.97 Google rating | Trusted by 10,000+</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              Smart Attendance System{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Smart Attendance</span>
            </h1>
            <p className="text-xl text-stone-300 mb-8 max-w-xl">
              Innovative Tech Solutions — streamline time tracking with biometric devices, real-time sync, and powerful analytics.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="group bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-orange-500/25">
                Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                <Play className="w-5 h-5" /> Watch Demo
              </button>
            </div>
            <div className="mt-12 flex items-center gap-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} src={`https://randomuser.me/api/portraits/men/${i}.jpg`} alt="User" className="w-10 h-10 rounded-full border-2 border-stone-700" />
                ))}
              </div>
              <div className="text-sm text-stone-300">
                <div className="font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9/5 Rating
                </div>
                <div className="text-stone-400">from 2.5k+ reviews</div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold text-white">Live Dashboard</h3>
                <div className="flex gap-1 items-center"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div><span className="text-xs text-stone-300">Live</span></div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between mb-2 text-stone-300"><span className="text-sm">Today's Attendance</span><span className="text-sm font-semibold text-white">92%</span></div>
                  <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-gradient-to-r from-orange-400 to-amber-400 w-[92%] h-2 rounded-full"></div></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Present', value: '156', trend: '+12%' },
                    { label: 'On Leave', value: '8', trend: '-3%' },
                    { label: 'Late', value: '4', trend: '-2%' },
                    { label: 'Remote', value: '23', trend: '+8%' },
                  ].map((m) => (
                    <div key={m.label} className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white mb-1">{m.value}</div>
                      <div className="text-xs text-stone-400">{m.label}</div>
                      <div className={`text-xs mt-1 ${m.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{m.trend}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between text-stone-300">
                  <span className="text-sm">Active Devices</span>
                  <span className="text-sm font-semibold text-green-400">8 Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="card p-8 hover:shadow-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-3 mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-full h-full text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
      <a href="#" className="inline-flex items-center text-orange-500 font-medium hover:gap-2 transition-all">
        Learn more <ChevronRight className="w-4 h-4 ml-1" />
      </a>
    </div>
  );
}

function ServiceCard({ service, index }) {
  return (
    <div className="card p-8 hover:-translate-y-2 transition-all duration-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="text-4xl mb-6">{service.icon}</div>
      <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{service.title}</h3>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{service.desc}</p>
      <ul className="space-y-2">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatsSection() {
  return (
    <section className="py-8 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          {[
            { icon: Users, value: '10,000+', label: 'Active Users' },
            { icon: Fingerprint, value: '50M+', label: 'Verifications' },
            { icon: Globe, value: '25+', label: 'Countries' },
            { icon: Award, value: '99.9%', label: 'Uptime' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-4"><s.icon className="w-8 h-8 opacity-80" /></div>
              <div className="text-3xl font-bold mb-2">{s.value}</div>
              <div className="text-sm text-orange-100">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection({ refs }) {
  return (
    <section ref={refs.about} id="about" className="py-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container mx-auto px-4">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div className="relative">
            <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-6">About Smart Attendance System</h2>
              <p className="text-orange-100 text-lg leading-relaxed mb-8">
                We revolutionize workforce management with cutting-edge biometric technology and intelligent automation, helping businesses save time and reduce errors. Based in Bengaluru, serving clients worldwide.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Founded in 2020', desc: 'Started with a mission to simplify attendance tracking' },
                  { title: 'Global Team', desc: '50+ employees across 10 countries' },
                  { title: 'Innovation First', desc: 'Constantly updating with latest technology' },
                ].map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-1 mt-1"><CheckCircle className="w-4 h-4" /></div>
                    <div><h3 className="font-semibold">{h.title}</h3><p className="text-sm text-orange-100">{h.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="card p-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Why Choose Us?</h3>
              <ul className="space-y-4">
                {[
                  { title: '99.9% Uptime Guarantee', desc: 'Reliable service you can count on' },
                  { title: '24/7 Customer Support', desc: 'Round-the-clock assistance for your team' },
                  { title: 'Regular Updates', desc: 'New features and improvements monthly' },
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="bg-orange-100 dark:bg-orange-500/20 rounded-full p-1">
                      <CheckCircle className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{b.title}</span>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{b.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">Trusted Excellence</span>
              </div>
              <p className="text-2xl font-bold mb-2">10,000+</p>
              <p className="text-orange-100">Happy customers worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ activeTestimonial, setActiveTestimonial }) {
  return (
    <section className="py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">Testimonials</span>
          <h2 className="text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>What Our Clients Say</h2>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-12 shadow-lg relative">
            <Quote className="absolute top-8 right-8 w-12 h-12 text-orange-200 dark:text-orange-500/20" />
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <img src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].name} className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-orange-200 dark:border-orange-500/30" />
              </div>
              <div className="md:w-2/3">
                <p className="text-lg italic mb-6" style={{ color: 'var(--text-secondary)' }}>"{testimonials[activeTestimonial].quote}"</p>
                <div>
                  <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{testimonials[activeTestimonial].name}</h4>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{testimonials[activeTestimonial].position}</p>
                </div>
                <div className="flex mt-4 gap-2">
                  {testimonials.map((_, index) => (
                    <button key={index} onClick={() => setActiveTestimonial(index)}
                      className={`h-2 rounded-full transition-all ${index === activeTestimonial ? 'w-6 bg-orange-500' : 'w-2 bg-stone-300 dark:bg-stone-600'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function ContactSection({ refs }) {
  return (
    <section ref={refs.contact} id="contact" className="py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">Get in Touch</span>
          <h2 className="text-4xl font-bold mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>Let's Start a Conversation</h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Have questions? Our team is ready to help you</p>
        </div>
        <div className="grid gap-12 lg:grid-cols-2 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="card p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Contact Information</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'venkatesh@aislyntech.com' },
                  { icon: Phone, label: 'Phone', value: '+91 88922 09021' },
                  { icon: MapPin, label: 'Address', value: 'No:1688, 1st floor, 18th cross, 21st Main Rd, MC Layout, Vijayanagar, Bengaluru - 560040' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-orange-100 dark:bg-orange-500/20 rounded-lg p-2">
                      <item.icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Support Hours</h3>
              <p className="text-orange-100 mb-4">24/7 customer support available</p>
              <div className="space-y-2 text-sm">
                <p>Monday - Friday: 24 hours</p>
                <p>Saturday - Sunday: 24 hours</p>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const handleSubmit = (e) => { e.preventDefault(); console.log('Form submitted:', formData); };

  return (
    <form onSubmit={handleSubmit} className="card p-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <h3 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Send us a Message</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Full Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="Enter your name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email Address</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-field" placeholder="Enter your email" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Message</label>
          <textarea rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="input-field" placeholder="How can we help you?" required />
        </div>
        <button type="submit" className="btn-primary w-full justify-center">Send Message</button>
      </div>
    </form>
  );
}

const features = [
  { icon: Fingerprint, title: 'Biometric Verification', desc: 'Advanced fingerprint and facial recognition for secure attendance tracking.' },
  { icon: Cloud, title: 'Real-time Sync', desc: 'Instant data synchronization across all devices and platforms.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Comprehensive reports and insights for better decision making.' },
  { icon: Calendar, title: 'Leave Management', desc: 'Streamlined leave requests and approval workflows.' },
  { icon: Shield, title: 'Secure & Compliant', desc: 'Enterprise-grade security with GDPR and SOC2 compliance.' },
  { icon: Smartphone, title: 'Mobile Access', desc: 'Full-featured mobile app for on-the-go attendance management.' },
];

const services = [
  { icon: '📱', title: 'Attendance & Devices', desc: 'Comprehensive device management and attendance tracking', features: ['Biometric verification', 'Offline sync capability', 'Multi-device support'] },
  { icon: '👥', title: 'HR & Leaves', desc: 'Complete HR management with leave workflows', features: ['Leave requests', 'Approval workflows', 'Leave balance tracking'] },
  { icon: '📊', title: 'Reports & Analytics', desc: 'Powerful reporting tools for insights', features: ['Custom reports', 'Export capabilities', 'Real-time analytics'] },
];

const testimonials = [
  { name: 'Sarah Johnson', position: 'HR Director, TechCorp', quote: 'Smart Attendance has transformed how we manage our workforce. The biometric verification is incredibly accurate and the reports are invaluable.', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: 'Michael Chen', position: 'CEO, InnovateLabs', quote: 'The real-time sync and offline capabilities are game-changers. Our remote teams stay connected seamlessly.', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { name: 'Emily Rodriguez', position: 'Operations Manager, GlobalTech', quote: 'Best decision we made for our HR department. The leave management system alone saved us countless hours.', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
];
