export default function ManageAddress() {
  return (
    <>
      <h2 className="text-lg font-semibold mb-6">Manage Addresses</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input className="input" placeholder="Full Name" />
        <input className="input" placeholder="Mobile Number" />
      </div>

      <input className="input mb-4" placeholder="Address (House No, Street)" />

      <div className="grid grid-cols-3 gap-4 mb-4">
        <input className="input" placeholder="City" />
        <input className="input" placeholder="State" />
        <input className="input" placeholder="Pincode" />
      </div>

      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Save Address
        </button>
        <button className="border px-6 py-2 rounded">
          Cancel
        </button>
      </div>
    </>
  );
}
