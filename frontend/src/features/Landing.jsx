import React, { useEffect, useRef, useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Users, 
  Shield, 
  BarChart3, 
  Fingerprint, 
  Calendar,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  TrendingUp,
  Globe,
  Smartphone,
  Cloud,
  Lock,
  Zap,
  ChevronRight,
  Play,
  Quote
} from 'lucide-react';

export default function LandingPage({ section }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const refs = {
    services: useRef(null),
    about: useRef(null),
    contact: useRef(null),
    features: useRef(null),
    pricing: useRef(null),
  };

  useEffect(() => {
    if (section && refs[section]?.current) {
      refs[section].current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [section]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Enhanced Design */}
      <Hero />

      {/* Trusted By Section */}
      <TrustedBy />

      {/* Features Section with Icons */}
      <section ref={refs.features} id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Powerful Features</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">
              Everything you need to manage attendance
            </h2>
            <p className="text-lg text-slate-600">
              Comprehensive solution with advanced features for modern workforce management
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with Premium Design */}
      <section ref={refs.services} id="services" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Services</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">
              Comprehensive Attendance Solutions
            </h2>
            <p className="text-lg text-slate-600">
              Tailored services to meet your organization's unique needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {services.map((s, index) => (
              <ServiceCard key={index} service={s} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* About Section with Premium Layout */}
      <section ref={refs.about} id="about" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
              
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-6">About Smart Attendance</h2>
                <p className="text-blue-100 text-lg leading-relaxed mb-8">
                  We revolutionize workforce management with cutting-edge biometric technology 
                  and intelligent automation, helping businesses save time and reduce errors.
                </p>
                
                <div className="space-y-4">
                  {aboutHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-white/20 rounded-full p-1 mt-1">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{highlight.title}</h3>
                        <p className="text-sm text-blue-100">{highlight.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Why Choose Us?</h3>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="bg-blue-100 rounded-full p-1">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-900">{benefit.title}</span>
                        <p className="text-sm text-slate-600 mt-1">{benefit.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Trusted Excellence</span>
                </div>
                <p className="text-2xl font-bold mb-2">10,000+</p>
                <p className="text-blue-100">Happy customers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection 
        activeTestimonial={activeTestimonial} 
        setActiveTestimonial={setActiveTestimonial} 
      />

      {/* Pricing Section */}
      <section ref={refs.pricing} id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Pricing</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600">
              Choose the perfect plan for your organization
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Contact Section with Enhanced Design */}
      <section ref={refs.contact} id="contact" className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Get in Touch</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">
              Let's Start a Conversation
            </h2>
            <p className="text-lg text-slate-600">
              Have questions? Our team is ready to help you
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 max-w-6xl mx-auto">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>

    </div>
  );
}

// Enhanced Hero Component
function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Trusted by 10,000+ companies</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transform Your{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Workforce Management
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-xl">
              Smart Attendance streamlines time tracking with biometric devices, real-time sync, and powerful analytics.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="group bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">4.9/5 Rating</div>
                <div className="text-blue-200">from 2.5k+ reviews</div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold">Live Dashboard</h3>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-xs">Live</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Today's Attendance</span>
                    <span className="text-sm font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 w-[92%] h-2 rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <MetricCard label="Present" value="156" trend="+12%" />
                  <MetricCard label="On Leave" value="8" trend="-3%" />
                  <MetricCard label="Late" value="4" trend="-2%" />
                  <MetricCard label="Remote" value="23" trend="+8%" />
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Devices</span>
                    <span className="text-sm font-semibold text-green-400">8 Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper Components
function MetricCard({ label, value, trend }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white/5 rounded-xl p-4">
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-blue-200">{label}</div>
      <div className={`text-xs mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {trend}
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }) {
  return (
    <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-100">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} p-3 mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className="w-full h-full text-white" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-4">{desc}</p>
      <a href="#" className="inline-flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
        Learn more <ChevronRight className="w-4 h-4 ml-1" />
      </a>
    </div>
  );
}

function ServiceCard({ service, index }) {
  return (
    <div className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-bl-3xl rounded-tr-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
      <div className="text-4xl mb-6">{service.icon}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{service.title}</h3>
      <p className="text-slate-600 mb-6">{service.desc}</p>
      <ul className="space-y-2">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingCard({ plan, index }) {
  return (
    <div className={`relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 ${plan.popular ? 'border-2 border-blue-600 transform scale-105' : 'border border-slate-200'}`}>
      {plan.popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
      <p className="text-slate-600 mb-6">{plan.desc}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
        <span className="text-slate-600">/month</span>
      </div>
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
        Get Started
      </button>
    </div>
  );
}

function TrustedBy() {
  return (
    <div className="py-12 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
          Trusted by leading companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
          {['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'].map((company, i) => (
            <div key={i} className="text-xl font-bold text-slate-400">{company}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <StatCard icon={Users} value="10,000+" label="Active Users" />
          <StatCard icon={Fingerprint} value="50M+" label="Verifications" />
          <StatCard icon={Globe} value="25+" label="Countries" />
          <StatCard icon={Award} value="99.9%" label="Uptime" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <Icon className="w-8 h-8 opacity-80" />
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-sm text-blue-100">{label}</div>
    </div>
  );
}

function TestimonialsSection({ activeTestimonial, setActiveTestimonial }) {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Testimonials</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">
            What Our Clients Say
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative">
            <Quote className="absolute top-8 right-8 w-12 h-12 text-blue-100" />
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <img
                  src={testimonials[activeTestimonial].avatar}
                  alt={testimonials[activeTestimonial].name}
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-100"
                />
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-slate-600 italic mb-6">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div>
                  <h4 className="font-semibold text-slate-900">{testimonials[activeTestimonial].name}</h4>
                  <p className="text-sm text-slate-500">{testimonials[activeTestimonial].position}</p>
                </div>
                <div className="flex mt-4 gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activeTestimonial ? 'w-6 bg-blue-600' : 'bg-slate-300'
                      }`}
                    />
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

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of companies already using Smart Attendance to streamline their workforce management.
        </p>
        <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
          Start Free Trial <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <ContactItem icon={Mail} label="Email" value="support@smartattendance.local" />
          <ContactItem icon={Phone} label="Phone" value="+1 (555) 123-4567" />
          <ContactItem icon={MapPin} label="Address" value="123 Tech Street, San Francisco, CA 94105" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Support Hours</h3>
        <p className="text-blue-100 mb-4">24/7 customer support available</p>
        <div className="space-y-2 text-sm">
          <p>Monday - Friday: 24 hours</p>
          <p>Saturday - Sunday: 24 hours</p>
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-blue-100 rounded-lg p-2">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-slate-900 font-medium">{value}</p>
      </div>
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
      <h3 className="text-2xl font-semibold text-slate-900 mb-6">Send us a Message</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
          <textarea
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            placeholder="How can we help you?"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Send Message
        </button>
      </div>
    </form>
  );
}



// Data
const features = [
  {
    icon: Fingerprint,
    title: 'Biometric Verification',
    desc: 'Advanced fingerprint and facial recognition for secure attendance tracking.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Cloud,
    title: 'Real-time Sync',
    desc: 'Instant data synchronization across all devices and platforms.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Comprehensive reports and insights for better decision making.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Calendar,
    title: 'Leave Management',
    desc: 'Streamlined leave requests and approval workflows.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Shield,
    title: 'Secure & Compliant',
    desc: 'Enterprise-grade security with GDPR and SOC2 compliance.',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: Smartphone,
    title: 'Mobile Access',
    desc: 'Full-featured mobile app for on-the-go attendance management.',
    color: 'from-pink-500 to-rose-500'
  }
];

const services = [
  {
    icon: '📱',
    title: 'Attendance & Devices',
    desc: 'Comprehensive device management and attendance tracking',
    features: ['Biometric verification', 'Offline sync capability', 'Multi-device support']
  },
  {
    icon: '👥',
    title: 'HR & Leaves',
    desc: 'Complete HR management with leave workflows',
    features: ['Leave requests', 'Approval workflows', 'Leave balance tracking']
  },
  {
    icon: '📊',
    title: 'Reports & Analytics',
    desc: 'Powerful reporting tools for insights',
    features: ['Custom reports', 'Export capabilities', 'Real-time analytics']
  }
];

const aboutHighlights = [
  {
    title: 'Founded in 2020',
    desc: 'Started with a mission to simplify attendance tracking'
  },
  {
    title: 'Global Team',
    desc: '50+ employees across 10 countries'
  },
  {
    title: 'Innovation First',
    desc: 'Constantly updating with latest technology'
  }
];

const benefits = [
  {
    title: '99.9% Uptime Guarantee',
    desc: 'Reliable service you can count on'
  },
  {
    title: '24/7 Customer Support',
    desc: 'Round-the-clock assistance for your team'
  },
  {
    title: 'Regular Updates',
    desc: 'New features and improvements monthly'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    position: 'HR Director, TechCorp',
    quote: 'Smart Attendance has transformed how we manage our workforce. The biometric verification is incredibly accurate and the reports are invaluable.',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    name: 'Michael Chen',
    position: 'CEO, InnovateLabs',
    quote: 'The real-time sync and offline capabilities are game-changers. Our remote teams stay connected seamlessly.',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    name: 'Emily Rodriguez',
    position: 'Operations Manager, GlobalTech',
    quote: 'Best decision we made for our HR department. The leave management system alone saved us countless hours.',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    desc: 'Perfect for small teams',
    price: '29',
    features: ['Up to 50 employees', 'Basic reports', 'Email support']
  },
  {
    name: 'Professional',
    desc: 'Ideal for growing companies',
    price: '79',
    popular: true,
    features: ['Up to 200 employees', 'Advanced analytics', 'Priority support', 'API access']
  },
  {
    name: 'Enterprise',
    desc: 'For large organizations',
    price: '199',
    features: ['Unlimited employees', 'Custom reports', 'Dedicated support', 'SLA guarantee']
  }
];

// Add CSS for animations
const styles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
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
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}