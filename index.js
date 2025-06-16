import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import chantierRouter from './routes/ChantierRouter.js';
import profileRouter from './routes/profileRouter.js';
import userRouter from './routes/useRouter.js';
import conversationRouter from './routes/conversationRouter.js';
import messageRouter from './routes/messageRouter.js'; // Import message router

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Middleware pour CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization'],
}));

// Middleware pour les téléchargements de fichiers
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Répertoire pour stocker les fichiers
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: Images seulement!');
  }
});

// Middleware pour JSON
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/user', userRouter);
app.use('/chantier', chantierRouter);
app.use('/users', profileRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter); // Définir la route pour les messages

// Route pour le téléchargement de fichiers
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

// Route de base
app.get('/', (req, res) => res.json({ message: 'Welcome to our API' }));

// Gestion des erreurs 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Not Found' }));

// Configuration de WebSocket
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('sendMessage', async (data) => {
    try {
      const message = new Message(data);
      await message.save();
      io.emit('receiveMessage', message);
    } catch (error) {
      console.error('Error handling sendMessage event:', error);
    }
  });

  socket.on('sendFile', async (data) => {
    try {
      const message = new Message({
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: `File uploaded: ${data.fileName}`,
        createdAt: Date.now()
      });
      await message.save();
      io.emit('receiveMessage', message);
    } catch (error) {
      console.error('Error handling sendFile event:', error);
    }
  });

  // WebRTC signaling
  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Connexion à MongoDB et démarrage du serveur
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT);
    console.log('Connected to MongoDB');
    server.listen(port, () => console.log(`Server is listening on Port: ${port}`));
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

startServer();
