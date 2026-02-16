import { useEffect, useState, useMemo } from "react";
import { Filter, X } from "lucide-react"; 
import CategoryFilter from "../../components/CategoryFilter";
import ProductGrid from "../../components/ProductGrid";

function ProductsPage() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Brand shadow for black text
  const doubleShadowStyle = {
    textShadow: "2px 2px 0px rgba(168, 85, 247, 0.4), 4px 4px 0px rgba(236, 72, 153, 0.3)"
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedFilters.length === 0) return products;
    return products.filter((p) => selectedFilters.includes(p.subCategory));
  }, [products, selectedFilters]);

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, p) => {
      const key = p.mainCategory || "Uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    }, {});
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-purple-50 relative">
      
      {/* 📱 MOBILE CATEGORIES BUTTON */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full shadow-2xl font-black text-xs tracking-[0.2em] uppercase"
        >
          <Filter size={16} />
          Categories {selectedFilters.length > 0 && `(${selectedFilters.length})`}
        </button>
      </div>

      {/* 📱 MOBILE DRAWER */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              {/* Renamed to Categories */}
              <h2 className="text-pink-600 font-black uppercase text-xs tracking-widest">Categories</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-purple-50 rounded-full">
                <X size={20} className="text-black" />
              </button>
            </div>
            <CategoryFilter selected={selectedFilters} onChange={setSelectedFilters} />
            <button 
               onClick={() => setIsMobileFilterOpen(false)}
               className="w-full mt-6 bg-pink-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs"
            >
              See Products
            </button>
          </div>
        </div>
      )}

      {/* 🟣 MAIN CONTENT */}
      <div className="max-w-[1440px] mx-auto px-4 pt-5 pb-12">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          
          {/* 💻 DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-0 pt-0"> 
              <CategoryFilter
                selected={selectedFilters}
                onChange={setSelectedFilters}
              />
            </div>
          </aside>

          {/* 🟣 PRODUCT GRID */}
          <main className="flex-1 w-full pt-0">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              </div>
            ) : Object.keys(groupedProducts).length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-pink-200 rounded-3xl bg-white/40">
                <p className="text-black font-black uppercase tracking-widest text-xs" style={doubleShadowStyle}>
                  No products found
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedProducts).map(([category, items]) => (
                  <div key={category} className="mt-0">
                    <ProductGrid products={items} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;