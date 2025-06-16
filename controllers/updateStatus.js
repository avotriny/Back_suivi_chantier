import User from "../models/User.js";
import tryCatch from "./utils/tryCatch.js";


const updateStatus = tryCatch(async(req, res)=>{
    const {role, active}=req.body
    await User.findByIdAndUpdate(req.params.userId, {role, active}) 
    res.status(200).json({
      success:true, result:{_id:req.params.userId} 
    })
  })
  export default updateStatus;