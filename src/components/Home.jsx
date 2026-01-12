import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: '800' }}>
                Welcome to Lucky Ladies Corner
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem' }}>
                Discover our exclusive collection of premium items. Curated for quality, designed for style.
            </p>
            <Link to="/products" className="btn-primary" style={{ fontSize: '1.2rem', padding: '15px 40px', run: 'none' }}>
                Start Shopping
            </Link>

            <div style={{ marginTop: '5rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div className="glass" style={{ padding: '2rem', width: '200px', borderRadius: '16px' }}>
                    <h3 style={{ color: 'var(--text-main)' }}>🚀 Fast Delivery</h3>
                </div>
                <div className="glass" style={{ padding: '2rem', width: '200px', borderRadius: '16px' }}>
                    <h3 style={{ color: 'var(--text-main)' }}>💎 Premium Quality</h3>
                </div>
                <div className="glass" style={{ padding: '2rem', width: '200px', borderRadius: '16px' }}>
                    <h3 style={{ color: 'var(--text-main)' }}>🛡️ Secure Payment</h3>
                </div>
            </div>
        </div>
    );
};

export default Home;
