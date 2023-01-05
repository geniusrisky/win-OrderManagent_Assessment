import { Router } from "express";
import teamController from "./Team.controller.js";


const router = Router();

router.post('/createTeam', teamController.createTeam)
router.get('/getTeam/:id', teamController.getTeamById)
router.get('/getTeams', teamController.getTeams)

router.put('/updateTeam/:id', teamController.updateTeam)

router.delete('/deleteTeam/:id', teamController.deleteTeam)
export default router;