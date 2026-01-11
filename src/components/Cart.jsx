
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, checkout } = useStore();
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + (Number(item.cost) * (item.cartQuantity || 1)), 0);

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
                        <div key={`${item.id}-${index}`} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderRadius: '12px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div style={{ flex: 1, marginLeft: '1rem' }}>
                                <h3>{item.name}</h3>
                                <p style={{ color: '#94a3b8' }}>₹{item.cost} x {item.cartQuantity || 1}</p>
                                <p style={{ fontWeight: 'bold' }}>Subtotal: ₹{(item.cost * (item.cartQuantity || 1)).toFixed(2)}</p>
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
