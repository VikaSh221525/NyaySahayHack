import incidentModel from "../models/incident.model.js";
import { uploadFile } from "../service/storage.service.js";
import { sendIncidentReportEmail, sendConfirmationEmail } from "../service/email.service.js";

export async function reportIncident(req, res) {
    try {
        const { title, incidentDetails, location, incidentType, urgency } = req.body;
        const user = req.user;

        // Validate required fields
        if (!title || !incidentDetails || !location || !incidentType) {
            return res.status(400).json({
                message: "Title, incident details, location, and incident type are required"
            });
        }

        // Validate user is a client
        if (user.role !== 'client') {
            return res.status(403).json({
                message: "Only clients can report incidents"
            });
        }

        let evidenceFiles = [];

        // Handle file uploads if present
        if (req.files && req.files.length > 0) {
            try {
                const uploadPromises = req.files.map(async (file) => {
                    const uploadResult = await uploadFile(file, 'NyaySahay/incidents');
                    
                    // Determine file type
                    let fileType = 'document';
                    if (file.mimetype.startsWith('image/')) {
                        fileType = 'image';
                    } else if (file.mimetype.startsWith('video/')) {
                        fileType = 'video';
                    }

                    return {
                        url: uploadResult.url,
                        type: fileType,
                        filename: file.originalname
                    };
                });

                evidenceFiles = await Promise.all(uploadPromises);
            } catch (uploadError) {
                console.error("File upload error:", uploadError);
                return res.status(400).json({
                    message: "Failed to upload evidence files"
                });
            }
        }

        // Create incident report
        const incident = new incidentModel({
            title: title.trim(),
            incidentDetails: incidentDetails.trim(),
            location: location.trim(),
            incidentType,
            urgency: urgency || 'medium',
            reporterEmail: user.email,
            reportedBy: user._id,
            evidenceFiles
        });

        const savedIncident = await incident.save();

        // Send emails asynchronously
        try {
            // Send incident report to authorities with reporter contact info
            await sendIncidentReportEmail(savedIncident, {
                reporterName: user.fullName,
                reporterPhone: user.phone
            });
            
            // Send confirmation to reporter
            await sendConfirmationEmail(user.email, savedIncident);
            
            // Update incident to mark emails as sent
            savedIncident.emailSent = true;
            savedIncident.emailSentAt = new Date();
            await savedIncident.save();

        } catch (emailError) {
            console.error("Email sending error:", emailError);
            // Don't fail the request if email fails, just log it
        }

        res.status(201).json({
            message: "Incident report submitted successfully",
            incident: {
                _id: savedIncident._id,
                incidentNumber: savedIncident.incidentNumber,
                title: savedIncident.title,
                status: savedIncident.status,
                createdAt: savedIncident.createdAt,
                evidenceFiles: savedIncident.evidenceFiles.length
            }
        });

    } catch (error) {
        console.error("Error reporting incident:", error);
        res.status(500).json({
            message: "Internal server error while reporting incident"
        });
    }
}

export async function getMyIncidents(req, res) {
    try {
        const user = req.user;

        // Validate user is a client
        if (user.role !== 'client') {
            return res.status(403).json({
                message: "Only clients can view their incidents"
            });
        }

        const incidents = await incidentModel
            .find({ reportedBy: user._id })
            .sort({ createdAt: -1 })
            .select('-evidenceFiles'); // Don't send file URLs in list view

        res.status(200).json({
            message: "Incidents retrieved successfully",
            incidents: incidents.map(incident => ({
                _id: incident._id,
                incidentNumber: incident.incidentNumber,
                title: incident.title,
                incidentType: incident.incidentType,
                urgency: incident.urgency,
                status: incident.status,
                location: incident.location,
                createdAt: incident.createdAt,
                emailSent: incident.emailSent
            }))
        });

    } catch (error) {
        console.error("Error retrieving incidents:", error);
        res.status(500).json({
            message: "Internal server error while retrieving incidents"
        });
    }
}

export async function getIncidentDetails(req, res) {
    try {
        const { id } = req.params;
        const user = req.user;

        // Validate user is a client
        if (user.role !== 'client') {
            return res.status(403).json({
                message: "Only clients can view incident details"
            });
        }

        const incident = await incidentModel.findOne({
            _id: id,
            reportedBy: user._id
        });

        if (!incident) {
            return res.status(404).json({
                message: "Incident not found or access denied"
            });
        }

        res.status(200).json({
            message: "Incident details retrieved successfully",
            incident: {
                _id: incident._id,
                incidentNumber: incident.incidentNumber,
                title: incident.title,
                incidentDetails: incident.incidentDetails,
                incidentType: incident.incidentType,
                urgency: incident.urgency,
                status: incident.status,
                location: incident.location,
                reporterEmail: incident.reporterEmail,
                evidenceFiles: incident.evidenceFiles,
                emailSent: incident.emailSent,
                emailSentAt: incident.emailSentAt,
                createdAt: incident.createdAt,
                updatedAt: incident.updatedAt
            }
        });

    } catch (error) {
        console.error("Error retrieving incident details:", error);
        res.status(500).json({
            message: "Internal server error while retrieving incident details"
        });
    }
}