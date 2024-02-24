import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return res.status(400).json({ message: 'All fields are required !!!' });
    }

    const hashPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashPassword,
    })

    try {
        await newUser.save();
        res.status(201).json({ message: 'User is successfully created' })
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'User already exist with same ' + Object.keys(error.keyPattern) })
        } else {
            res.status(500).json({ message: error.message })
        }
    }

};