# Fancy Store 🛍️

A full-stack e-commerce web application for selling fancy items including jewellery, accessories, art and craft works, and steel utensils. Features a complete admin dashboard for product management and integrated Razorpay payment gateway.

## ✨ Features

### User Features
- **Product Browsing**: Browse products by categories (Jewellery, Accessories, Art & Craft, Steel Utensils)
- **Search Functionality**: Search for products across all categories
- **Shopping Cart**: Add products to cart and manage quantities
- **Secure Payments**: Integrated Razorpay payment gateway
- **User Authentication**: Secure registration and login with JWT
- **Email Validation**: Deep email validation to prevent fake registrations

### Admin Features
- **Product Management**: Add, edit, and delete products
- **Image Upload**: Upload and optimize product images with Sharp
- **Inventory Management**: Track product quantities
- **Order Management**: View and manage customer orders
- **Admin Dashboard**: Comprehensive dashboard for store management

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Authentication & Security
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **deep-email-validator** - Email validation with SMTP/MX checks

### Payment Integration
- **Razorpay** - Payment gateway

### Image Processing
- **Multer** - File upload handling
- **Sharp** - Image optimization and resizing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Razorpay account (for payment integration)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/fancy-store.git
   cd fancy-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (see `.env.example`):
   ```env
   MONGODB_URI=mongodb://localhost:27017/fancy_store
   JWT_SECRET=your_jwt_secret_key_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   PORT=3000
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system

5. **Run the application**
   
   In separate terminals:
   ```bash
   # Terminal 1 - Start backend server
   npm run server
   
   # Terminal 2 - Start frontend dev server
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 👤 Admin Access

The admin user is pre-configured with:
- **Email**: maneesha
- **Phone**: 9154176899

Admin users have access to the dashboard and product management features.

## 📁 Project Structure

```
fancy-store/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   └── ...
├── public/             # Static files
├── server.js           # Express server
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── .env                # Environment variables (not in repo)
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Email validation with SMTP/MX record checks
- Environment variables for sensitive data
- Secure payment processing with Razorpay

## 📝 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start Express backend server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

For any queries or support, please open an issue on GitHub.

---

**Note**: Remember to never commit your `.env` file to version control. Always use `.env.example` as a template.
