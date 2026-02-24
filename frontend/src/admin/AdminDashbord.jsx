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
  Mail,
} from "@mui/icons-material";

/* ================= CONFIG ================= */
const API_URL = "http://localhost:8000/api/products";
const CUSTOMER_API = "http://localhost:8000/api/admin/users";
const IMAGE_BASE = "http://localhost:8000";
const res = await fetch("http://localhost:8000/api/admin/contacts");


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

useEffect(() => {
  fetchTotalProducts();
  fetchTotalUsers();
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



        </List>

        <Button startIcon={<Logout />} sx={{ m: 2 }} variant="outlined">
          Logout
        </Button>
      </Drawer>

      {/* MAIN */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {active === "users" && <Customers />}
        
        {active === "dashboard" && (
  <Box display="flex" gap={3}>

    <Paper sx={{ p: 3, width: 260 }}>
      <Typography color="text.secondary">
        Total Products
      </Typography>
      <Typography variant="h4">
        {totalProducts}
      </Typography>
    </Paper>

    <Paper sx={{ p: 3, width: 260 }}>
      <Typography color="text.secondary">
        Total Users
      </Typography>
      <Typography variant="h4">
        {totalUsers}
      </Typography>
    </Paper>

  </Box>
)}


        {active === "products" && <Products updateTotal={fetchTotalProducts} />}
        {active === "orders" && <Orders />}
        {active === "contacts" && <Contacts />}
        
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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  //  DELETE FUNCTION 
  const handleDeleteUser = async () => {
  try {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:8000/api/admin/users/${selectedUserId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCustomers((prev) =>
      prev.filter((user) => user._id !== selectedUserId)
    );

    setDeleteDialogOpen(false);
    setSelectedUserId(null);

  } catch (error) {
    console.error("Delete failed", error);
  }
};



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
    <TableCell>Mobile</TableCell>
    <TableCell>City</TableCell>
    <TableCell>Address</TableCell>
    <TableCell>Pincode</TableCell>
    <TableCell>Joined</TableCell>
    <TableCell>Action</TableCell>
  </TableRow>
</TableHead>


          <TableBody>
            {customers.length > 0 ? (
              customers.map((u) => (
                <TableRow key={u._id}>
  <TableCell>{u.name}</TableCell>
  <TableCell>{u.email}</TableCell>
  <TableCell>{u.mobile || "-"}</TableCell>
  <TableCell>{u.addresses?.[0]?.city || "-"}</TableCell>
  <TableCell>{u.addresses?.[0]?.address || "-"}</TableCell>
  <TableCell>{u.addresses?.[0]?.pincode || "-"}</TableCell>
  <TableCell>
    {new Date(u.createdAt).toLocaleDateString()}
  </TableCell>
  <TableCell>
    <IconButton
      color="error"
      onClick={() => {
        setSelectedUserId(u._id);
        setDeleteDialogOpen(true);
}}

    >
      <Delete />
    </IconButton>
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
      <Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
>
  <DialogTitle>Delete User</DialogTitle>

  <DialogContent>
    <Typography>
      Are you sure you want to delete this user?
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() => setDeleteDialogOpen(false)}
    >
      Cancel
    </Button>

    <Button
      color="error"
      variant="contained"
      onClick={handleDeleteUser}
    >
      Yes, Delete
    </Button>
  </DialogActions>
</Dialog>

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

  formData.append("mainImageIndex", product.mainImageIndex);

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
  <Button
    variant="contained"
    onClick={() => {
      setEditingId(null);   // 🔥 reset edit mode
      setOpen(true);
    }}  
  >
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
    <TableCell>Main Category</TableCell>
    <TableCell>Sub Category</TableCell>
    <TableCell>Description</TableCell>
    <TableCell>Ingredients</TableCell>
    <TableCell>How To Use</TableCell>
    <TableCell>Offer Status</TableCell>
    <TableCell>Offer Dates</TableCell>
    <TableCell align="center">Images</TableCell>

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

<TableCell>{p.mainCategory}</TableCell>

<TableCell>{p.subCategory}</TableCell>

<TableCell>{p.description?.slice(0, 40)}...</TableCell>

<TableCell>
  {Array.isArray(p.ingredients)
    ? p.ingredients.join(", ")
    : p.ingredients}
</TableCell>

<TableCell>{p.howToUse?.slice(0, 40)}...</TableCell>

<TableCell>
  {p.offer?.isActive ? "Active" : "No Offer"}
</TableCell>

<TableCell>
  {p.offer?.startDate
    ? new Date(p.offer.startDate).toLocaleDateString()
    : "-"}{" "}
  -
  {p.offer?.endDate
    ? new Date(p.offer.endDate).toLocaleDateString()
    : "-"}
</TableCell>
<TableCell align="center">
  <Box
    sx={{
      display: "flex",
      gap: 1,
      justifyContent: "center",
      flexWrap: "wrap",
    }}
  >
    {p.images && p.images.length > 0 ? (
      [...p.images]
  .sort((a, b) => {
    if (a === p.mainImage) return -1;
    if (b === p.mainImage) return 1;
    return 0;
  })
  .map((img, index) => (
        <Avatar
          key={index}
          src={`${IMAGE_BASE}${img}`}
          variant="rounded"
          sx={{ width: 40, height: 40 }}
        />
      ))
    ) : (
      "No Image"
    )}
  </Box>
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
  onChange={(e) => {
    const files = Array.from(e.target.files);
    setProduct({
      ...product,
      imageFiles: files,
      mainImageIndex: 0,
    });
  }}
  style={{ marginTop: "10px" }}
/>

          {product.imageFiles.length > 0 && (
  <Box
    sx={{
      display: "flex",
      gap: 2,
      mt: 2,
      flexWrap: "wrap",
    }}
  >
    {product.imageFiles.map((img, index) => (
      <Box
        key={index}
        onClick={() =>
          setProduct({
            ...product,
            mainImageIndex: index,
          })
        }
        sx={{
          border:
            index === product.mainImageIndex
              ? "3px solid green"
              : "1px solid #ccc",
          borderRadius: 2,
          cursor: "pointer",
          padding: "3px",
        }}
      >
        <img
          src={URL.createObjectURL(img)}
          alt=""
          width="80"
          height="80"
          style={{ objectFit: "cover" }}
        />
      </Box>
    ))}
  </Box>
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
/*---------Contacts function------------*/

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [replyOpen, setReplyOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedContactId, setSelectedContactId] = useState("");

  const fetchContacts = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/contact/admin/contacts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setContacts(data.data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const sendReply = async () => {
  await fetch("http://localhost:8000/api/contact/admin/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contactId: selectedContactId, replyMessage }),
  });

  alert("Reply sent successfully!");
  setReplyOpen(false);
  setReplyMessage("");
};


  return (
    <>
      <Typography variant="h5" mb={2}>Contact Messages</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Reply</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.message}</TableCell>
                <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
  variant="contained"
  onClick={() => {
    setSelectedEmail(c.email);       // keep for display
    setReplyOpen(true);
    setSelectedContactId(c._id);     // store contact ID
  }}
>
  Reply
</Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reply Dialog */}
      <Dialog open={replyOpen} onClose={() => setReplyOpen(false)} fullWidth>
        <DialogTitle>Send Reply</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reply Message"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={sendReply}>Send</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/admin/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setOrders(data.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Typography variant="h5" mb={2}>
        Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Shipping City</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Delivery Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((o) => (
              <TableRow key={o._id}>
                <TableCell>{o.userId}</TableCell>

                <TableCell>
                  {o.items.map((item, index) => (
                    <div key={index}>
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                </TableCell>

                <TableCell>₹{o.amount}</TableCell>

                <TableCell>
                  {o.paymentStatus === "paid" ? "Paid" : "Pending"}
                </TableCell>

                <TableCell>{o.shipping?.city}</TableCell>

                <TableCell>
                  {new Date(o.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
  <Select
    value={o.deliveryStatus}
    size="small"
    onChange={async (e) => {
      const token = localStorage.getItem("token");

      await fetch(
        `http://localhost:8000/api/admin/orders/${o._id}/delivery-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            deliveryStatus: e.target.value,
          }),
        }
      );

      fetchOrders(); // refresh table
    }}
  >
    <MenuItem value="Processing">Processing</MenuItem>
    <MenuItem value="Shipped">Shipped</MenuItem>
    <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
    <MenuItem value="Delivered">Delivered</MenuItem>
    <MenuItem value="Cancelled">Cancelled</MenuItem>
  </Select>
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}


