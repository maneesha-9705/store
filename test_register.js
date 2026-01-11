
// import fetch from 'node-fetch'; // Native fetch in Node 18+

const register = async () => {
    try {
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test' + Date.now() + '@gmail.com', // Use a likely valid email structure
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

register();
