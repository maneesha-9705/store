import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fancy_store';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

const viewUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB...');

        const users = await User.find({}, '-password'); // Exclude password for security
        console.log('\n--- Registered Users ---');
        console.log(users);
        console.log('------------------------\n');

    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
};

viewUsers();
