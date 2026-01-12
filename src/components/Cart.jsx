
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateCartQuantity, checkout } = useStore();
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + (Number(item.cost) * (item.cartQuantity || 1)), 0);

    const handleIncreaseQuantity = (productId, currentQuantity) => {
        updateCartQuantity(productId, currentQuantity + 1);
    };

    const handleDecreaseQuantity = (productId, currentQuantity) => {
        if (currentQuantity > 1) {
            updateCartQuantity(productId, currentQuantity - 1);
        }
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        navigate('/checkout');
    };

    return (
        <div className="container">
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Shopping Cart</h2>

            {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                    <h3>Your cart is empty</h3>
                    <button onClick={() => navigate('/products')} className="btn-primary" style={{ marginTop: '1rem' }}>Browse Products</button>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
                    {cart.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="glass cart-item" style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderRadius: '12px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div style={{ flex: 1, marginLeft: '1rem' }}>
                                <h3>{item.name}</h3>
                                <p style={{ color: '#94a3b8' }}>₹{item.cost} each</p>
                                <p style={{ fontWeight: 'bold' }}>Subtotal: ₹{(item.cost * (item.cartQuantity || 1)).toFixed(2)}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="cart-controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '1rem' }}>
                                <button
                                    onClick={() => handleDecreaseQuantity(item.id, item.cartQuantity || 1)}
                                    disabled={item.cartQuantity <= 1}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        color: 'white',
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '8px',
                                        cursor: item.cartQuantity <= 1 ? 'not-allowed' : 'pointer',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        opacity: item.cartQuantity <= 1 ? 0.5 : 1,
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (item.cartQuantity > 1) {
                                            e.target.style.transform = 'scale(1.1)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    −
                                </button>

                                <span style={{
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    minWidth: '40px',
                                    textAlign: 'center',
                                    color: '#60a5fa'
                                }}>
                                    {item.cartQuantity || 1}
                                </span>

                                <button
                                    onClick={() => handleIncreaseQuantity(item.id, item.cartQuantity || 1)}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        color: 'white',
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.1)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}


                    <div className="glass" style={{ padding: '2rem', borderRadius: '16px', marginTop: '1rem', textAlign: 'right' }}>
                        <h2>Total: <span style={{ color: '#60a5fa' }}>₹{total.toFixed(2)}</span></h2>
                        <button onClick={handleCheckout} className="btn-primary" style={{ fontSize: '1.2rem', padding: '12px 30px', marginTop: '1rem' }}>
                            Buy Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
