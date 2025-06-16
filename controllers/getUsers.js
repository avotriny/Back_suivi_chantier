
import User from '../models/User.js'
import tryCatch from './utils/tryCatch.js'

export const getUsers = tryCatch(async (req, res) => {
    const users = await User.find().sort({ _id: -1 });
    res.status(200).json({ success: true, result: users }); 
  });