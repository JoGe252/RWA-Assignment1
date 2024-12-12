'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { useState, useEffect } from 'react';

export default function MyApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDash, setShowDash] = useState(false);
  const [showFirstPage, setShowFirstPage] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [products, setProducts] = useState(null);
  const [weather, setWeatherData] = useState(null);
  const [username, setUsername] = useState('');
  const [managerLoggedIn, setManagerLoggedIn] = useState(false);
  const [orders, setOrders] = useState(null);
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    if (showDash) {
      fetch('/api/getProducts')
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error('Error fetching products:', error));

      fetch('/api/getWeather')
        .then((res) => res.json())
        .then((data) => setWeatherData(data))
        .catch((error) => console.error('Error fetching weather:', error));
    }
  }, [showDash]);

  const runShowLogin = () => {
    setShowFirstPage(false);
    setShowLogin(true);
    setShowDash(false);
    setShowRegister(false);
    setShowManager(false);
    setShowCheckout(false);
  };

  const runShowDash = () => {
    if (!loggedIn) {
      alert('Please log in');
      runShowLogin();
      return;
    } else {
      setShowFirstPage(false);
      setShowLogin(false);
      setShowDash(true);
      setShowRegister(false);
      setShowManager(false);
      setShowCheckout(false);
    }
  };

  const runShowFirst = () => {
    setShowFirstPage(true);
    setShowLogin(false);
    setShowDash(false);
    setShowRegister(false);
    setShowManager(false);
    setShowCheckout(false);
  };

  const runShowRegister = () => {
    setShowFirstPage(false);
    setShowLogin(false);
    setShowDash(false);
    setShowRegister(true);
    setShowCheckout(false);
  };
  const handleManagerLogin = () => {
    const email = document.querySelector('input[name="manager-email"]').value;
    const password = document.querySelector('input[name="manager-password"]').value;

    fetch('/api/managerLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Manager logged in');
          setUsername('');
          setCart([]);
          setManagerLoggedIn(true);
          runShowManager(); // Navigates to the manager dashboard
        }
      })
      .catch((err) => console.error('Error manager login:', err));
  };

  const runShowManager = () => {
    setShowFirstPage(false);
    setShowLogin(false);
    setShowDash(false);
    setShowRegister(false);
    setShowManager(true);
    setShowCheckout(false);
    setOrders(null);

    fetch('/api/managerViewOrders')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Error fetching orders:', data.error);
          alert('Failed to fetch orders. Please try again.');
        } else {
          setOrders(data);
        }
      })
      .catch((err) => console.error('Error fetching orders:', err));
  };

  const handleLogin = () => {
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    fetch('/api/logins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('User login successful');
          setManagerLoggedIn(false);
          setLoggedIn(true);
          setUsername(email);
          setShowDash(true);
        }
      })
      .catch((err) => console.error('Error during login:', err));
  };

  const handleRegister = () => {
    const name = document.querySelector('input[name="Full Name"]').value;
    const address = document.querySelector('input[name="address"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirm-password"]').value;

    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, address, email, password, confirmPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Registration successful');
          runShowLogin();
        }
      })
      .catch((err) => console.error('Error registering user:', err));
  };

  const putInCart = (product) => {
    if (!loggedIn || !username) {
      alert('Please log in .');
      return;
    }

    setCart((prevCart) => [...prevCart, product]); // Add product to the cart
    setShowCheckout(true); // Navigate to checkout
  };
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          items: cart,
          total: cart.reduce((sum, item) => sum + item.price, 0), // Calculate total price
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Checkout successful!');
        setCart([]); // Clear the cart
        runShowFirst(); // Navigates back to the dashboard
      } else {
        alert(`Error: ${result.error || 'Could not complete checkout'}`);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout.');
    }
  };


  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#B22222',
      color: 'firebrick',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}
    >
      <AppBar position="static" sx={{ backgroundColor: 'firebrick' }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            Krispy Kreme
          </Typography>
          <Button color="inherit" onClick={runShowFirst}>
            Index
          </Button>
          <Button color="inherit" onClick={runShowRegister}>
            Register
          </Button>
          {!loggedIn ? (
            <Button color="inherit" onClick={runShowLogin}>
              Login
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={() => {
                setLoggedIn(false);
                setUsername('');
                setCart([]); // Clear the cart for the user
                setShowFirstPage(true);
                console.log('Successfully logged out'); // This logs the message in the console
                alert('Successfully logged out'); // This shows a popup message to the user
              }}
            >
              Logout
            </Button>
          )}
          <Button color="inherit" onClick={runShowDash}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={runShowManager}>
            Manager
          </Button>
        </Toolbar>
      </AppBar>
      {/* Drawer for Hamburger Menu */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250, backgroundColor: 'firebrick', height: '100%', color: 'white' }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={runShowFirst}>
                <ListItemText primary="Index" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={runShowRegister}>
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={runShowLogin}>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={runShowDash}>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={runShowManager}>
                <ListItemText primary="Manager" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {showFirstPage && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          <Typography variant="h1" color='blue'>Krispy Kreme</Typography>
          <Typography variant="h1" color='blue' sx={{ mt: 2 }}>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              position: 'relative',
              top: '5px',
              px: 2,
              py: 1.5,
              backgroundColor: 'firebrick',
              ':hover': { backgroundColor: '' },
            }}
            onClick={runShowRegister}
          >
      
          </Button>
        
        </Box>

      )
      }


      {
        showLogin && (
          <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
            <h1>User Login</h1>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" placeholder="johndoe@email.com" />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input name="password" type="password" placeholder="password" />
            </FormControl>
            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleLogin}>
              Login
            </Button>
          </Box>
        )
      }

      {
        showRegister && (
          <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
            <h1>Register to create an account</h1>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input name="Full Name" type="text" />
            </FormControl>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input name="address" type="text" />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input name="password" type="password" />
            </FormControl>
            <FormControl>
              <FormLabel>Confirm Password</FormLabel>
              <Input name="confirm-password" type="password" />
            </FormControl>
            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleRegister}>
              Register
            </Button>
          </Box>
        )
      }


      {
        showDash && (
          <Box component="section" sx={{ p: 2, overflowY: 'auto', border: '1px dashed grey' }}>
            <h1>Dashboard</h1>
            <Typography variant="h5">Welcome {username}!</Typography>
            {weather && (
              <Typography variant="h5">
                Today's Temperature: {weather.temp}°C | {weather.condition}
              </Typography>
            )}
            {products && (
              <Box>
                {products.map((product, index) => (
                  <Box key={index} sx={{ p: 2, border: '1px solid white', mb: 2 }}>
                    <Typography variant="h6">{product.pname}</Typography>
                    <img src={product.imageUrl}
                      alt={product.pname}
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <Typography variant="body1">Price: €{product.price}</Typography>
                    <Button onClick={() => putInCart(product)} variant="outlined">
                      Add to cart
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )
      }
      {
        showManager && !managerLoggedIn && (
          <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
            <h1>Manager Login</h1>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input name="manager-email" type="email" placeholder="manager@example.com" />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input name="manager-password" type="password" placeholder="password" />
            </FormControl>
            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleManagerLogin}>
              Login
            </Button>
          </Box>
        )
      }

      {
        showManager && managerLoggedIn && (
          <Box component="section" sx={{ p: 2, overflowY: 'auto', border: '1px dashed grey' }}>
            <h1>Manager Dashboard</h1>
            {orders && orders.length > 0 ? (
              <Box>
                {/* List all orders */}
                {orders.map((order, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: '1px solid firebrick',
                      borderRadius: '8px',
                      mb: 2,
                      backgroundColor: '#B22222',
                    }}
                  >
                    <Typography variant="h6">Order ID: {order._id}</Typography>
                    <Typography variant="body1">Customer: {order.username}</Typography>
                    <Typography variant="body1">Total: €{order.total}</Typography>
                    <Typography variant="body2">
                      Items: {order.items.map((item) => item.pname).join(', ')}
                    </Typography>
                    <Typography variant="body2">
                      Date: {new Date(order.timestamp).toLocaleString()} {/* Format timestamp */}
                    </Typography>
                  </Box>
                ))}

                {/* Total Orders and Revenue */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    border: '1px solid firebrick',
                    backgroundColor: '#B22222',
                    borderRadius: '8px',
                  }}
                >
                  <Typography variant="h5">Total Orders: {orders.length}</Typography>
                  <Typography variant="h5">
                    Total Revenue: €{orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography>No orders .</Typography>
            )}
          </Box>
        )
      }

      {
        showCheckout && (
          <Box component="section" sx={{ p: 2 }}>
            <Typography variant="h4">Checkout</Typography>
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <Box key={index} sx={{ p: 2, border: '1px solid firebrick', mb: 2 }}>
                  <img
                    src={item.imageUrl}
                    alt={item.pname}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <Typography variant="h6">Product Name: {item.pname}</Typography>
                  <Typography variant="h6">Price: €{item.price.toFixed(2)}</Typography>

                </Box>
              ))
            ) : (
              <Typography>No items in cart</Typography>
            )}
            <Button variant="contained" color="primary" onClick={handleCheckout}>
              Confirm Purchase
            </Button>
          </Box>
        )
      }
    </Box >
  );
}