import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-pink-50 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">Privacy Policy</h1>
        <p className="mb-4"><strong>Effective Date:</strong> January 8, 2026</p>
        <p className="mb-4">
          At <strong>Cosmo Beauty</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit or make a purchase on our website.
        </p>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">1. Information We Collect</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Personal Information:</strong> Name, email, phone, shipping & billing address.</li>
          <li><strong>Account Information:</strong> Login credentials if you create an account.</li>
          <li><strong>Payment Information:</strong> Payment details for processing orders (handled securely).</li>
          <li><strong>Usage Data:</strong> Website interactions, browsing behavior, and preferences through cookies or analytics tools.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Process and fulfill your orders.</li>
          <li>Send order confirmations, updates, and promotional emails.</li>
          <li>Improve website functionality and user experience.</li>
          <li>Prevent fraud and ensure website security.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">3. Sharing Your Information</h2>
        <p className="mb-4">
          We do <strong>not sell your personal information</strong>. Your data may be shared with:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Service Providers:</strong> Payment gateways, delivery partners, or analytics tools.</li>
          <li><strong>Legal Authorities:</strong> If required by law or to protect our rights.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">4. Cookies</h2>
        <p className="mb-4">We use cookies to enhance your browsing experience. You can disable cookies in your browser settings, but some website features may not function properly.</p>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">5. Data Security</h2>
        <p className="mb-4">We implement industry-standard security measures to protect your data. However, no online platform is 100% secure.</p>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">6. Your Rights</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Access, correct, or delete your personal information.</li>
          <li>Opt-out of marketing communications.</li>
          <li>Request information about how your data is used.</li>
        </ul>
        <p className="mb-4">
          Contact us at <a href="mailto:support@cosmobeauty.com" className="text-pink-600 underline">support@cosmobeauty.com</a> to exercise your rights.
        </p>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">7. Children’s Privacy</h2>
        <p className="mb-4">Our website is not intended for children under 13. We do not knowingly collect personal information from children.</p>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">8. Updates to This Policy</h2>
        <p>We may update this Privacy Policy periodically. Changes will be posted on this page with the updated effective date.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
