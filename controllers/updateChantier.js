import Chantier from '../models/Chantier.js';
import tryCatch from './utils/tryCatch.js';

const updateChantier = tryCatch(async (req, res) => {
    const updatedChantier = await Chantier.findByIdAndUpdate(
      req.params.ChantierId,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, result: updatedChantier });  
  });
export default updateChantier;