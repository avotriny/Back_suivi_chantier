import Chantier from '../models/Chantier.js';
import tryCatch from './utils/tryCatch.js';

const deleteChantier = tryCatch(async (req, res) => {
  const { _id } = await Chantier.findByIdAndDelete(req.params.chantierId);
  res.status(200).json({ success: true, result: { _id } });
});

export default deleteChantier;