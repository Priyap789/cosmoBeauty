import { useState } from "react";
import ProfileInfo from "./ProfileInfo";
import ManageAddress from "./ManageAddress";
import MyOrders from "./MyOrders";
import MyReviews from "./MyReviews";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="min-h-screen bg-[#f5f3ff] flex justify-center py-10">
      <div className="w-[1100px] bg-white rounded-lg shadow flex">
        
        {/* Sidebar */}
        <div className="w-1/4 border-r">
          <div className="p-5 border-b">
            <p className="text-sm text-gray-500">Hello,</p>
            <p className="font-semibold">Priya Prajapati</p>
          </div>

          <ul className="p-3 text-sm">

            {/* My Orders */}
            <li
              onClick={() => setActiveTab("orders")}
              className={`cursor-pointer px-3 py-2 rounded font-semibold ${
                activeTab === "orders"
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              My Orders
            </li>

            <li className="mt-4 text-gray-500">ACCOUNT SETTINGS</li>

            <li
              onClick={() => setActiveTab("profile")}
              className={`cursor-pointer px-3 py-2 rounded mt-1 ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              Profile Information
            </li>

            <li
              onClick={() => setActiveTab("address")}
              className={`cursor-pointer px-3 py-2 rounded ${
                activeTab === "address"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              Manage Addresses
            </li>

            <li className="mt-6 text-gray-500">PAYMENTS</li>
            <li className="px-3 py-2">Saved Cards</li>

            <li className="mt-6 text-gray-500">MY STUFF</li>

            {/* Reviews */}
            <li
              onClick={() => setActiveTab("reviews")}
              className={`cursor-pointer px-3 py-2 rounded ${
                activeTab === "reviews"
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              My Reviews & Ratings
            </li>

            <li className="mt-6 text-red-500 px-3 py-2 cursor-pointer">
              Logout
            </li>
          </ul>
        </div>

        {/* Right Content */}
        <div className="w-3/4 p-8 bg-gray-50">
          {activeTab === "orders" && <MyOrders />}
          {activeTab === "profile" && <ProfileInfo />}
          {activeTab === "address" && <ManageAddress />}
          {activeTab === "reviews" && <MyReviews />}
        </div>
      </div>
    </div>
  );
}
