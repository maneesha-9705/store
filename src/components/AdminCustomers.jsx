import { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const AdminCustomers = () => {
    const { user } = useStore();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('fancy_token');
                const res = await fetch('/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '4rem' }}>Loading customers...</div>;

    return (
        <div className="container">
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Customer Orders</h2>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                    <h3>No orders found yet.</h3>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '2rem' }}>
                    {orders.map((order) => (
                        <div key={order._id} className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.4rem', color: '#60a5fa', marginBottom: '0.5rem' }}>
                                        {order.deliveryDetails?.name || 'Unknown Customer'}
                                    </h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                        Order ID: <span style={{ fontFamily: 'monospace' }}>{order.razorpayOrderId}</span>
                                    </p>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                        Date: {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        background: order.status === 'Paid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                        color: order.status === 'Paid' ? '#10b981' : '#f59e0b',
                                        fontWeight: 'bold',
                                        border: order.status === 'Paid' ? '1px solid #10b981' : '1px solid #f59e0b',
                                    }}>
                                        {order.status}
                                    </span>
                                    <h3 style={{ marginTop: '0.5rem' }}>₹{order.amount}</h3>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                                {/* Delivery Details */}
                                <div style={{ flex: '1 1 300px' }}>
                                    <h4 style={{ color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Delivery Address</h4>
                                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', height: '100%' }}>
                                        <p style={{ marginBottom: '0.5rem' }}><strong>Phone:</strong> {order.deliveryDetails?.phone}</p>
                                        <p style={{ marginBottom: '0.5rem' }}>{order.deliveryDetails?.address}</p>
                                        <p>{order.deliveryDetails?.city}, {order.deliveryDetails?.pincode}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div style={{ flex: '1 1 300px' }}>
                                    <h4 style={{ color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Items to Pack</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {order.products.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                                                {item.productId ? (
                                                    <>
                                                        <img
                                                            src={item.productId.image}
                                                            alt={item.productId.name}
                                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                                        />
                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ fontWeight: '500' }}>{item.productId.name}</p>
                                                            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Qty: {item.quantity}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p style={{ color: '#ef4444' }}>Product Deleted</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;
