import { useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, X } from "lucide-react";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray text-pink-600 flex flex-col border-r ">

        <div className="p-6 text-2xl font-bold">COSMO Admin</div>

        <nav className="flex-1">
          <MenuItem icon={<LayoutDashboard />} label="Dashboard" active={active === "dashboard"} onClick={() => setActive("dashboard")} />
          <MenuItem icon={<Package />} label="Products" active={active === "products"} onClick={() => setActive("products")} />
          <MenuItem icon={<ShoppingCart />} label="Orders" active={active === "orders"} onClick={() => setActive("orders")} />
          <MenuItem icon={<Users />} label="Users" active={active === "users"} onClick={() => setActive("users")} />
        </nav>

        <button className="m-4 flex items-center gap-2 bg-pink-700 px-4 py-2 rounded-lg hover:bg-pink-800">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}

      <main className="flex-1 p-6">
        {active === "dashboard" && <DashboardHome />}
        {active === "products" && <Products />}
        {active === "orders" && <Orders />}
        {active === "users" && <UsersPage />}
      </main>
    </div>
  );
}

function MenuItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-pink-700 ${active ? "bg-pink-200" : ""}`}
    >
      {icon}
      {label}
    </button>
  );
}

function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Products" value="120" />
        <StatCard title="Total Orders" value="340" />
        <StatCard title="Users" value="560" />
        <StatCard title="Revenue" value="₹85,000" />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function Products() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([
    {
      name: "Lipstick",
      price: 799,
      mainCategory: "Skincare",
      subCategory: "Face Wash",
      image: null,
      description: "Red matte lipstick",
    },
  ]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    mainCategory: "",
    subCategory: "",
    image: null,
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Categories and subcategories
  const categories = {
    Skincare: ["Face Wash", "Face Cream", "Face Scrub", "Face Serum"],
    Body: ["Body Lotion", "Body Scrub"],
    Haircare: ["Shampoo", "Conditioner", "Hair Oil"],
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setNewProduct({ name: "", price: "", mainCategory: "", subCategory: "", image: null, description: "" });
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (index) => {
    const prod = products[index];
    setEditingIndex(index);
    setNewProduct({ ...prod });
    setImagePreview(prod.image instanceof File ? URL.createObjectURL(prod.image) : prod.image);
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    if (editingIndex !== null) {
      const updated = [...products];
      updated[editingIndex] = newProduct;
      setProducts(updated);
    } else {
      setProducts([...products, newProduct]);
    }
    setNewProduct({ name: "", price: "", mainCategory: "", subCategory: "", image: null, description: "" });
    setImagePreview(null);
    setEditingIndex(null);
    setShowModal(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openAddModal} className="bg-pink-600 text-white px-4 py-2 rounded-lg">
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Main Category</th>
              <th className="p-3 text-left">Subcategory</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">
                  {product.image ? (
                    <img
                      src={product.image instanceof File ? URL.createObjectURL(product.image) : product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">₹{product.price}</td>
                <td className="p-3">{product.mainCategory}</td>
                <td className="p-3">{product.subCategory}</td>
                <td className="p-3">{product.description}</td>
                <td className="p-3 space-x-2">
                  <button className="text-blue-600" onClick={() => openEditModal(idx)}>Edit</button>
                  <button className="text-red-600" onClick={() => setDeleteIndex(idx)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 relative">
            <button className="absolute top-3 right-3 text-gray-600" onClick={() => setShowModal(false)}>
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingIndex !== null ? "Edit Product" : "Add Product"}</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Product Name"
                className="border p-2 rounded"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                className="border p-2 rounded"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <select
                className="border p-2 rounded"
                value={newProduct.mainCategory}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, mainCategory: e.target.value, subCategory: "" })
                }
              >
                <option value="">Select Main Category</option>
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                className="border p-2 rounded"
                value={newProduct.subCategory}
                onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                disabled={!newProduct.mainCategory}
              >
                <option value="">Select Subcategory</option>
                {newProduct.mainCategory &&
                  categories[newProduct.mainCategory].map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
              </select>
              <input type="file" accept="image/*" className="border p-2 rounded" onChange={handleImageChange} />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />
              )}
              <textarea
                placeholder="Description"
                className="border p-2 rounded"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <button className="bg-pink-600 text-white px-4 py-2 rounded-lg mt-2" onClick={handleSaveProduct}>
                {editingIndex !== null ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 text-center">
            <h2 className="text-lg font-bold mb-4">Delete Product?</h2>
            <p className="mb-4">Are you sure you want to delete this product?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={() => {
                  const updated = [...products];
                  updated.splice(deleteIndex, 1);
                  setProducts(updated);
                  setDeleteIndex(null);
                }}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onClick={() => setDeleteIndex(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Orders() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="bg-white p-6 rounded-2xl shadow">
        <p>No orders yet.</p>
      </div>
    </div>
  );
}

function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="bg-white p-6 rounded-2xl shadow">
        <p>User list will appear here.</p>
      </div>
    </div>
  );
}
