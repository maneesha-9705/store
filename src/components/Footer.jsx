
const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--header-footer-bg)',
            padding: '2rem',
            marginTop: 'auto',
            borderTop: '1px solid var(--glass-border)',
            textAlign: 'center',
            color: 'var(--text-muted)'
        }}>
            <p>&copy; {new Date().getFullYear()} Lucky Ladies Corner. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
