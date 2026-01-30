import { useState } from "react";
import axios from "axios";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post("http://localhost:8000/api/products/add", form);
    alert("Product Added Successfully");
  };

  return (
    <div className="card">
      <h2>Add Product</h2>

      <input name="name" placeholder="Product Name" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange} />
      <input name="price" placeholder="Price" onChange={handleChange} />
      <input name="category" placeholder="Category" onChange={handleChange} />
      <input name="image" placeholder="Image URL" onChange={handleChange} />

      <button onClick={handleSubmit}>Save Product</button>
    </div>
  );
}
