import { Router } from "express";
import { createChantier, getChantiers } from "../controllers/Chantier.js";
import { auth } from "../middleware/auth.js";
import deleteChantier from "../controllers/deleteChantier.js";
import updateChantier from "../controllers/updateChantier.js";
import checkAccess from '../middleware/checkAccess.js';
import chantierPermissions from "../middleware/permissions/chantier/chantierPermissions.js";

const ChantierRouter = Router();

ChantierRouter.post('/', auth, createChantier);
ChantierRouter.get('/', getChantiers);
ChantierRouter.delete('/:ChantierId', auth, checkAccess(chantierPermissions.delete), deleteChantier);
ChantierRouter.patch('/:ChantierId', auth, checkAccess(chantierPermissions.update), updateChantier);

export default ChantierRouter;
