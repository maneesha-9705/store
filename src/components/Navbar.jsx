import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Navbar = () => {
    const { cart, user, logoutUser } = useStore();
    const navigate = useNavigate();

    return (

        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '1rem 2rem',
            backgroundColor: '#1e3a8a',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}>
            <div className="nav-container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    FancyStore
                </Link>

                <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/" className="nav-link" style={{ color: '#e2e8f0' }}>Home</Link>
                    <Link to="/products" className="nav-link" style={{ color: '#e2e8f0' }}>Products</Link>

                    <Link to="/cart" className="nav-link" style={{ position: 'relative', color: '#e2e8f0' }}>
                        🛒 Cart
                        {cart.length > 0 && (
                            <span style={{
                                position: 'absolute', top: -5, right: -10,
                                background: '#ef4444', color: 'white',
                                borderRadius: '50%', width: '18px', height: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '10px'
                            }}>
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem' }}>
                            {user.isAdmin && <Link to="/admin/dashboard" className="nav-link" style={{ color: '#e2e8f0' }}>Dashboard</Link>}
                            <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Hi, {user.email?.split('@')[0] || 'User'}</span>
                            <button
                                onClick={() => { logoutUser(); navigate('/'); }}
                                className="btn-primary"
                                style={{ padding: '5px 15px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-link" style={{ marginLeft: '1rem', color: '#e2e8f0' }}>Login</Link>
                    )}
                </div>
            </div>
        </nav>

    );
};

export default Navbar;
