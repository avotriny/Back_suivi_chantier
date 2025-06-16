import tryCatch from './utils/tryCatch.js'
import Chantier from '../models/Chantier.js'

export const createChantier = tryCatch(async (req, res) => {
  const {id:uid, name:uName, photoURL:uImage}=req.user
  const newChantier=new Chantier({...req.body, uid, uName, uImage})
    await newChantier.save()
    res.status(201).json({success:true, result:newChantier})
  })

  export const getChantiers = tryCatch(async (req, res) => {
    const chantiers = await Chantier.find().sort({ _id: -1 });
    res.status(200).json({ success: true, result: chantiers }); 
  });