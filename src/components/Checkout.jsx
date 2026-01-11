import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useStore();

    // Get product from state if it's a "Buy Now" action
    const buyNowProduct = location.state?.product;

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.address) {
            alert('Please fill in all required fields');
            return;
        }

        // Save delivery details (could be saved to context or passed to payment)
        navigate('/payment', { state: { product: buyNowProduct, details: formData, fromCart: location.state?.fromCart } });
    };

    if (!user) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>Please log in to continue with your purchase.</h2>
                <button onClick={() => navigate('/login')} className="btn-primary" style={{ marginTop: '1rem' }}>Login</button>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="glass" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', borderRadius: '16px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Delivery Details</h2>

                {buyNowProduct && (
                    <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={buyNowProduct.image} alt={buyNowProduct.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                        <div>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{buyNowProduct.name}</p>
                            <p style={{ margin: 0, color: '#3b82f6' }}>₹{buyNowProduct.cost}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b' }}>Full Name *</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b' }}>Phone Number *</label>
                        <input
                            type="tel"
                            className="input-field"
                            placeholder="Enter 10-digit phone number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b' }}>Delivery Address *</label>
                        <textarea
                            className="input-field"
                            style={{ minHeight: '100px', resize: 'vertical' }}
                            placeholder="Enter your full address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b' }}>City</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#64748b' }}>Pincode</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.pincode}
                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px' }}>
                        Proceed to Payment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
