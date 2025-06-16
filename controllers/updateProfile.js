import Chantier from "../models/Chantier.js";
import User from "../models/User.js";
import tryCatch from "./utils/tryCatch.js";
import jwt from "jsonwebtoken";

const updateProfile = tryCatch(async (req, res) => {
  const fields = req.body?.photoURL ? {name:req.body.name, photoURL:req.body.photoURL} : {name:req.body.name}
    const updatedUser = await User.findByIdAndUpdate(req.user.id, fields, {
      new: true,
    });
    const { _id: id, name, photoURL, role } = updatedUser; 

    await Chantier.updateMany({uid:id}, {uName: name, uImage:photoURL})
    const token = jwt.sign({ id, name, photoURL, role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ success: true, result: { name, photoURL, token } });
  });
  export default updateProfile;
