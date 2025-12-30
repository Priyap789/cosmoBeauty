import { useState } from "react";

function PaymentPage() {
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
    
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment submission logic here
    alert("Payment details submitted!");
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4">Payment Details</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name on Card"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={formData.cardNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required

        />
        <div className="flex gap-2">
          <input
            type="text"
            name="expiry"
            placeholder="MM/YY"
            value={formData.expiry}
            onChange={handleChange}
            className="flex-1 border p-2 rounded"
            required
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={formData.cvv}
            onChange={handleChange}
            className="w-20 border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}

export default PaymentPage;
