import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { uploadMultipleFiles } from "../middlewares/upload.middleware.js";
import { reportIncident, getMyIncidents, getIncidentDetails } from "../controllers/incident.controller.js";

const router = express.Router();

// POST /api/incidents - Report new incident (clients only)
router.post('/', protectRoute, uploadMultipleFiles, reportIncident);

// GET /api/incidents - Get all incidents for the logged-in client
router.get('/', protectRoute, getMyIncidents);

// GET /api/incidents/:id - Get specific incident details
router.get('/:id', protectRoute, getIncidentDetails);

export default router;