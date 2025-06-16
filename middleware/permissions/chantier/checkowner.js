import Chantier from '../../../models/Chantier.js'

const checkOwner = async (req)=>{
    try{
        const chantier = await Chantier.findOne({_id:req.params.chantierId, uid:req.user.id})
        if(chantier) return true
        return false
    }catch(error){
        console.log(error)
        return 'error'
    }
}

export default checkOwner;