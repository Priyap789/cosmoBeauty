import {
  ShoppingBag,
  User,
  CreditCard,
  Star,
  LogOut,
} from "lucide-react";

export default function ProfileSidebar({ active, setActive }) {
  return (
    <aside className="w-64 bg-white rounded shadow">
      {/* User Header */}
      <div className="flex items-center gap-3 p-5 border-b">
        <img
          src=""
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="text-xs text-gray-500">Hello,</p>
          <p className="text-sm font-semibold">Priya Prajapati</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="text-sm">
        <SidebarItem
          icon={<ShoppingBag size={18} />}
          label="MY ORDERS"
        />

        <SidebarGroup title="ACCOUNT SETTINGS" icon={<User size={18} />}>
          <SidebarSubItem
            label="Profile Information"
            active={active === "profile"}
            onClick={() => setActive("profile")}
          />
          <SidebarSubItem
            label="Manage Addresses"
            active={active === "address"}
            onClick={() => setActive("address")}
          />
        </SidebarGroup>

        <SidebarGroup title="PAYMENTS" icon={<CreditCard size={18} />}>
          <SidebarSubItem label="Saved Cards" />
        </SidebarGroup>

        <SidebarGroup title="MY STUFF" icon={<Star size={18} />}>
          <SidebarSubItem label="My Reviews & Ratings" />
        </SidebarGroup>

        <SidebarItem
          icon={<LogOut size={18} />}
          label="Logout"
          danger
        />
      </nav>
    </aside>
  );
}

/* ===== Components ===== */

const SidebarItem = ({ icon, label, danger }) => (
  <div
    className={`flex items-center gap-3 px-5 py-4 cursor-pointer border-t
      ${danger ? "text-red-500" : "hover:bg-gray-50"}
    `}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

const SidebarGroup = ({ title, icon, children }) => (
  <div className="border-t">
    <div className="flex items-center gap-3 px-5 py-3 text-xs font-semibold text-gray-500">
      {icon}
      {title}
    </div>
    {children}
  </div>
);

const SidebarSubItem = ({ label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`px-12 py-3 cursor-pointer text-sm
      ${
        active
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-600 hover:bg-gray-50"
      }
    `}
  >
    {label}
  </div>
);
