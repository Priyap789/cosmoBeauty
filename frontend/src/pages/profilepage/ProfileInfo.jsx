export default function ProfileInfo() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <button className="text-blue-600 text-sm">Edit</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input className="input" placeholder="First Name" disabled />
        <input className="input" placeholder="Last Name" disabled />
      </div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">Email Address</h2>
        <button className="text-blue-600 text-sm">Edit</button>
      </div>
      <input className="input mb-6" placeholder="Enter email address" disabled />

      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">Mobile Number</h2>
        <button className="text-blue-600 text-sm">Edit</button>
      </div>
      <input className="input mb-6" placeholder="Enter mobile number" disabled />

      <button className="text-red-500 text-sm mt-6">Delete Account</button>
    </>
  );
}
