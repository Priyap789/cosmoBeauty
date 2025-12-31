import { useState } from "react";

const faqs = [
  {
    question: "Are Cosmo Beauty products safe for all skin types?",
    answer:
      "Yes, our products are dermatologically tested and suitable for most skin types. We recommend a patch test for sensitive skin.",
  },
  {
    question: "Are Cosmo Beauty products cruelty-free?",
    answer:
      "Absolutely. All Cosmo Beauty products are 100% cruelty-free and not tested on animals.",
  },
  {
    question: "Do you use natural ingredients?",
    answer:
      "We use a blend of high-quality natural and science-backed ingredients. Full ingredient lists are available on each product page.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit/debit cards, UPI, net banking, and popular digital wallets.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are usually delivered within 3–7 business days depending on your location.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Returns are accepted for damaged or incorrect products within 7 days of delivery.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-pink-700 mb-8">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-pink-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-800"
              >
                {faq.question}
                <span className="text-pink-600 text-xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

