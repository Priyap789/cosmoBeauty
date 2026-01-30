import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/products/list")
      .then(res => setProducts(res.data));
  }, []);
             
  return (
    <div className="grid">
      {products.map(p => (
        <div className="product-card" key={p._id}>
          <img src={p.image} alt={p.name} />
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <strong>₹{p.price}</strong>
        </div>
      ))}
    </div>
  );
}
