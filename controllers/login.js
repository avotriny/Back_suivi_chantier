// controllers/login.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import tryCatch from './utils/tryCatch.js';

const login = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  const emailLowerCase = email.toLowerCase();
  const existedUser = await User.findOne({ email: emailLowerCase });
  if (!existedUser) return res.status(400).json({ success: false, message: "Utilisateur n'existe pas" });

  const correctPassword = await bcrypt.compare(password, existedUser.password);
  if (!correctPassword) return res.status(400).json({ success: false, message: 'Invalid credentials' });

  const { _id: id, name, photoURL, role, active } = existedUser;
  if (!active) return res.status(400).json({ success: false, message: 'Cette compte est bloqué! veuillez contact l\'administrateur' });

  const token = jwt.sign({ id, name, photoURL, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ success: true, result: { id, name, email: emailLowerCase, photoURL, token, role, active } });
});

export default login;
