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


/* ================= CONFIG ================= */
const API_URL = "http://localhost:8000/api/products";
const IMAGE_BASE = "http://localhost:8000";

/* ================= CATEGORY DATA ================= */
const CATEGORY_MAP = {
  Skincare: ["Face Wash", "Face Scrub", "Face Cream", "Face Serum"],
  Body: ["Body Lotion", "Body Scrub", "Body Cream"],
  Makeup: ["Lipstick", "Eyes", "Blusher", "Tools"],
  Haircare: [
    "Shampoo",
    "Conditioner",
    "Hair Treatment Cream",
    "Hair Colour Shampoo",
    "Neon Hair Colour Spray",
  ],
};

/* ================= MAIN ================= */
export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchTotalProducts = async () => {
    const res = await fetch(`${API_URL}/count`);
    const data = await res.json();
    setTotalProducts(data.total);
  };

  useEffect(() => {
    fetchTotalProducts();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6 text-2xl font-bold text-pink-600">
          COSMO Admin
        </div>

        <nav>
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

        <button className="m-4 flex items-center gap-2 bg-pink-100 px-4 py-2 rounded">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">
        {active === "dashboard" && (
          <DashboardHome totalProducts={totalProducts} />
        )}
        {active === "products" && (
          <Products updateTotal={fetchTotalProducts} />
        )}
        {active === "orders" && <h1 className="text-2xl font-bold">Orders</h1>}
        {active === "users" && <h1 className="text-2xl font-bold">Users</h1>}
      </main>
    </div>
  );
}

/* ================= UI HELPERS ================= */
function MenuItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-6 py-3 ${
        active ? "bg-pink-100 font-semibold" : ""
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
      <div className="bg-white p-6 rounded shadow w-64">
        <p className="text-gray-500">Total Products</p>
        <h2 className="text-3xl font-bold">{totalProducts}</h2>
      </div>
    </div>
  );
}

/* ================= PRODUCTS ================= */
function Products({ updateTotal }) {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    mainCategory: "",
    subCategory: "",
    description: "",
    imageFile: null,
  });

  const [filterMainCategory, setFilterMainCategory] = useState("");
  const [filterSubCategory, setFilterSubCategory] = useState("");

  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
    updateTotal();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (filterMainCategory && filterSubCategory)
      return (
        p.mainCategory === filterMainCategory &&
        p.subCategory === filterSubCategory
      );
    if (filterMainCategory) return p.mainCategory === filterMainCategory;
    return true;
  });

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (
      !product.name ||
      !product.price ||
      !product.mainCategory ||
      (!editingId && !product.imageFile)
    ) {
      alert("Name, price, category and image are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", Number(product.price));
      formData.append("mainCategory", product.mainCategory);
      formData.append("subCategory", product.subCategory || "");
      formData.append("description", product.description || "");

      if (product.imageFile) {
        formData.append("image", product.imageFile);
      }

      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error("Save failed");

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setProduct({
      name: p.name,
      price: p.price,
      mainCategory: p.mainCategory,
      subCategory: p.subCategory || "",
      description: p.description || "",
      imageFile: null,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingId(null);
    setProduct({
      name: "",
      price: "",
      mainCategory: "",
      subCategory: "",
      description: "",
      imageFile: null,
    });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          className="bg-pink-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Add Product
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 mb-4">
        <select
          className="border p-2"
          value={filterMainCategory}
          onChange={(e) => {
            setFilterMainCategory(e.target.value);
            setFilterSubCategory("");
          }}
        >
          <option value="">All Categories</option>
          {Object.keys(CATEGORY_MAP).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {filterMainCategory && (
          <select
            className="border p-2"
            value={filterSubCategory}
            onChange={(e) => setFilterSubCategory(e.target.value)}
          >
            <option value="">All Sub Categories</option>
            {CATEGORY_MAP[filterMainCategory].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
      </div>

      {/* TABLE */}
      <table className="w-full bg-white rounded shadow text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p._id} className="border-t">
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>
                {p.mainCategory}
                <br />
                <span className="text-xs text-gray-500">{p.subCategory}</span>
              </td>
              <td>
                <img
                  src={`${IMAGE_BASE}${p.image}`}
                  alt={p.name}
                  className="h-12 mx-auto rounded"
                />
              </td>
              <td className="flex justify-center gap-2">
                <Edit2
                  className="text-blue-600 cursor-pointer"
                  onClick={() => openEdit(p)}
                />
                <Trash2
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDelete(p._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 relative">
            <X
              className="absolute top-2 right-2 cursor-pointer"
              onClick={resetForm}
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Name"
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Price"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />

            <select
              className="border p-2 w-full mb-2"
              value={product.mainCategory}
              onChange={(e) =>
                setProduct({
                  ...product,
                  mainCategory: e.target.value,
                  subCategory: "",
                })
              }
            >
              <option value="">Select Category</option>
              {Object.keys(CATEGORY_MAP).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {product.mainCategory && (
              <select
                className="border p-2 w-full mb-2"
                value={product.subCategory}
                onChange={(e) =>
                  setProduct({ ...product, subCategory: e.target.value })
                }
              >
                <option value="">Select Sub Category</option>
                {CATEGORY_MAP[product.mainCategory].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            )}

            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Description"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setProduct({ ...product, imageFile: e.target.files[0] })
              }
            />

            <button
              className="bg-pink-600 text-white w-full py-2 rounded mt-3"
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
