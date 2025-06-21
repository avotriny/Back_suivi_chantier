import express from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const convos = await Conversation.find({ participants: userId })
      .populate({
        path: 'lastMessage',
        select: 'text createdAt senderId'
      })
      .sort({ updatedAt: -1 });
    res.json(convos);
  } catch (err) {
    console.error('Convo fetch error', err);
    res.status(500).json({ message: err.message });
  }
});

// Créer ou mettre à jour une conversation au nouvel envoi de message
router.post('/', auth, async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    const message = new Message({ senderId, receiverId, text });
    await message.save();

    const convo = await Conversation.findOneAndUpdate(
      { participants: { $all: [senderId, receiverId] } },
      {
        $set: { lastMessage: message._id, updatedAt: Date.now() },
        $addToSet: { participants: [senderId, receiverId] }
      },
      { new: true, upsert: true }
    )
    .populate({
      path: 'lastMessage',
      select: 'text fileUrl createdAt senderId receiverId'
    });

    res.status(201).json({ message, conversation: convo });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
