import { useState, useEffect } from "react";
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

  const fetchTotalProducts = async () => {
    const res = await fetch(`${API_URL}`);
    const data = await res.json();
    setTotalProducts(data.length);
  };

  useEffect(() => {
    fetchTotalProducts();
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{ width: drawerWidth, "& .MuiDrawer-paper": { width: drawerWidth } }}
      >
        <Typography sx={{ p: 2, fontWeight: "bold", color: "deeppink" }}>
          COSMO Admin
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
          <SidebarItem icon={<ShoppingCart />} label="Orders" />
          <SidebarItem
            icon={<People />}
            label="Users"
            active={active === "users"}
            onClick={() => setActive("users")}
          />

        </List>

        <Button startIcon={<Logout />} sx={{ m: 2 }} variant="outlined">
          Logout
        </Button>
      </Drawer>

      {/* MAIN */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {active === "users" && <Customers />}

        {active === "dashboard" && (
          <Paper sx={{ p: 3, width: 260 }}>
            <Typography color="text.secondary">Total Products</Typography>
            <Typography variant="h4">{totalProducts}</Typography>
          </Paper>
        )}

        {active === "products" && <Products updateTotal={fetchTotalProducts} />}
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

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(CUSTOMER_API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <>
      <Typography variant="h5" mb={2}>Customers</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.length > 0 ? (
              customers.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}



/* ================= PRODUCTS ================= */
/* ================= PRODUCTS ================= */
function Products({ updateTotal }) {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [product, setProduct] = useState({
  name: "",
  price: "",
  mainCategory: "",
  subCategory: "",
  description: "",
  ingredients: "",
  howToUse: "",
  imageFiles: [],
  mainImageIndex: 0,

  // 🔥 OFFER FIELDS
  discountPercentage: "",
  isActive: false,
  startDate: "",
  endDate: "",
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
  const formData = new FormData();

  formData.append("name", product.name);
  formData.append("price", product.price);
  formData.append("mainCategory", product.mainCategory);
  formData.append("subCategory", product.subCategory);
  formData.append("description", product.description);
  formData.append("ingredients", product.ingredients);
  formData.append("howToUse", product.howToUse);

  // 🔥 OFFER DATA
  formData.append("discountPercentage", product.discountPercentage);
  formData.append("isActive", product.isActive);
  formData.append("startDate", product.startDate);
  formData.append("endDate", product.endDate);

  product.imageFiles.forEach((img) => {
    formData.append("images", img);
  });

  const url = editingId ? `${API_URL}/${editingId}` : API_URL;
  const method = editingId ? "PUT" : "POST";

  await fetch(url, { method, body: formData });

  resetForm();
  fetchProducts();
};

  const openEdit = (p) => {
  setEditingId(p._id);

  setProduct({
    name: p.name,
    price: p.price,
    mainCategory: p.mainCategory,
    subCategory: p.subCategory,
    description: p.description,
    ingredients: p.ingredients?.join(", ") || "",
    howToUse: p.howToUse || "",
    imageFiles: [],
    mainImageIndex: 0,

    // 🔥 Load Offer Data
    discountPercentage: p.offer?.discountPercentage || "",
    isActive: p.offer?.isActive || false,
    startDate: p.offer?.startDate?.split("T")[0] || "",
    endDate: p.offer?.endDate?.split("T")[0] || "",
  });

  setOpen(true);
};


  const resetForm = () => {
  setOpen(false);
  setEditingId(null);

  setProduct({
    name: "",
    price: "",
    mainCategory: "",
    subCategory: "",
    description: "",
    ingredients: "",
    howToUse: "",
    imageFiles: [],
    mainImageIndex: 0,

    discountPercentage: "",
    isActive: false,
    startDate: "",
    endDate: "",
  });
};


  return (
    <>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Products</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Product
        </Button>
      </Box>

      {/* FILTERS */}
      <Box display="flex" gap={2} mb={2}>
        <Select
          value={filterMainCategory}
          displayEmpty
          onChange={(e) => {
            setFilterMainCategory(e.target.value);
            setFilterSubCategory("");
          }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {Object.keys(CATEGORY_MAP).map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>

        {filterMainCategory && (
          <Select
            value={filterSubCategory}
            displayEmpty
            onChange={(e) => setFilterSubCategory(e.target.value)}
          >
            <MenuItem value="">All Sub Categories</MenuItem>
            {CATEGORY_MAP[filterMainCategory].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        )}
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="center">Main Image</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProducts.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>
  {p.offer?.isActive ? (
    <>
      <span style={{ textDecoration: "line-through", color: "gray" }}>
        ₹{p.price}
      </span>
      <br />
      <span style={{ color: "red", fontWeight: "bold" }}>
        ₹{p.offer.offerPrice}
      </span>
      <br />
      <small style={{ color: "green" }}>
        {p.offer.discountPercentage}% OFF
      </small>
    </>
  ) : (
    <>₹{p.price}</>
  )}
</TableCell>

                <TableCell>
                  {p.mainCategory}
                  <br />
                  <small>{p.subCategory}</small>
                </TableCell>
                
                {/* MAIN IMAGE PREVIEW */}
                <TableCell align="center">
                  <Avatar
                    src={p.images?.length ? `${IMAGE_BASE}${p.images[0]}` : ""}
                    variant="rounded"
                    sx={{ width: 40, height: 40, mx: "auto" }}
                  />
                  <Typography variant="caption" display="block">
                    Main Image
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <IconButton onClick={() => openEdit(p)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() =>
                      fetch(`${API_URL}/${p._id}`, {
                        method: "DELETE",
                      }).then(fetchProducts)
                    }
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL */}
      <Dialog open={open} onClose={resetForm} fullWidth>
        <DialogTitle>
          {editingId ? "Edit Product" : "Add Product"}
          <IconButton
            onClick={resetForm}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={product.name}
            onChange={(e) =>
              setProduct({ ...product, name: e.target.value })
            }
          />
{/* ================= OFFER SECTION ================= */}
<Typography sx={{ mt: 2, fontWeight: "bold" }}>
  Offer Settings
</Typography>

<TextField
  label="Discount %"
  type="number"
  fullWidth
  margin="dense"
  value={product.discountPercentage || ""}
  onChange={(e) =>
    setProduct({
      ...product,
      discountPercentage: e.target.value,
    })
  }
/>

<Select
  fullWidth
  value={product.isActive ? "true" : "false"}
  onChange={(e) =>
    setProduct({
      ...product,
      isActive: e.target.value === "true",
    })
  }
  sx={{ mt: 2 }}
>
  <MenuItem value="false">Offer Disabled</MenuItem>
  <MenuItem value="true">Activate Offer</MenuItem>
</Select>

<TextField
  label="Start Date"
  type="date"
  fullWidth
  margin="dense"
  value={product.startDate || ""}
  onChange={(e) =>
    setProduct({
      ...product,
      startDate: e.target.value,
    })
  }
  slotProps={{
    inputLabel: { shrink: true },
  }}
/>

<TextField
  label="End Date"
  type="date"
  fullWidth
  margin="dense"
  value={product.endDate || ""}
  onChange={(e) =>
    setProduct({
      ...product,
      endDate: e.target.value,
    })
  }
  slotProps={{
    inputLabel: { shrink: true },
  }}
/>


          <TextField
            label="Price"
            fullWidth
            margin="dense"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: e.target.value })
            }
          />

          <Select
            fullWidth
            displayEmpty
            value={product.mainCategory}
            onChange={(e) =>
              setProduct({ ...product, mainCategory: e.target.value, subCategory: "" })
            }
            sx={{ mt: 2 }}
          >
            <MenuItem value="">Select Category</MenuItem>
            {Object.keys(CATEGORY_MAP).map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>

          {product.mainCategory && (
            <Select
              fullWidth
              displayEmpty
              value={product.subCategory}
              onChange={(e) =>
                setProduct({ ...product, subCategory: e.target.value })
              }
              sx={{ mt: 2 }}
            >
              <MenuItem value="">Select Sub Category</MenuItem>
              {CATEGORY_MAP[product.mainCategory].map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          )}

          <TextField
            label="Description"
            fullWidth
            multiline
            margin="dense"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />

          {/* Ingredients */}
          <TextField
            label="Ingredients (comma separated)"
            fullWidth
            multiline
            margin="dense"
            value={product.ingredients}
            onChange={(e) =>
              setProduct({ ...product, ingredients: e.target.value })
            }
          />

          {/* How to Use */}
          <TextField
            label="How to Use"
            fullWidth
            multiline
            margin="dense"
            value={product.howToUse}
            onChange={(e) =>
              setProduct({ ...product, howToUse: e.target.value })
            }
          />

          {/* MULTIPLE IMAGE INPUT */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setProduct({
                ...product,
                imageFiles: Array.from(e.target.files),
                mainImageIndex: 0, // first uploaded is main
              })
            }
            style={{ marginTop: "10px" }}
          />
          {product.imageFiles.length > 0 && (
            <Typography variant="caption" display="block">
              First image will be main
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
