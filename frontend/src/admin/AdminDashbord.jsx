import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  X,
  Edit2,
  Trash2,
} from "lucide-react";

const API_URL = "http://localhost:8000/api/products";

/* -------- CATEGORY DATA (Beauty Shop) -------- */
const CATEGORY_MAP = {
  Skincare: ["Facewash", "Face Scrub", "Face Cream"],
  Makeup: ["Lipstick", "Foundation", "Eyeliner"],
  Haircare: ["Shampoo", "Conditioner", "Hair Oil"],
  Bodycare: ["Body Lotion", "Body Wash", "Body Scrub"],
};

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [totalProducts, setTotalProducts] = useState(0);
  // Fetch total products for dashboard
  const fetchTotalProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/count`);
      const data = await res.json();
      setTotalProducts(data.total);
    } catch (err) {
      console.error("Error fetching total products:", err);
    }
  };

  useEffect(() => {
    fetchTotalProducts();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray text-pink-600 flex flex-col border-r">
        <div className="p-6 text-2xl font-bold">COSMO Admin</div>

        <nav className="flex-1">
          <MenuItem
            icon={<LayoutDashboard />}
            label="Dashboard"
            active={active === "dashboard"}
            onClick={() => setActive("dashboard")}
          />
          <MenuItem
            icon={<Package />}
            label="Products"
            active={active === "products"}
            onClick={() => setActive("products")}
          />
          <MenuItem
            icon={<ShoppingCart />}
            label="Orders"
            active={active === "orders"}
            onClick={() => setActive("orders")}
          />
          <MenuItem
            icon={<Users />}
            label="Users"
            active={active === "users"}
            onClick={() => setActive("users")}
          />
        </nav>

        <button className="m-4 flex items-center gap-2 bg-pink-200 px-4 py-2 rounded-lg">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {active === "dashboard" && <DashboardHome totalProducts={totalProducts} />}
        {active === "products" && <Products updateTotal={fetchTotalProducts} />}
        {active === "orders" && <Orders />}
        {active === "users" && <UsersPage />}
      </main>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function MenuItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-6 py-3 ${
        active ? "bg-pink-200" : ""
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function DashboardHome({ totalProducts }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={totalProducts} />
        <StatCard title="Total Orders" value="—" />
        <StatCard title="Users" value="—" />
        <StatCard title="Revenue" value="—" />
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

/* ---------------- PRODUCTS ---------------- */

function Products({ updateTotal }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    subCategory: "",
    image: "",
    description: "",
  });

  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubCategory, setFilterSubCategory] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filterCategory, filterSubCategory]);

  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
    updateTotal();
  };

  const applyFilters = () => {
    let temp = [...products];
    if (filterCategory) temp = temp.filter((p) => p.category === filterCategory);
    if (filterSubCategory)
      temp = temp.filter((p) => p.subCategory === filterSubCategory);
    setFilteredProducts(temp);
  };

  const handleSave = async () => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });      
    

    setShowModal(false);
    setEditingId(null);
    setNewProduct({
      name: "",
      price: "",
      category: "",
      subCategory: "",
      image: "",
      description: "",
    });

    fetchProducts();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const openEdit = (product) => {
    setEditingId(product._id);
    setNewProduct(product);
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const groupByCategory = (productsArray) => {
    const grouped = {};
    productsArray.forEach((p) => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    return grouped;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2 flex-wrap">
          {/* Main Category Filter */}
          <select
            className="border p-2 rounded"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setFilterSubCategory("");
            }}
          >
            <option value="">All Categories</option>
            {Object.keys(CATEGORY_MAP).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sub Category Filter */}
          <select
            className="border p-2 rounded"
            value={filterSubCategory}
            onChange={(e) => setFilterSubCategory(e.target.value)}
            disabled={!filterCategory}
          >
            <option value="">All Sub Categories</option>
            {filterCategory &&
              CATEGORY_MAP[filterCategory].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>

          <button
            className="bg-pink-600 text-white px-4 py-2 rounded-lg"
            onClick={() => setShowModal(true)}
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        {Object.entries(groupByCategory(filteredProducts)).map(
          ([category, items]) => (
            <div key={category} className="mb-6">
              <h2 className="text-xl font-bold mb-2">{category}</h2>
              <table className="w-full mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Sub Category</th>
                    <th className="p-3">Image</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p._id} className="border-t">
                      <td className="p-3">{p.name}</td>
                      <td className="p-3">₹{p.price}</td>
                      <td className="p-3">{p.subCategory}</td>
                      <td className="p-3">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-12 w-12 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="p-3 flex gap-2 justify-center">
                        <button
                          className="text-blue-600 p-1 rounded hover:bg-blue-100"
                          onClick={() => openEdit(p)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="text-red-600 p-1 rounded hover:bg-red-100"
                          onClick={() => handleDelete(p._id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96 relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setShowModal(false)}
            >
              <X />
            </button>

            <input
              className="border p-2 w-full mb-2"
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />

            {/* MAIN CATEGORY */}
            <select
              className="border p-2 w-full mb-2"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  category: e.target.value,
                  subCategory: "",
                })
              }
            >
              <option value="">Select Main Category</option>
              {Object.keys(CATEGORY_MAP).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* SUB CATEGORY */}
            <select
              className="border p-2 w-full mb-2"
              value={newProduct.subCategory}
              onChange={(e) =>
                setNewProduct({ ...newProduct, subCategory: e.target.value })
              }
              disabled={!newProduct.category}
            >
              <option value="">Select Sub Category</option>
              {newProduct.category &&
                CATEGORY_MAP[newProduct.category].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>

            {/* IMAGE UPLOAD */}
            <input
              type="file"
              accept="image/*"
              className="mb-2"
              onChange={handleImageUpload}
            />
            {newProduct.image && (
              <img
                src={newProduct.image}
                alt="Preview"
                className="h-24 w-24 object-cover rounded mb-2"
              />
            )}

            <button
              className="bg-pink-600 text-white w-full py-2 rounded"
              onClick={handleSave}
            >
              {editingId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- OTHERS ---------------- */

function Orders() {
  return <h1 className="text-2xl font-bold">Orders</h1>;
}

function UsersPage() {
  return <h1 className="text-2xl font-bold">Users</h1>;
}
