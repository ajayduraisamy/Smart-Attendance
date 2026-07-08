import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Cookie } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Section({ title, children }) {
  return (
    <div className="card p-6 mb-5">
      <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      {children}
    </div>
  );
}

function Para({ children }) {
  return <p className="mb-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</p>;
}

function List({ items }) {
  return (
    <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--text-secondary)' }}>
      {items.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
    </ul>
  );
}

function PageHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader icon={Shield} title="Privacy Policy" subtitle="Last updated: July 2026" />

      <Section title="1. Information We Collect">
        <Para>We collect information you provide directly when creating an account, including your name, email address, phone number, and employee credentials. Biometric data (fingerprint templates and facial recognition data) is collected solely for attendance verification purposes.</Para>
        <Para>We also automatically collect device information, IP addresses, browser type, and usage data to improve our service.</Para>
      </Section>

      <Section title="2. How We Use Your Information">
        <Para>Your information is used to:</Para>
        <List items={[
          'Provide and maintain the attendance management service',
          'Process biometric verification for accurate time tracking',
          'Generate reports and analytics for your organization',
          'Communicate important updates and support responses',
          'Ensure security and prevent fraudulent activities',
        ]} />
      </Section>

      <Section title="3. Biometric Data">
        <Para>Biometric data is stored securely using industry-standard encryption. We never share biometric templates with third parties. You may request deletion of your biometric data at any time by contacting your system administrator.</Para>
      </Section>

      <Section title="4. Data Sharing">
        <Para>We do not sell your personal information. Data may be shared with authorized personnel within your organization and with service providers who help us operate the platform under strict confidentiality agreements.</Para>
      </Section>

      <Section title="5. Data Security">
        <Para>We implement appropriate technical and organizational measures to protect your data, including encryption at rest and in transit, regular security audits, and access controls.</Para>
      </Section>

      <Section title="6. Your Rights">
        <Para>You have the right to access, correct, or delete your personal data. Requests can be made through your organization's administrator or by contacting us directly.</Para>
      </Section>

      <Section title="7. Contact">
        <Para>For privacy-related inquiries, contact us at venkatesh@aislyntech.com.</Para>
      </Section>
    </motion.div>
  );
}

export function TermsPolicy() {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader icon={FileText} title="Terms of Service" subtitle="Last updated: July 2026" />

      <Section title="1. Acceptance of Terms">
        <Para>By accessing and using Smart Attendance System, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</Para>
      </Section>

      <Section title="2. Account Registration">
        <Para>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and complete information during registration.</Para>
      </Section>

      <Section title="3. Acceptable Use">
        <Para>You agree to use the service only for lawful purposes and in accordance with these terms. You shall not:</Para>
        <List items={[
          'Use the service for any fraudulent or unauthorized purpose',
          'Attempt to bypass security measures or access unauthorized data',
          'Upload malicious code or interfere with service operations',
          'Share account credentials with unauthorized users',
        ]} />
      </Section>

      <Section title="4. Biometric Data Processing">
        <Para>By using biometric features, you consent to the collection and processing of biometric data for attendance verification. You may opt out by using alternative identification methods provided by your organization.</Para>
      </Section>

      <Section title="5. Intellectual Property">
        <Para>The service, including its code, design, and content, is owned by Smart Attendance System. You are granted a limited, non-exclusive license to use the service for your organization's internal purposes.</Para>
      </Section>

      <Section title="6. Limitation of Liability">
        <Para>Smart Attendance System shall not be liable for indirect, incidental, or consequential damages arising from the use or inability to use the service, to the maximum extent permitted by law.</Para>
      </Section>

      <Section title="7. Termination">
        <Para>We reserve the right to suspend or terminate access to the service for violation of these terms or for extended inactivity. Upon termination, your data will be handled in accordance with our Privacy Policy.</Para>
      </Section>

      <Section title="8. Changes to Terms">
        <Para>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.</Para>
      </Section>
    </motion.div>
  );
}

export function CookiesPolicy() {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader icon={Cookie} title="Cookies Policy" subtitle="Last updated: July 2026" />

      <Section title="1. What Are Cookies">
        <Para>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience.</Para>
      </Section>

      <Section title="2. How We Use Cookies">
        <Para>We use the following types of cookies:</Para>
        <List items={[
          'Essential cookies: Required for the service to function properly (authentication, security)',
          'Preference cookies: Remember your settings and preferences (theme, language)',
          'Analytics cookies: Help us understand how the service is used to improve performance',
        ]} />
      </Section>

      <Section title="3. Third-Party Cookies">
        <Para>We do not use third-party tracking cookies. Analytics are performed using first-party data only.</Para>
      </Section>

      <Section title="4. Managing Cookies">
        <Para>You can control cookies through your browser settings. Disabling essential cookies may affect the functionality of the service.</Para>
      </Section>

      <Section title="5. Updates">
        <Para>This Cookies Policy may be updated periodically. Check this page for the latest information.</Para>
      </Section>

      <Section title="6. Contact">
        <Para>For questions about our use of cookies, contact us at venkatesh@aislyntech.com.</Para>
      </Section>
    </motion.div>
  );
}
