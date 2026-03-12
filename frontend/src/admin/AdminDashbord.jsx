import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  Fade,

  
} from "@mui/material";

import {
  Dashboard,
  Inventory,
  ShoppingCart,
  People,
  Logout,
  Edit,
  Delete,
  Close,
  Mail,
  Add,
  LocalOffer,
  Info,
  Person,
  Phone,
  Event,
  Reply,
  Message,
  CalendarToday,
  PendingActions,
  CheckCircle,
  Payment, 
  EventNote,
  LocationOn,
} from "@mui/icons-material";

/* ================= CONFIG ================= */
const API_URL = "http://localhost:8000/api/products";
const CUSTOMER_API = "http://localhost:8000/api/admin/users";
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

const drawerWidth = 240;

/* ========= ======== MAIN ================= */
export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
const [totalOrders, setTotalOrders] = useState(0);
const [totalContacts, setTotalContacts] = useState(0);
const [totalReviews, setTotalReviews] = useState(0);
  const fetchTotalProducts = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  setTotalProducts(data.length);
};

const fetchTotalUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(CUSTOMER_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setTotalUsers(data.length);
  } catch (error) {
    console.error(error);
  }
};

const fetchTotalOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      setTotalOrders(data.data.length);
    }
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }
};

const fetchTotalContacts = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/contact/admin/contacts");
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      setTotalContacts(data.data.length);
    }
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
  }
};

const fetchTotalReviews = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/reviews", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      setTotalReviews(data.length);
    }
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }
};
const handleLogout = () => {
  localStorage.removeItem("token"); // remove admin token
  localStorage.removeItem("user");  // optional if stored
  window.location.href = "/home"; // redirect to login page
};

useEffect(() => {
  fetchTotalProducts();
  fetchTotalUsers();
  fetchTotalOrders();
  fetchTotalContacts();
  fetchTotalReviews();
}, []);


  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{ width: drawerWidth, "& .MuiDrawer-paper": { width: drawerWidth } }}
      >
        <Typography sx={{ p: 2, fontWeight: "bold", color: "Blue" }}>
                      COSMO ADMIN
        </Typography>

        <List>
          <SidebarItem
            icon={<Dashboard />}
            label="Dashboard"
            active={active === "dashboard"}
            onClick={() => setActive("dashboard")}
          />
          <SidebarItem
            icon={<Inventory />}
            label="Products"
            active={active === "products"}
            onClick={() => setActive("products")}
          />
          <SidebarItem
          icon={<ShoppingCart />}
          label="Orders"
          active={active === "orders"}
          onClick={() => setActive("orders")}
          />
          <SidebarItem
            icon={<People />}
            label="Users"
            active={active === "users"}
            onClick={() => setActive("users")}
          />
         <SidebarItem 
          icon={<Mail />} 
          label="Contacts" 
          active={active === "contacts"} 
          onClick={() => setActive("contacts")} 
          />
          <SidebarItem
  icon={<Info />}
  label="Reviews"
  active={active === "reviews"}
  onClick={() => setActive("reviews")}
/>


        </List>

        <Button
  startIcon={<Logout />}
  sx={{ m: 2 }}
  variant="outlined"
  onClick={handleLogout}
>
  Logout
</Button>
      </Drawer>

      {/* MAIN */}
      <Box sx={{ flexGrow: 1, p: 3 ,overflowX:'hidden'}}>
        {active === "users" && <Customers />}
        
        {active === "dashboard" && (
  <Box display="flex" gap={3} flexWrap="wrap">
    <Paper sx={{ p: 3, width: 260 }}>
      <Typography color="text.secondary">Total Products</Typography>
      <Typography variant="h4">{totalProducts}</Typography>
    </Paper>

    <Paper sx={{ p: 3, width: 260 }}>
      <Typography color="text.secondary">Total Users</Typography>
      <Typography variant="h4">{totalUsers}</Typography>
    </Paper>

    <Paper sx={{ p: 3, width: 260 }}>
      <Typography color="text.secondary">Total Orders</Typography>
      <Typography variant="h4">{totalOrders}</Typography>
    </Paper>

    <Paper sx={{ p: 3, width: 260 }}>
      <Typography color="text.secondary">Total Contacts</Typography>
      <Typography variant="h4">{totalContacts}</Typography>
    </Paper>

    <Paper sx={{ p: 3, width: 260 }}>
      <Typography color="text.secondary">Total Reviews</Typography>
      <Typography variant="h4">{totalReviews}</Typography>
    </Paper>
  </Box>
)}


        {active === "products" && <Products updateTotal={fetchTotalProducts} />}
        {active === "orders" && <Orders />}
        {active === "contacts" && <Contacts />}
        {active === "reviews" && <Reviews />}
        
      </Box>
    </Box>
  );
}

/* ================= SIDEBAR ITEM ================= */
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <ListItemButton selected={active} onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}
/* ================= CUSTOMERS ================= */
function Customers() {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(CUSTOMER_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the customer and their data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#757575",
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${CUSTOMER_API}/${userId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        setCustomers((prev) => prev.filter((user) => user._id !== userId));

        Swal.fire({
          title: "Deleted!",
          text: "Customer has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Delete failed", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete customer. Try again.",
          icon: "error",
        });
      }
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="700" color="primary">
          Customer Directory
        </Typography>
        <Chip
          label={`${customers.length} Total Users`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: "bold" }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#5f6368" }}>User Info</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#5f6368" }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#5f6368" }}>Location</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#5f6368" }}>Joined Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "#5f6368" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.length > 0 ? (
              customers.map((u) => (
                <TableRow
                  key={u._id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
                        {u.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {u.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          <Mail sx={{ fontSize: 12 }} />
                          {u.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Phone sx={{ fontSize: 16, color: "gray" }} /> {u.mobile || "N/A"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        {u.addresses?.[0]?.city || "No City"}
                      </Typography>
                      <Tooltip title={u.addresses?.[0]?.address || "No address provided"}>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{
                            display: "block",
                            maxWidth: 180,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {u.addresses?.[0]?.address || "-"}
                        </Typography>
                      </Tooltip>
                      {u.addresses?.[0]?.pincode && (
                        <Chip
                          label={u.addresses[0].pincode}
                          size="small"
                          variant="outlined"
                          sx={{ mt: 0.5, height: 20, fontSize: "0.7rem" }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Event sx={{ fontSize: 16 }} />{" "}
                      {new Date(u.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Delete Customer">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteUser(u._id)}
                        sx={{
                          backgroundColor: "rgba(211, 47, 47, 0.04)",
                          "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Person sx={{ fontSize: 48, color: "divider", mb: 1 }} />
                  <Typography color="textSecondary">
                    No customers found in the database.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}


/* ================= PRODUCTS ================= */
/* ================= PRODUCTS ================= */
function Products({ updateTotal }) {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [product, setProduct] = useState({ name: "", price: "", mainCategory: "", subCategory: "", description: "", ingredients: "", howToUse: "", imageFiles: [], mainImageIndex: 0, discountPercentage: "", isActive: false, startDate: "", endDate: "" });
  const [filterMainCategory, setFilterMainCategory] = useState("");
  const [filterSubCategory, setFilterSubCategory] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
      if (updateTotal) updateTotal();
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = products.filter((p) => {
    if (filterMainCategory && filterSubCategory) return p.mainCategory === filterMainCategory && p.subCategory === filterSubCategory;
    if (filterMainCategory) return p.mainCategory === filterMainCategory;
    return true;
  });

  const handleSave = async () => {
    const formData = new FormData();
    Object.keys(product).forEach(key => { if (key !== 'imageFiles') formData.append(key, product[key]); });
    product.imageFiles.forEach((img) => formData.append("images", img));
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";
    await fetch(url, { method, body: formData });
    resetForm();
    fetchProducts();
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setProduct({ name: p.name, price: p.price, mainCategory: p.mainCategory, subCategory: p.subCategory, description: p.description, ingredients: Array.isArray(p.ingredients) ? p.ingredients.join(", ") : (p.ingredients || ""), howToUse: p.howToUse || "", imageFiles: [], mainImageIndex: 0, discountPercentage: p.offer?.discountPercentage || "", isActive: p.offer?.isActive || false, startDate: p.offer?.startDate?.split("T")[0] || "", endDate: p.offer?.endDate?.split("T")[0] || "" });
    setOpen(true);
  };

  const resetForm = () => {
    setOpen(false);
    setEditingId(null);
    setProduct({ name: "", price: "", mainCategory: "", subCategory: "", description: "", ingredients: "", howToUse: "", imageFiles: [], mainImageIndex: 0, discountPercentage: "", isActive: false, startDate: "", endDate: "" });
  };

  const handleDelete = async (id) => { if (window.confirm("Are you sure?")) { await fetch(`${API_URL}/${id}`, { method: "DELETE" }); fetchProducts(); } };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="700" color="primary">Product Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingId(null); setOpen(true); }} sx={{ borderRadius: 2, px: 4, py: 1.2, boxShadow: 3 }}>Add Product</Button>
      </Box>
      <Box display="flex" gap={2} mb={3} sx={{ backgroundColor: "#fff", p: 2, borderRadius: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <Select size="small" value={filterMainCategory} displayEmpty onChange={(e) => { setFilterMainCategory(e.target.value); setFilterSubCategory(""); }} sx={{ minWidth: 200 }}>
          <MenuItem value="">All Categories</MenuItem>
          {Object.keys(CATEGORY_MAP).map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
        </Select>
        {filterMainCategory && (
          <Select size="small" value={filterSubCategory} displayEmpty onChange={(e) => setFilterSubCategory(e.target.value)} sx={{ minWidth: 200 }}>
            <MenuItem value="">All Sub Categories</MenuItem>
            {CATEGORY_MAP[filterMainCategory].map((s) => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
          </Select>
        )}
      </Box>
<TableContainer
  component={Paper}
  sx={{
    borderRadius: 3,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    maxHeight: 370, // Increased height for better view
    overflowX: "auto",
    width: "100%",
    "&::-webkit-scrollbar": { height: 8, width: 8 },
    "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: 4 }
  }}
>
  <Table stickyHeader size="medium">
    <TableHead>
      <TableRow>
        {["Name", "Price", "Main Category", "Sub Category", "Description", "Ingredients", "How To Use", "Offer", "Images"].map((head) => (
          <TableCell 
            key={head} 
            sx={{ 
              fontWeight: 800, 
              backgroundColor: "#f8f9fa", 
              color: "#495057",
              whiteSpace: "nowrap"
            }}
          >
            {head}
          </TableCell>
        ))}
        <TableCell
          align="right"
          sx={{
            fontWeight: 800,
            position: "sticky",
            right: 0,
            background: "#f8f9fa",
            zIndex: 3,
            boxShadow: "-2px 0 5px rgba(0,0,0,0.05)"
          }}
        >
          Actions
        </TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredProducts.map((p) => (
        <TableRow 
          key={p._id} 
          hover 
          sx={{ 
            height: 80, // Forces consistent height
            '&:last-child td, &:last-child th': { border: 0 } 
          }}
        >
          {/* Name */}
          <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>{p.name}</TableCell>

          {/* Price */}
          <TableCell sx={{ minWidth: 100 }}>
            {p.offer?.isActive ? (
              <Box>
                <Typography sx={{ textDecoration: "line-through", fontSize: "0.75rem", color: "text.secondary" }}>
                  ₹{p.price}
                </Typography>
                <Typography fontWeight="bold" color="error.main">
                  ₹{p.offer.offerPrice}
                </Typography>
              </Box>
            ) : (
              <Typography fontWeight="bold">₹{p.price}</Typography>
            )}
          </TableCell>

          <TableCell>{p.mainCategory}</TableCell>
          <TableCell>{p.subCategory}</TableCell>

          {/* Description - Clamped to 1 line */}
          <TableCell sx={{ maxWidth: 200 }}>
            <Tooltip title={p.description} arrow>
              <Typography variant="body2" sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4
              }}>
                {p.description}
              </Typography>
            </Tooltip>
          </TableCell>

          {/* Ingredients - Clamped */}
          <TableCell sx={{ maxWidth: 200 }}>
            <Tooltip title={Array.isArray(p.ingredients) ? p.ingredients.join(", ") : p.ingredients} arrow>
              <Typography variant="body2" noWrap sx={{ textOverflow: 'ellipsis' }}>
                {Array.isArray(p.ingredients) ? p.ingredients.join(", ") : p.ingredients}
              </Typography>
            </Tooltip>
          </TableCell>

          {/* How To Use - Clamped */}
          <TableCell sx={{ maxWidth: 200 }}>
            <Tooltip title={p.howToUse} arrow>
              <Typography variant="body2" noWrap sx={{ textOverflow: 'ellipsis' }}>
                {p.howToUse}
              </Typography>
            </Tooltip>
          </TableCell>

          {/* Offer */}
          <TableCell>
            {p.offer?.isActive ? (
              <Chip
                icon={<LocalOffer style={{ fontSize: 14 }} />}
                label={`${p.offer.discountPercentage}% OFF`}
                color="success"
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            ) : (
              <Typography variant="caption" color="text.disabled">No Offer</Typography>
            )}
          </TableCell>

          {/* Images */}
          <TableCell sx={{ minWidth: 220, maxWidth: 300 }}>
  <Box
    sx={{
      display: "flex",
      gap: 1,
      overflowX: "auto", // Allows horizontal scrolling for many images
      pb: 0.5, // Space for the scrollbar
      alignItems: "center",
      // Custom slim scrollbar for a cleaner look
      "&::-webkit-scrollbar": { height: 4 },
      "&::-webkit-scrollbar-thumb": { backgroundColor: "#ddd", borderRadius: 2 }
    }}
  >
    {p.images?.map((img, i) => (
      <Tooltip key={i} title={img === p.mainImage ? "Main Image" : ""} arrow>
        <Avatar
          src={`${IMAGE_BASE}${img}`}
          variant="rounded"
          sx={{
            width: 45,
            height: 45,
            flexShrink: 0, // Prevents images from squeezing
            border: img === p.mainImage 
              ? "2px solid #2e7d32" 
              : "1px solid #e0e0e0",
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.1)", zIndex: 1 }
          }}
        />
      </Tooltip>
    ))}
    {(!p.images || p.images.length === 0) && (
      <Typography variant="caption" color="text.disabled">No Images</Typography>
    )}
  </Box>
</TableCell>

          {/* Actions - Sticky Right */}
          <TableCell
            align="right"
            sx={{
              position: "sticky",
              right: 0,
              background: "#fff",
              zIndex: 2,
              boxShadow: "-2px 0 5px rgba(0,0,0,0.05)"
            }}
          >
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={() => openEdit(p)} color="primary" size="small">
                <Edit fontSize="small" />
              </IconButton>
              <IconButton onClick={() => handleDelete(p._id)} color="error" size="small">
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
      <Dialog open={open} onClose={resetForm} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">{editingId ? "Edit Product" : "Add New Product"}</Typography>
          <IconButton onClick={resetForm} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
            <TextField label="Product Name" fullWidth size="small" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} sx={{ gridColumn: "span 2" }} />
            <TextField label="Base Price (₹)" type="number" fullWidth size="small" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
            <TextField label="Discount %" type="number" fullWidth size="small" value={product.discountPercentage} onChange={(e) => setProduct({ ...product, discountPercentage: e.target.value })} />
            <Select fullWidth size="small" value={product.mainCategory} displayEmpty onChange={(e) => setProduct({ ...product, mainCategory: e.target.value, subCategory: "" })}>
              <MenuItem value="">Select Category</MenuItem>
              {Object.keys(CATEGORY_MAP).map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
            </Select>
            <Select fullWidth size="small" value={product.subCategory} displayEmpty disabled={!product.mainCategory} onChange={(e) => setProduct({ ...product, subCategory: e.target.value })}>
              <MenuItem value="">Select Sub Category</MenuItem>
              {product.mainCategory && CATEGORY_MAP[product.mainCategory].map((s) => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
            </Select>
            <Box sx={{ gridColumn: "span 2", p: 2, bgcolor: "#fff8e1", borderRadius: 2, border: "1px dashed #ffa000" }}>
              <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center" color="#b45309"><LocalOffer sx={{ mr: 1, fontSize: 18 }} /> Offer Schedule</Typography>
              <Box display="flex" gap={2}>
                <TextField label="Start Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={product.startDate} onChange={(e) => setProduct({ ...product, startDate: e.target.value })} />
                <TextField label="End Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={product.endDate} onChange={(e) => setProduct({ ...product, endDate: e.target.value })} />
              </Box>
              <Select fullWidth size="small" sx={{ mt: 1.5, bgcolor: "white" }} value={product.isActive ? "true" : "false"} onChange={(e) => setProduct({ ...product, isActive: e.target.value === "true" })}>
                <MenuItem value="false">Offer Disabled</MenuItem>
                <MenuItem value="true">Activate Offer Now</MenuItem>
              </Select>
            </Box>
            <TextField label="Description" fullWidth multiline rows={2} size="small" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} sx={{ gridColumn: "span 2" }} />
            <TextField label="Ingredients" fullWidth size="small" placeholder="Aloe, Water, Glycerin..." value={product.ingredients} onChange={(e) => setProduct({ ...product, ingredients: e.target.value })} sx={{ gridColumn: "span 2" }} />
            <TextField label="How To Use" fullWidth multiline rows={2} size="small" value={product.howToUse} onChange={(e) => setProduct({ ...product, howToUse: e.target.value })} sx={{ gridColumn: "span 2" }} />
            <Box sx={{ gridColumn: "span 2" }}>
              <Button variant="outlined" component="label" fullWidth sx={{ mb: 1 }}>Upload Images <input type="file" hidden multiple accept="image/*" onChange={(e) => setProduct({ ...product, imageFiles: Array.from(e.target.files), mainImageIndex: 0 })} /></Button>
              <Box display="flex" gap={1} flexWrap="wrap">
                {product.imageFiles.map((img, idx) => (
                  <Box key={idx} onClick={() => setProduct({ ...product, mainImageIndex: idx })} sx={{ position: "relative", cursor: "pointer", border: idx === product.mainImageIndex ? "2px solid #2e7d32" : "1px solid #ccc", borderRadius: 1, p: 0.5 }}>
                    <img src={URL.createObjectURL(img)} alt="" width="50" height="50" style={{ objectFit: "cover" }} />
                    {idx === product.mainImageIndex && <Chip label="Main" size="small" color="success" sx={{ position: "absolute", top: -10, left: -5, height: 16, fontSize: 10 }} />}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={resetForm} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSave} size="large" sx={{ px: 4 }}>{editingId ? "Update Product" : "Save Product"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
/*---------Contacts function------------*/

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedContactId, setSelectedContactId] = useState("");

  const fetchContacts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/contact/admin/contacts");
      const data = await res.json();
      setContacts(data.data);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const sendReply = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/contact/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: selectedContactId, replyMessage }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Reply Sent",
          text: "Your reply has been sent successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchContacts();
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.message });
      }
    } catch (err) {
      console.error("Reply failed:", err);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to send reply!" });
    } finally {
      setReplyOpen(false);
      setReplyMessage("");
    }
  };

  const deleteContact = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the contact message!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#757575",
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:8000/api/contact/admin/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setContacts((prev) => prev.filter((c) => c._id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Contact message has been deleted.",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({ icon: "error", title: "Error", text: data.message });
        }
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to delete contact!" });
      }
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="700" color="primary">
          Inquiries & Support
        </Typography>
        <Chip
          label={`${contacts.filter(c => c.status === "Pending").length} New Messages`}
          color="warning"
          sx={{ fontWeight: "bold" }}
        />
      </Box>

     <TableContainer
      component={Paper}
      sx={{
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        maxHeight: 600,
        overflow: 'auto',
        border: '1px solid #edf2f7',
      }}
    >
      <Table stickyHeader sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700, color: '#475569', py: 2 }}>SENDER</TableCell>
            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700, color: '#475569', py: 2 }}>MESSAGE PREVIEW</TableCell>
            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700, color: '#475569', py: 2 }}>STATUS</TableCell>
            <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 700, color: '#475569', py: 2 }}>RECEIVED ON</TableCell>
            <TableCell align="center" sx={{ bgcolor: '#f8fafc', fontWeight: 700, color: '#475569', py: 2 }}>ACTIONS</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {contacts.map((c) => (
            <TableRow 
              key={c._id} 
              hover 
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                transition: 'background-color 0.2s',
                backgroundColor: c.status === "Pending" ? '#ffffff' : '#fcfcfc'
              }}
            >
              {/* SENDER INFO */}
              <TableCell sx={{ py: 2.5 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar 
                    sx={{ 
                      bgcolor: c.status === "Pending" ? 'primary.main' : 'grey.400', 
                      width: 42, 
                      height: 42, 
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  >
                    {c.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                      {c.name}
                    </Typography>
                    <Box display="flex" flexDirection="column" mt={0.5}>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Mail sx={{ fontSize: 13, color: 'primary.light' }} /> {c.email}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Phone sx={{ fontSize: 13, color: 'success.light' }} /> {c.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </TableCell>

              {/* MESSAGE CONTENT */}
              <TableCell sx={{ maxWidth: 300 }}>
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <Message sx={{ fontSize: 16, color: '#cbd5e1', mt: 0.3 }} />
                  <Tooltip title={c.message} placement="top" arrow TransitionComponent={Fade}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#475569',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                        cursor: 'help'
                      }}
                    >
                      {c.message}
                    </Typography>
                  </Tooltip>
                </Box>
              </TableCell>

              {/* STATUS CHIP */}
              <TableCell>
                <Chip
                  icon={c.status === "Pending" ? <PendingActions sx={{ fontSize: '1rem !important' }} /> : <CheckCircle sx={{ fontSize: '1rem !important' }} />}
                  label={c.status}
                  size="small"
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    borderRadius: '8px',
                    px: 0.5,
                    bgcolor: c.status === "Pending" ? '#fff7ed' : '#f0fdf4',
                    color: c.status === "Pending" ? '#c2410c' : '#15803d',
                    border: '1px solid',
                    borderColor: c.status === "Pending" ? '#ffedd5' : '#dcfce7'
                  }}
                />
              </TableCell>

              {/* DATE */}
              <TableCell>
                <Box display="flex" alignItems="center" gap={1} sx={{ color: '#64748b' }}>
                  <CalendarToday sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {new Date(c.createdAt).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </Typography>
                </Box>
              </TableCell>

              {/* ACTIONS */}
              <TableCell align="center">
                <Box display="flex" justifyContent="center" gap={1.5}>
                  <Tooltip title={c.status === "Replied" ? "Message handled" : "Compose Reply"}>
                    <span>
                      <IconButton
                        size="small"
                        disabled={c.status === "Replied"}
                        onClick={() => { setSelectedContactId(c._id); setReplyOpen(true); }}
                        sx={{ 
                          bgcolor: c.status === "Replied" ? '#f1f5f9' : '#eff6ff',
                          color: 'primary.main',
                          '&:hover': { bgcolor: '#dbeafe' }
                        }}
                      >
                        <Reply fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  
                  <Tooltip title="Delete Permanently">
                    <IconButton
                      size="small"
                      onClick={() => deleteContact(c._id)}
                      sx={{ 
                        bgcolor: '#fef2f2',
                        color: 'error.main',
                        '&:hover': { bgcolor: '#fee2e2' }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}

          {contacts.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 12 }}>
                <Box sx={{ opacity: 0.5 }}>
                  <Mail sx={{ fontSize: 48, mb: 1, color: '#cbd5e1' }} />
                  <Typography variant="h6" fontWeight="bold" color="text.secondary">
                    Your inbox is empty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check back later for new messages.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

      <Dialog open={replyOpen} onClose={() => setReplyOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Message color="primary" /> 
            <Typography variant="h6" fontWeight="bold">Compose Reply</Typography>
          </Box>
          <IconButton onClick={() => setReplyOpen(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="caption" color="textSecondary" gutterBottom>
            The user will receive this reply via their registered email address.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            placeholder="Write your message here..."
            sx={{ mt: 2 }}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setReplyOpen(false)} color="inherit" sx={{ fontWeight: "bold" }}>Cancel</Button>
          <Button
            variant="contained"
            endIcon={<Reply />}
            onClick={sendReply}
            disabled={!replyMessage.trim()}
            sx={{ px: 4, borderRadius: 2, fontWeight: "bold" }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log("Orders Fetch Error:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ FILTER LOGIC
  const filteredOrders = orders.filter((o) => {
    if (filter === "All") return true;
    if (filter === "Processing") return o.deliveryStatus === "Processing";
    if (filter === "Delivered") return o.deliveryStatus === "Delivered";
    if (filter === "Cancelled") return o.deliveryStatus === "Cancelled";
    if (filter === "Paid") return o.paymentStatus === "paid";
    if (filter === "Pending") return o.paymentStatus !== "paid";
    return true;
  });

  return (
    <>
      <Typography variant="h5" mb={2}>
        Orders
      </Typography>

      {/* FILTER BUTTONS */}
      <Box mb={2} display="flex" gap={2} flexWrap="wrap">
        <Button
          variant={filter === "All" ? "contained" : "outlined"}
          onClick={() => setFilter("All")}
        >
          All Orders
        </Button>

        <Button
          variant={filter === "Processing" ? "contained" : "outlined"}
          onClick={() => setFilter("Processing")}
        >
          Processing
        </Button>

        <Button
          variant={filter === "Delivered" ? "contained" : "outlined"}
          onClick={() => setFilter("Delivered")}
        >
          Delivered
        </Button>

        <Button
          variant={filter === "Cancelled" ? "contained" : "outlined"}
          onClick={() => setFilter("Cancelled")}
        >
          Cancelled
        </Button>

        <Button
          variant={filter === "Paid" ? "contained" : "outlined"}
          onClick={() => setFilter("Paid")}
        >
          Paid
        </Button>

        <Button
          variant={filter === "Pending" ? "contained" : "outlined"}
          onClick={() => setFilter("Pending")}
        >
          Unpaid
        </Button>
      </Box>

<TableContainer
      component={Paper}
      sx={{
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        maxHeight: "75vh", // Adjusted for better viewing
        width: "100%",
        overflow: "auto",
        border: "1px solid #eee"
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ "& th": { backgroundColor: "#f8f9fa", fontWeight: "bold", fontSize: "0.85rem", color: "#555" } }}>
            <TableCell>Order Info</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell sx={{ minWidth: 250 }}>Items</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Payment Detail</TableCell>
            <TableCell>Logistics</TableCell>
            <TableCell>Status & Actions</TableCell>
            <TableCell>Cancellation Info</TableCell>
            <TableCell align="center">Refund</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredOrders.map((o) => (
            <TableRow
              key={o._id}
              hover
              sx={{
                transition: "0.3s",
                backgroundColor: o.deliveryStatus === "Cancelled" ? "#fffcfc" : "inherit",
                "&:hover": { backgroundColor: "#fbfcfe !important" }
              }}
            >
              {/* ORDER INFO */}
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: "bold", color: "#333" }}>
                  #{o._id.slice(-6).toUpperCase()}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5, color: "text.secondary" }}>
                  <EventNote sx={{ fontSize: 14 }} />
                  <Typography variant="caption">{new Date(o.createdAt).toLocaleDateString()}</Typography>
                </Box>
              </TableCell>

              {/* CUSTOMER */}
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 30, height: 30, fontSize: "0.8rem", bgcolor: "#9c27b0" }}>
                    {o.userId?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{o.userId?.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{o.userId?.email}</Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* ITEMS */}
              <TableCell>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {o.items?.map((item, index) => (
                    <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <img
                        src={`http://localhost:8000${item.productId?.mainImage || item.productId?.images?.[0] || item.mainImage}`}
                        alt=""
                        style={{ width: 40, height: 40, borderRadius: "8px", objectFit: "cover", border: "1px solid #eee" }}
                      />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, display: "block", lineHeight: 1.2 }}>
                          {item.productId?.name || item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ₹{item.productId?.price || item.price} × {item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </TableCell>

              {/* AMOUNT */}
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                  ₹{o.amount.toLocaleString()}
                </Typography>
              </TableCell>

              {/* PAYMENT DETAIL */}
              <TableCell>
                <Chip 
                  label={o.paymentStatus === "paid" ? "Paid" : "Pending"} 
                  size="small"
                  color={o.paymentStatus === "paid" ? "success" : "warning"}
                  variant="outlined"
                  sx={{ mb: 1, height: 20, fontSize: "10px", fontWeight: "bold" }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: o.paymentMethod === "COD" ? "#1976d2" : "#9c27b0" }}>
                  <Payment sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>{o.paymentMethod}</Typography>
                </Box>
              </TableCell>

              {/* LOGISTICS */}
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 14, color: "#666" }} />
                  <Typography variant="caption" color="text.secondary">{o.shipping?.city || "N/A"}</Typography>
                </Box>
              </TableCell>

              {/* DELIVERY STATUS SELECT */}
              <TableCell>
                <Select
                  value={o.deliveryStatus || "Processing"}
                  size="small"
                  disabled={o.deliveryStatus === "Delivered" || o.deliveryStatus === "Cancelled"}
                  sx={{ 
                    fontSize: "0.75rem", 
                    minWidth: 130, 
                    borderRadius: "8px",
                    bgcolor: "white",
                    "& .MuiSelect-select": { py: 0.5 }
                  }}
                  onChange={async (e) => {
                    const token = localStorage.getItem("token");
                    await fetch(`http://localhost:8000/api/admin/orders/${o._id}/delivery-status`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ deliveryStatus: e.target.value }),
                    });
                    fetchOrders();
                    Swal.fire({ icon: "success", title: "Updated", timer: 1000, showConfirmButton: false });
                  }}
                >
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </TableCell>

              {/* CANCELLATION INFO */}
              <TableCell>
                {o.deliveryStatus === "Cancelled" ? (
                  <Box>
                    <Chip label={`By ${o.cancelledBy}`} size="small" color="error" sx={{ height: 18, fontSize: "9px", mb: 0.5 }} />
                    <Tooltip title={o.cancelReason || "No reason"}>
                      <Typography variant="caption" sx={{ display: "block", color: "#d32f2f", fontStyle: "italic", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {o.cancelReason || "No reason"}
                      </Typography>
                    </Tooltip>
                  </Box>
                ) : "-"}
              </TableCell>

              {/* REFUND ACTION */}
              <TableCell align="center">
                {o.deliveryStatus === "Cancelled" && o.paymentMethod === "ONLINE" && !o.refundStatus && (
                  <Button
                    variant="contained"
                    size="tiny"
                    sx={{ textTransform: "none", fontSize: "10px", borderRadius: "6px", bgcolor: "#7b1fa2", "&:hover": { bgcolor: "#4a0072" } }}
                    onClick={async () => {
                      const confirm = await Swal.fire({
                        title: "Send Refund Email?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, Send",
                        confirmButtonColor: "#7b1fa2"
                      });
                      if (!confirm.isConfirmed) return;
                      const token = localStorage.getItem("token");
                      await fetch(`http://localhost:8000/api/admin/orders/${o._id}/send-refund`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      Swal.fire({ icon: "success", title: "Email Sent", timer: 1500, showConfirmButton: false });
                      fetchOrders();
                    }}
                  >
                    Send Refund
                  </Button>
                )}
                {o.refundStatus && (
                  <Chip 
                    label={o.refundStatus.toUpperCase()} 
                    size="small" 
                    variant="outlined"
                    color={o.refundStatus === "completed" ? "success" : "warning"}
                    sx={{ fontSize: "9px", fontWeight: "bold" }}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}
function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  // Replace this with your actual API URL for products
  const API_URL = "http://localhost:8000/api/products";

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all reviews
  const fetchAllReviews = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/reviews");
      const data = await res.json();
      setAllReviews(data);
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
    fetchAllReviews();
  }, []);

  // Filter reviews by selected product
  useEffect(() => {
    if (selectedProduct) {
      setReviews(allReviews.filter((r) => r.product === selectedProduct));
    } else {
      setReviews(allReviews);
    }
  }, [selectedProduct, allReviews]);

  return (
    <Box sx={{ p: 3, minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Typography variant="h4" fontWeight="700" color="primary" mb={3}>
        Product Reviews
      </Typography>

      <Select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        displayEmpty
        sx={{ mb: 3, minWidth: 300 }}
      >
        <MenuItem value="">All Products</MenuItem>
        {products.map((p) => (
          <MenuItem key={p._id} value={p._id}>
            {p.name}
          </MenuItem>
        ))}
      </Select>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f1f3f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>User Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Comment</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <TableRow key={r._id} hover>
                  <TableCell>{r.user?.name || "Deleted User"}</TableCell>
                  <TableCell>{r.product?.name || "Deleted Product"}</TableCell>
                  <TableCell>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} style={{ color: i < r.rating ? "#ffb400" : "#ccc" }}>
                        ★
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>{r.comment || "-"}</TableCell>
                  <TableCell>
                    {new Date(r.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  No reviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
