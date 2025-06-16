import express from 'express';
import User from '../models/User.js'; // Assurez-vous que le modèle User est correctement importé

const profileRouter = express.Router();

// Route to get user details by ID
profileRouter.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default profileRouter;
