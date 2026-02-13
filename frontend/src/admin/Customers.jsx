import { useEffect, useState } from "react";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/admin/users"
        );

        const data = await res.json();

        // ✅ SAFETY CHECK
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          setCustomers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <p className="p-4">Loading users...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>

      {customers.length === 0 ? (
        <p className="text-gray-500">No users found</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((user, index) => (
              <tr key={user._id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{user.name || "N/A"}</td>
                <td className="border p-2">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Customers;
