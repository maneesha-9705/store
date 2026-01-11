import { useState } from 'react';

import { useStore } from '../context/StoreContext';

const AdminDashboard = () => {
    const { addProduct, products, updateProduct, deleteProduct } = useStore();
    const [formData, setFormData] = useState({
        name: '',
        cost: '',
        quantity: '',
        category: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            setLoading(true);
            const response = await fetch('/api/process-image', {
                method: 'POST',
                body: uploadData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Server error');
            }

            const data = await response.json();
            setFormData(prev => ({ ...prev, image: data.image }));
            setLoading(false);
        } catch (error) {
            console.error(error);
            alert('Error processing with Sharp: ' + error.message + '. Is the server running?');
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.cost || !formData.image || !formData.category) {
            alert('Please fill all fields');
            return;
        }
        addProduct(formData);
        setFormData({ name: '', cost: '', quantity: '', category: '', image: '' });
        alert('Product added successfully!');
    };

    const handleUpdateStock = async (id, currentQty, change) => {
        const newQty = Number(currentQty) + change;
        if (newQty < 0) return;

        await updateProduct(id, { quantity: newQty });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
        }
    };

    return (
        <div className="container">
            <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                {/* Add Product Form */}
                <div className="glass" style={{ padding: '2rem', borderRadius: '16px', height: 'fit-content' }}>
                    <h3>Add New Product</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                        />

                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="input-field"
                        >
                            <option value="" disabled>Select Category</option>
                            <option value="jewellery">Jewellery</option>
                            <option value="accessories">Accessories</option>
                            <option value="art&craft works">Art & Craft Works</option>
                            <option value="utensils">Utensils</option>
                        </select>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="number"
                                placeholder="Cost"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                className="input-field"
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="input-field"
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                Product Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="input-field"
                            />
                        </div>

                        {loading && <p style={{ color: '#60a5fa' }}>Processing image...</p>}

                        {formData.image && (
                            <div style={{ marginBottom: '1rem', width: '100%', height: '150px', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}

                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                            Add Product
                        </button>
                    </form>
                </div>

                {/* Product List */}
                <div>
                    <h3>Current Inventory</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {products.map((p) => (
                            <div key={p.id} className="glass" style={{ display: 'flex', padding: '1rem', borderRadius: '12px', alignItems: 'center' }}>
                                <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                <div style={{ marginLeft: '1rem', flex: 1 }}>
                                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{p.name}</h4>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>₹{p.cost}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px' }}>
                                        <button
                                            onClick={() => handleUpdateStock(p.id, p.quantity, -1)}
                                            style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer' }}
                                        >-</button>
                                        <span style={{ fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{p.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateStock(p.id, p.quantity, 1)}
                                            style={{ background: 'transparent', border: 'none', color: '#60a5fa', fontSize: '1.2rem', cursor: 'pointer' }}
                                        >+</button>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
