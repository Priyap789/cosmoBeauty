import { Truck, ShieldCheck, Sparkles } from "lucide-react";

function Features() {
  return (
    <section className="bg-white py-14">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

        {/* Feature 1 */}
        <div>
          <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-pink-100">
            <Truck className="text-pink-500" />
          </div>
          <h3 className="font-semibold text-lg">Free Shipping</h3>
          <p className="text-gray-500 text-sm">On orders above ₹999</p>
        </div>

        {/* Feature 2 */}
        <div>
          <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-pink-100">
            <ShieldCheck className="text-pink-500" />
          </div>
          <h3 className="font-semibold text-lg">100% Authentic</h3>
          <p className="text-gray-500 text-sm">Genuine products guaranteed</p>
        </div>

        {/* Feature 3 */}
        <div>
          <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-pink-100">
            <Sparkles className="text-pink-500" />
          </div>
          <h3 className="font-semibold text-lg">Premium Quality</h3>
          <p className="text-gray-500 text-sm">Tested & certified products</p>
        </div>

      </div>
    </section>
  );
}

export default Features;
