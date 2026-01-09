import React from "react";

const TermsConditions = () => {
  return (
    <div className="bg-pink-50 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">Terms & Conditions</h1>
        <p className="mb-4"><strong>Effective Date:</strong> January 8, 2026</p>
        <p className="mb-4">
          Welcome to <strong>Cosmo Beauty</strong>! By using our website, you agree to the following terms and conditions:
        </p>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">1. General</h2>
        <ul className="list-disc list-inside mb-4">
          <li>These terms apply to all visitors, users, and customers of Cosmo Beauty.</li>
          <li>By using the website, you confirm that you are at least 18 years old or have parental consent.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">2. Products and Orders</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Product descriptions, prices, and availability are subject to change without notice.</li>
          <li>Orders are confirmed only after successful payment and confirmation email.</li>
          <li>Cosmo Beauty reserves the right to cancel or refuse orders if necessary.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">3. Payment</h2>
        <p className="mb-4">
          Payments are processed securely through our payment partners. You agree to provide accurate payment information and authorize transactions.
        </p>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">4. Shipping & Delivery</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Shipping times are estimated and may vary.</li>
          <li>Risk of loss or damage passes to the customer upon delivery.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">5. Returns & Refunds</h2>
        <p className="mb-4">
          Returns and refunds are handled as per our Return Policy. Damaged or incorrect products must be reported within <strong>[X] days</strong> of delivery.
        </p>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">6. Intellectual Property</h2>
        <p className="mb-4">
          All content on the website, including images, logos, text, and branding, is owned by Cosmo Beauty or its licensors. You may not copy, reproduce, or use any content without written permission.
        </p>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">7. Limitation of Liability</h2>
        <p className="mb-4">
          Cosmo Beauty is not liable for any indirect, incidental, or consequential damages arising from the use of our website or products.
        </p>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">8. Governing Law</h2>
        <p className="mb-4">
          These terms are governed by the laws of <strong>[Your Country/State]</strong>. Any disputes will be subject to the jurisdiction of <strong>[Your Local Courts]</strong>.
        </p>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">9. Changes to Terms</h2>
        <p className="mb-4">
          We may update these Terms & Conditions from time to time. Updates will be posted on this page.
        </p>

        <h2 className="text-2xl font-semibold text-pink-600 mt-6 mb-3">10. Contact</h2>
        <p>
          For questions regarding these Terms or Privacy Policy, contact us at: <br/>
          <strong>Email:</strong> <a href="mailto:support@cosmobeauty.com" className="text-pink-600 underline">support@cosmobeauty.com</a> <br/>
          <strong>Phone:</strong> [+91-XXXXXXXXXX]
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;
