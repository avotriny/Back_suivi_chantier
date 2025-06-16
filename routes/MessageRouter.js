import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Message from '../models/Message.js';

const router = express.Router();

// __dirname en ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Multer config
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (_req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ok = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error('Only images and PDFs allowed'), ok);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// Récupérer tous les messages entre deux users, triés chronologiquement
router.get('/:senderId/:receiverId', async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId,   receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    })
    .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Envoyer un message (texte + fichier optionnel)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ message: 'senderId, receiverId and text are required' });
    }

    let fileUrl;
    if (req.file) {
      const host = req.get('host');
      fileUrl = `${req.protocol}://${host}/uploads/${req.file.filename}`;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      fileUrl,
      createdAt: new Date()
    });

    const saved = await newMessage.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
