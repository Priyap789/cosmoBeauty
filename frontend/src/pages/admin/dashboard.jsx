import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:8000/api/products");
    setProducts(res.data);
  };

  return (
    <>
      <h1>Products</h1>

      <a href="/admin/products/add">
        <button>Add Product</button>
      </a>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
