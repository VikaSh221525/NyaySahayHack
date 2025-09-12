import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
    getRecommendedAdvocates,
    sendConsultationRequest,
    acceptConsultationRequest,
    rejectConsultationRequest,
    getMyClients,
    getMyAdvocates,
    getMyConsultationRequests,
    getOutgoingConsultationRequests
} from "../controllers/AdvocateClient.controller.js";

const router = express.Router();

// Protect all routes (only logged-in users can access)
router.use(protectRoute);

// Recommended Advocates for clients to connect
router.get("/recommended-advocates", getRecommendedAdvocates);

// Client sends consultation request to Advocate
router.post("/consultation-request/:advocateId", sendConsultationRequest);

// Advocate accepts consultation request
router.put("/consultation-request/:requestId/accept", acceptConsultationRequest);

// Advocate rejects consultation request
router.put("/consultation-request/:requestId/reject", rejectConsultationRequest);

// Advocate → get list of clients (accepted requests)
router.get("/my-clients", getMyClients);

// Client → get list of advocates they’re connected with
router.get("/my-advocates", getMyAdvocates);

// Advocate → see incoming consultation requests (pending)
router.get("/consultation-requests", getMyConsultationRequests);

// Client → see outgoing consultation requests
router.get("/outgoing-consultation-requests", getOutgoingConsultationRequests);

export default router;