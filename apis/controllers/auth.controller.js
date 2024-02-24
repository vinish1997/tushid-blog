import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

const MANDATORY_FIELD_ERROR = 'All fields are mandatory';
const USER_ALREADY_EXIST_ERROR = 'User already exist with same ';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, MANDATORY_FIELD_ERROR));
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
            next(errorHandler(400, USER_ALREADY_EXIST_ERROR + Object.keys(error.keyPattern)));
        } else {
            next(error);
        }
    }

};