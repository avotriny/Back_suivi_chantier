import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  file: { type: String }, // Ajout du champ file pour le chemin du fichier
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('messages', messageSchema);
export default Message;
