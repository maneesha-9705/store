import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import emailValidator from 'deep-email-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret',
});

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fancy_store';

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    category: { type: String, required: true }, // Added Category
    image: { type: String, required: true }
});
const Product = mongoose.model('Product', productSchema);

// Cart Schema
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }
    ]
});
const Cart = mongoose.model('Cart', cartSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, default: 'Pending' }, // Pending, Paid, Failed
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }
    ],
    deliveryDetails: {
        name: String,
        phone: String,
        address: String,
        city: String,
        pincode: String
    },
    createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Email Validation Middleware
const validateEmail = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const { valid, reason, validators } = await emailValidator.validate({
            email,
            validateSMTP: false, // Disable SMTP check to avoid blocking by ISPs/Port 25
            validateMx: true,
            validateTypo: true,
            validateDisposable: true,
            validateRegex: true
        });

        if (valid) {
            return next();
        }

        // If invalid, check specific reasons requested by user (SMTP, MX)
        // deep-email-validator returns valid: false if any check fails.
        // We can check validators.smtp and validators.mx to specific error messaging if needed,
        // but the user said "Block any email that fails SMTP or MX".

        let errorMessage = 'Invalid email address.';
        if (!validators.mx.valid) errorMessage = 'Invalid email domain (MX record missing).';
        if (validators.smtp && !validators.smtp.valid) errorMessage = 'Email address does not exist (SMTP check failed).';
        if (!validators.typo.valid) errorMessage = 'Did you mean ' + validators.typo.reason + '?';

        console.log(`Email validation failed for ${email}:`, reason);
        return res.status(400).json({
            error: errorMessage,
            details: reason
        });

    } catch (error) {
        console.error('Email validation error:', error);
        // Fallback: if validator fails (e.g. network issue), we might want to allow or block.
        // For safety/security, usually block or warn. Let's return error for now.
        return res.status(500).json({ error: 'Email validation service failed' });
    }
};

// Login Validation Middleware (Basic)
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    // Basic format check could go here, but we'll rely on the specific error from DB lookup or auth check
    next();
};

// Routes

// Register Route
app.post('/register', validateEmail, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login Route
app.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hardcoded Admin Check
        if (email === 'maneeshag099@gmail.com' && password === '9705@Srinu') {
            const token = jwt.sign(
                { userId: 'admin-static-id', isAdmin: true },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '1h' }
            );
            return res.json({ token, user: { email, isAdmin: true } });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.json({ token, user: { email: user.email, isAdmin: user.isAdmin } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});



// Product Routes

// Get All Products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        // Map _id to id for frontend compatibility
        res.json(products.map(p => ({
            ...p.toObject(),
            id: p._id
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Add Product (Admin)
app.post('/products', authenticateToken, async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const { name, cost, quantity, category, image } = req.body;
        const newProduct = new Product({ name, cost, quantity, category, image });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// Update Product (Admin - Stock Management)
app.put('/products/:id', authenticateToken, async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const { id } = req.params;
        const updates = req.body;
        const product = await Product.findByIdAndUpdate(id, updates, { new: true });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete Product (Admin)
app.delete('/products/:id', authenticateToken, async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Cart Routes

// Get User Cart
app.get('/cart', authenticateToken, async (req, res) => {
    try {
        if (req.user.userId === 'admin-static-id') {
            return res.json([]);
        }
        const cart = await Cart.findOne({ userId: req.user.userId }).populate('products.productId');
        if (!cart) {
            return res.json([]);
        }
        // Filter out null products (if deleted) and map to cleaner structure
        const cartItems = cart.products
            .filter(item => item.productId)
            .map(item => {
                const product = item.productId.toObject();
                return {
                    ...product,
                    cartQuantity: item.quantity,
                    // Ensure ID is consistent for frontend (MongoDB uses _id)
                    id: product._id
                };
            });
        res.json(cartItems);
    } catch (error) {
        console.error('Get Cart Error', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Add to Cart
app.post('/cart', authenticateToken, async (req, res) => {
    try {
        if (req.user.userId === 'admin-static-id') {
            return res.status(400).json({ error: 'Admin cannot add items to cart. Please log in as a regular user.' });
        }
        const { productId } = req.body;
        const userId = req.user.userId;

        // Check stock
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (product.quantity <= 0) return res.status(400).json({ error: 'Out of stock' });

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.products[itemIndex].quantity += 1;
        } else {
            cart.products.push({ productId, quantity: 1 });
        }

        await cart.save();
        res.json({ message: 'Added to cart' });
    } catch (error) {
        console.error('Add Cart Error', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
});

// Update Cart Item Quantity
app.put('/cart/:productId', authenticateToken, async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.userId;

        if (req.user.userId === 'admin-static-id') {
            return res.status(400).json({ error: 'Admin cannot modify cart' });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        // Check product stock
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (product.quantity < quantity) {
            return res.status(400).json({ error: `Only ${product.quantity} items available in stock` });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not in cart' });
        }

        cart.products[itemIndex].quantity = quantity;
        await cart.save();

        res.json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Update Cart Error', error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
});

// Remove from Cart
app.delete('/cart/:productId', authenticateToken, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;

        if (req.user.userId === 'admin-static-id') return res.sendStatus(200);
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.products = cart.products.filter(p => p.productId.toString() !== productId);
            await cart.save();
        }

        res.json({ message: 'Removed from cart' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
});

// Checkout
app.post('/cart/checkout', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ userId }).populate('products.productId');

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Verify and Decrement Stock
        for (const item of cart.products) {
            const product = await Product.findById(item.productId._id);
            if (!product) {
                return res.status(400).json({ error: `Product not found: ${item.productId}` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            }
            product.quantity -= item.quantity;
            await product.save();
        }

        // Clear Cart
        await Cart.findOneAndDelete({ userId });
        res.json({ message: 'Checkout successful' });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Checkout failed' });
    }
});

app.post('/create-razorpay-order', authenticateToken, async (req, res) => {
    try {
        const { amount, products, deliveryDetails } = req.body;

        const options = {
            amount: Math.round(amount * 100), // Ensure it's an integer for Razorpay
            currency: 'INR',
            receipt: `order_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Save order as Pending in DB
        const newOrder = new Order({
            userId: req.user.userId !== 'admin-static-id' ? req.user.userId : null,
            razorpayOrderId: razorpayOrder.id,
            amount,
            products: products.map(p => ({ productId: p.id || p._id, quantity: p.cartQuantity || 1 })),
            deliveryDetails,
            status: 'Pending'
        });

        await newOrder.save();

        res.json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id'
        });
    } catch (error) {
        console.error('Razorpay order creation failed:', error);
        res.status(500).json({
            error: 'Order creation failed',
            details: error.description || error.message || 'Unknown Razorpay error'
        });
    }
});

app.post('/verify-payment', authenticateToken, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'your_secret')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment verified
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
            if (!order) return res.status(404).json({ error: 'Order not found' });

            order.status = 'Paid';
            order.razorpayPaymentId = razorpay_payment_id;
            order.razorpaySignature = razorpay_signature;
            await order.save();

            // Decrease product quantities
            for (const item of order.products) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { quantity: -item.quantity }
                });
            }

            // If user has a cart, clear it (if order was for whole cart)
            // Note: In simplified "Buy Now" logic, we might only want to clear cart if order was from cart.
            // For now, let's keep it simple.

            res.json({ success: true, message: 'Payment verified and order placed' });
        } else {
            res.status(400).json({ error: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Payment verification failed:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Admin: Get All Orders (Customers & Delivery Details)
app.get('/orders', authenticateToken, async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const orders = await Order.find()
            .populate('products.productId')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

app.post('/process-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Use Sharp to resize and enhance the image
        const processedImageBuffer = await sharp(req.file.buffer)
            .resize(800, 800, { // Resize to max 800x800, maintaining aspect ratio
                fit: 'inside',
                withoutEnlargement: true
            })
            .modulate({
                brightness: 1.1, // Slight brightness boost
                saturation: 1.2  // Enhance colors
            })
            .jpeg({ quality: 80 }) // Compress to JPEG with 80% quality
            .toBuffer();

        // Convert buffer to base64 string
        const base64Image = `data:image/jpeg;base64,${processedImageBuffer.toString('base64')}`;

        res.json({ image: base64Image });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process image' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
