import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { checkout, products, updateProduct, cart, removeFromCart } = useStore();
    const [isProcessing, setIsProcessing] = useState(false);

    const { product, details, fromCart } = location.state || {};

    useEffect(() => {
        if (!details) {
            navigate('/checkout');
        }
    }, [details, navigate]);

    const handlePayment = async () => {
        setIsProcessing(true);
        const amount = product ? product.cost : cart.reduce((sum, item) => sum + (Number(item.cost) * (item.cartQuantity || 1)), 0);

        try {
            // 1. Create Order on Backend
            const orderRes = await fetch('/api/create-razorpay-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('fancy_token')}`
                },
                body: JSON.stringify({
                    amount,
                    products: product ? [product] : cart,
                    deliveryDetails: details
                })
            });

            const contentType = orderRes.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await orderRes.text();
                console.error("Non-JSON response:", text);
                throw new Error("Server returned a non-JSON response. Check if server is running on port 3001.");
            }

            const orderData = await orderRes.json();
            if (!orderRes.ok) {
                throw new Error(orderData.details || orderData.error || 'Failed to create order');
            }

            // 2. Open Razorpay Checkout
            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Lucky Ladies Fancy Store",
                description: "Purchase Transaction",
                order_id: orderData.id,
                handler: async function (response) {
                    // 3. Verify Payment on Backend
                    const verifyRes = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('fancy_token')}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    const verifyContentType = verifyRes.headers.get("content-type");
                    if (!verifyContentType || !verifyContentType.includes("application/json")) {
                        const verifyText = await verifyRes.text();
                        console.error("Non-JSON verify response:", verifyText);
                        throw new Error("Server returned a non-JSON response during verification.");
                    }

                    const verifyData = await verifyRes.json();
                    if (verifyRes.ok) {
                        alert('Order Placed Successfully!');
                        if (fromCart || !product) {
                            // Clear cart if ordered from cart or whole cart
                            // You might need a clearCart context function or loop removal
                            cart.forEach(item => removeFromCart(item.id || item._id));
                        } else if (product && fromCart) {
                            await removeFromCart(product.id || product._id);
                        }
                        navigate('/');
                    } else {
                        alert('Payment verification failed: ' + verifyData.error);
                    }
                    setIsProcessing(false);
                },
                prefill: {
                    name: details.name,
                    contact: details.phone
                },
                theme: {
                    color: "#3b82f6"
                },
                modal: {
                    onhighlight: function () { setIsProcessing(false); }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert('Payment Failed: ' + response.error.description);
                setIsProcessing(false);
            });
            rzp.open();

        } catch (error) {
            console.error('Payment Error:', error);
            alert('Payment initialization failed: ' + error.message);
            setIsProcessing(false);
        }
    };

    return (
        <div className="container">
            <div className="glass" style={{ maxWidth: '500px', margin: '4rem auto', padding: '3rem', borderRadius: '16px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '2rem' }}>Secure Payment</h2>

                <div style={{ marginBottom: '2rem', textAlign: 'left', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    <p><strong>Deliver to:</strong> {details?.name}</p>
                    <p><strong>Phone:</strong> {details?.phone}</p>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{details?.address}, {details?.city} - {details?.pincode}</p>
                </div>

                <div style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                    Total Amount: <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.5rem' }}>₹{product ? product.cost : cart.reduce((sum, item) => sum + (Number(item.cost) * (item.cartQuantity || 1)), 0).toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        onClick={handlePayment}
                        className="btn-primary"
                        disabled={isProcessing}
                        style={{ padding: '15px', fontSize: '1.1rem' }}
                    >
                        {isProcessing ? 'Processing Payment...' : 'Pay with UPI / Card'}
                    </button>

                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        🔒 256-bit SSL Secure Payment
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
