import { useStore } from '../context/StoreContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';

const Products = () => {
    const { products, addToCart, user } = useStore();
    const navigate = useNavigate();
    const { category } = useParams();

    const handleBuyNow = async (product) => {
        if (!user) {
            alert('Please login to buy');
            navigate('/login');
            return;
        }
        navigate('/checkout', { state: { product } });
    };

    const categories = [
        { name: 'All', path: '/products' },
        { name: 'Jewellery', path: '/products/jewellery' },
        { name: 'Accessories', path: '/products/accessories' },
        { name: 'art&craft works', path: '/products/art&craft works' },
        { name: 'utensils', path: '/products/utensils' },
    ];

    const [searchInput, setSearchInput] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');

    // Clear search when category changes
    useEffect(() => {
        setSearchInput('');
        setAppliedSearch('');
    }, [category]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = !category || (product.category && product.category.toLowerCase() === category.toLowerCase());
            const matchesSearch = product.name.toLowerCase().includes(appliedSearch.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, category, appliedSearch]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setAppliedSearch(searchInput);
            setSearchInput('');
        }
    };

    return (
        <div className="container">
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Our Collection</h2>

            {/* Category Navigation */}
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
                {categories.map((cat) => {
                    const isActive = (category?.toLowerCase() === cat.name.toLowerCase()) || (!category && cat.name === 'All');
                    return (
                        <Link
                            key={cat.name}
                            to={cat.path}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                background: isActive ? '#3b82f6' : '#f1f5f9',
                                color: isActive ? 'white' : '#475569',
                                border: isActive ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat.name}
                        </Link>
                    )
                })}
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="Search products and press Enter..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input-field"
                    style={{ maxWidth: '400px' }}
                />
            </div>

            {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <h2>No products found.</h2>
                    <p className="text-muted">Try adjusting your search or category.</p>
                </div>
            ) : (
                <div className="grid-products">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="card glass">
                            <div style={{ height: '250px', overflow: 'hidden' }}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <h3 className="line-clamp-2" style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', minHeight: '2.4em' }}>
                                    {product.name}
                                </h3>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.25rem' }}>₹{product.cost}</span>
                                    <span style={{
                                        color: product.quantity > 0 ? '#10b981' : '#ef4444',
                                        fontWeight: '500',
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        background: product.quantity > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        padding: '4px 8px',
                                        borderRadius: '12px'
                                    }}>
                                        {product.quantity > 0 ? (
                                            <>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                                                {product.quantity} left
                                            </>
                                        ) : (
                                            'Out of Stock'
                                        )}
                                    </span>
                                </div>

                                <div className="product-actions" style={{ marginTop: 'auto' }}>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="btn-primary"
                                        disabled={product.quantity <= 0 || user?.isAdmin}
                                        style={{
                                            flex: 1,
                                            fontSize: '0.9rem',
                                            opacity: (product.quantity <= 0 || user?.isAdmin) ? 0.5 : 1,
                                            cursor: user?.isAdmin ? 'not-allowed' : 'pointer',
                                            padding: '10px'
                                        }}
                                        title={user?.isAdmin ? "Admins cannot shop" : ""}
                                    >
                                        {user?.isAdmin ? 'Admin View' : (product.quantity > 0 ? 'Add to Cart' : 'Sold Out')}
                                    </button>
                                    <button
                                        onClick={() => handleBuyNow(product)}
                                        disabled={product.quantity <= 0 || user?.isAdmin}
                                        style={{
                                            flex: 1,
                                            border: '1px solid #60a5fa',
                                            background: 'transparent',
                                            color: '#60a5fa',
                                            borderRadius: '8px',
                                            cursor: user?.isAdmin ? 'not-allowed' : 'pointer',
                                            fontWeight: 600,
                                            opacity: (product.quantity <= 0 || user?.isAdmin) ? 0.5 : 1,
                                            padding: '10px'
                                        }}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
