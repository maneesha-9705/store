
import { createContext, useState, useContext, useEffect } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('fancy_user');
        return saved ? JSON.parse(saved) : null;
    });

    const getToken = () => localStorage.getItem('fancy_token');

    const fetchProducts = () => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProducts(data);
            })
            .catch(err => console.error('Failed to load products:', err));
    };

    // Fetch Products on Mount and Poll
    useEffect(() => {
        fetchProducts();
        const interval = setInterval(fetchProducts, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    // Fetch Cart when User Changes (and is logged in)
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart([]); // Clear cart on logout
        }
    }, [user]);

    // Persist User
    useEffect(() => {
        if (user) {
            localStorage.setItem('fancy_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('fancy_user');
            localStorage.removeItem('fancy_token');
        }
    }, [user]);

    const fetchCart = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch('/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setCart(data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addProduct = async (product) => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}` // Secure it
                },
                body: JSON.stringify(product)
            });
            const newProduct = await res.json();
            if (res.ok) {
                fetchProducts(); // Refresh list to ensure sync
            } else {
                alert('Failed to add product');
            }
        } catch (error) {
            console.error('Add product error:', error);
        }
    };

    const updateProduct = async (id, updates) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(updates)
            });
            if (res.ok) {
                fetchProducts();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Update product error:', error);
            return false;
        }
    };

    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            if (res.ok) {
                fetchProducts();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Delete product error:', error);
            return false;
        }
    };

    const addToCart = async (product) => {
        if (!user) {
            alert('Please login to add to cart');
            return;
        }

        try {
            const token = getToken();
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: product._id || product.id })
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || 'Failed to add to cart');
                return;
            }

            await fetchCart(); // Refresh cart to get updated quantities
            alert('Added to cart!');
        } catch (error) {
            console.error('Add to cart error:', error);
        }
    };

    const removeFromCart = async (productId) => {
        const token = getToken();
        try {
            const res = await fetch(`/api/cart/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                await fetchCart();
            }
        } catch (error) {
            console.error('Remove cart error:', error);
        }
    };

    const updateCartQuantity = async (productId, quantity) => {
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch(`/api/cart/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            });

            if (res.ok) {
                await fetchCart();
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to update quantity');
            }
        } catch (error) {
            console.error('Update cart quantity error:', error);
        }
    };

    const checkout = async () => {
        const token = getToken();
        if (!token) return { success: false, error: 'Not logged in' };

        try {
            const res = await fetch('/api/cart/checkout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok) {
                setCart([]); // Clear local state
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Checkout error:', error);
            return { success: false, error: 'Network error' };
        }
    };

    const loginUser = async (userData) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (data.token) {
                localStorage.setItem('fancy_token', data.token);
            }

            setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const registerUser = async (userData) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    };

    const logoutUser = () => {
        setUser(null);
        setCart([]);
        localStorage.removeItem('fancy_token');
        localStorage.removeItem('fancy_user');
    };

    return (
        <StoreContext.Provider value={{
            products,
            cart,
            user,
            addProduct,
            updateProduct,
            deleteProduct,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            checkout,
            loginUser,
            registerUser,
            logoutUser
        }}>
            {children}
        </StoreContext.Provider>
    );
};
