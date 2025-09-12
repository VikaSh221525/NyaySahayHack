import advocateModel from "../models/Advocate.model.js";
import clientModel from "../models/Client.model.js";
import ConsultationRequest from "../models/ConsultationRequest.model.js";

// Get recommended advocates for clients
export async function getRecommendedAdvocates(req, res) {
    try {
        const currentUserId = req.user._id;

        // Only clients can get recommended advocates
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: "Only clients can view recommended advocates" });
        }

        // Get advocates that client hasn't sent requests to
        const existingRequests = await ConsultationRequest.find({
            client: currentUserId
        }).select('advocate');

        const requestedAdvocateIds = existingRequests.map(req => req.advocate);

        // Find advocates excluding those already requested
        const recommendedAdvocates = await advocateModel.find({
            $and: [
                { _id: { $nin: requestedAdvocateIds } }, // Exclude already requested advocates
                { lawFirm: { $exists: true, $ne: null } }, // Only completed profiles
                { barCouncilNumber: { $exists: true, $ne: null } }
            ]
        }).select('fullName email specialization yearsOfPractice location lawFirm profilePicture bio')
            .limit(20)
            .sort({ yearsOfPractice: -1 }); // Sort by experience

        res.status(200).json({
            message: "Recommended advocates retrieved successfully",
            advocates: recommendedAdvocates
        });

    } catch (err) {
        console.log("Error in getting recommended advocates", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Client sends consultation request to advocate
export async function sendConsultationRequest(req, res) {
    try {
        const clientId = req.user._id;
        const { advocateId } = req.params;
        const { message, legalIssue, urgency } = req.body;

        // Only clients can send consultation requests
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: "Only clients can send consultation requests" });
        }

        // Validate required fields
        if (!message || !legalIssue) {
            return res.status(400).json({ message: "Message and legal issue are required" });
        }

        // Prevent sending request to yourself (shouldn't happen but safety check)
        if (clientId.toString() === advocateId.toString()) {
            return res.status(400).json({ message: "Invalid request" });
        }

        // Check if advocate exists and has completed profile
        const advocate = await advocateModel.findById(advocateId);
        if (!advocate) {
            return res.status(404).json({ message: "Advocate not found" });
        }

        if (!advocate.lawFirm || !advocate.barCouncilNumber) {
            return res.status(400).json({ message: "Advocate profile is incomplete" });
        }

        // Check if request already exists
        const existingRequest = await ConsultationRequest.findOne({
            client: clientId,
            advocate: advocateId,
            status: { $in: ['pending', 'accepted'] }
        });

        if (existingRequest) {
            if (existingRequest.status === 'accepted') {
                return res.status(400).json({ message: "You are already connected with this advocate" });
            }
            return res.status(400).json({ message: "Consultation request already sent" });
        }

        // Create consultation request
        const consultationRequest = await ConsultationRequest.create({
            client: clientId,
            advocate: advocateId,
            message: message.trim(),
            legalIssue,
            urgency: urgency || 'medium'
        });

        // Populate the request for response
        const populatedRequest = await ConsultationRequest.findById(consultationRequest._id)
            .populate('advocate', 'fullName specialization lawFirm profilePicture');

        res.status(201).json({
            message: "Consultation request sent successfully",
            request: populatedRequest
        });

    } catch (err) {
        console.log("Error in sending consultation request", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Advocate accepts consultation request
export async function acceptConsultationRequest(req, res) {
    try {
        const { requestId } = req.params;
        const advocateId = req.user._id;

        // Only advocates can accept consultation requests
        if (req.user.role !== 'advocate') {
            return res.status(403).json({ message: "Only advocates can accept consultation requests" });
        }

        const consultationRequest = await ConsultationRequest.findById(requestId);

        if (!consultationRequest) {
            return res.status(404).json({ message: "Consultation request not found" });
        }

        // Check if the advocate is the recipient of this request
        if (consultationRequest.advocate.toString() !== advocateId.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        // Check if request is still pending
        if (consultationRequest.status !== 'pending') {
            return res.status(400).json({ message: "This request has already been processed" });
        }

        // Accept the request
        consultationRequest.status = 'accepted';
        consultationRequest.acceptedAt = new Date();
        await consultationRequest.save();

        // Populate for response
        const populatedRequest = await ConsultationRequest.findById(requestId)
            .populate('client', 'fullName email profilePicture')
            .populate('advocate', 'fullName specialization lawFirm');

        res.status(200).json({
            message: "Consultation request accepted successfully",
            request: populatedRequest
        });

    } catch (err) {
        console.log("Error in accepting consultation request", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Advocate rejects consultation request
export async function rejectConsultationRequest(req, res) {
    try {
        const { requestId } = req.params;
        const { rejectionReason } = req.body;
        const advocateId = req.user._id;

        // Only advocates can reject consultation requests
        if (req.user.role !== 'advocate') {
            return res.status(403).json({ message: "Only advocates can reject consultation requests" });
        }

        const consultationRequest = await ConsultationRequest.findById(requestId);

        if (!consultationRequest) {
            return res.status(404).json({ message: "Consultation request not found" });
        }

        // Check if the advocate is the recipient of this request
        if (consultationRequest.advocate.toString() !== advocateId.toString()) {
            return res.status(403).json({ message: "You are not authorized to reject this request" });
        }

        // Check if request is still pending
        if (consultationRequest.status !== 'pending') {
            return res.status(400).json({ message: "This request has already been processed" });
        }

        // Reject the request
        consultationRequest.status = 'rejected';
        consultationRequest.rejectedAt = new Date();
        consultationRequest.rejectionReason = rejectionReason || 'No reason provided';
        await consultationRequest.save();

        res.status(200).json({
            message: "Consultation request rejected successfully"
        });

    } catch (err) {
        console.log("Error in rejecting consultation request", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Advocate gets list of connected clients (accepted requests)
export async function getMyClients(req, res) {
    try {
        const advocateId = req.user._id;

        // Only advocates can get their clients
        if (req.user.role !== 'advocate') {
            return res.status(403).json({ message: "Only advocates can view their clients" });
        }

        const acceptedRequests = await ConsultationRequest.find({
            advocate: advocateId,
            status: 'accepted'
        }).populate('client', 'fullName email profilePicture phone state')
            .sort({ acceptedAt: -1 });

        const clients = acceptedRequests.map(request => ({
            requestId: request._id,
            client: request.client,
            legalIssue: request.legalIssue,
            urgency: request.urgency,
            acceptedAt: request.acceptedAt,
            message: request.message
        }));

        res.status(200).json({
            message: "Connected clients retrieved successfully",
            clients
        });

    } catch (err) {
        console.log("Error in getting clients", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Client gets list of connected advocates (accepted requests)
export async function getMyAdvocates(req, res) {
    try {
        const clientId = req.user._id;

        // Only clients can get their advocates
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: "Only clients can view their advocates" });
        }

        const acceptedRequests = await ConsultationRequest.find({
            client: clientId,
            status: 'accepted'
        }).populate('advocate', 'fullName email specialization yearsOfPractice lawFirm profilePicture location')
            .sort({ acceptedAt: -1 });

        const advocates = acceptedRequests.map(request => ({
            requestId: request._id,
            advocate: request.advocate,
            legalIssue: request.legalIssue,
            urgency: request.urgency,
            acceptedAt: request.acceptedAt
        }));

        res.status(200).json({
            message: "Connected advocates retrieved successfully",
            advocates
        });

    } catch (err) {
        console.log("Error in getting advocates", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Advocate gets incoming consultation requests (pending)
export async function getMyConsultationRequests(req, res) {
    try {
        const advocateId = req.user._id;

        // Only advocates can get their consultation requests
        if (req.user.role !== 'advocate') {
            return res.status(403).json({ message: "Only advocates can view consultation requests" });
        }

        const incomingRequests = await ConsultationRequest.find({
            advocate: advocateId,
            status: 'pending'
        }).populate('client', 'fullName email profilePicture phone state')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Consultation requests retrieved successfully",
            requests: incomingRequests
        });

    } catch (err) {
        console.log("Error in getting consultation requests", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Client gets outgoing consultation requests
export async function getOutgoingConsultationRequests(req, res) {
    try {
        const clientId = req.user._id;

        // Only clients can get their outgoing requests
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: "Only clients can view their requests" });
        }

        const outgoingRequests = await ConsultationRequest.find({
            client: clientId
        }).populate('advocate', 'fullName specialization lawFirm profilePicture yearsOfPractice')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Outgoing consultation requests retrieved successfully",
            requests: outgoingRequests
        });

    } catch (err) {
        console.log("Error in getting outgoing consultation requests", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}