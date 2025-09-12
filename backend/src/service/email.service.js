import nodemailer from 'nodemailer';

// Create transporter (you'll need to configure this with your email provider)
const createTransporter = () => {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️  Email credentials not configured. Emails will be logged instead of sent.');
        return null;
    }

    // For Gmail, you'll need to use App Password
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS  // Your app password
        }
    });
};

// Send incident report email
export const sendIncidentReportEmail = async (incidentData) => {
    try {
        const transporter = createTransporter();

        // If no transporter (no email config), just log the email
        if (!transporter) {
            console.log('📧 INCIDENT REPORT EMAIL (would be sent to authorities):');
            console.log('To: eatyourpickle850@gmail.com');
            console.log('Subject: 🚨 URGENT: Incident Report -', incidentData.incidentNumber, '-', incidentData.title);
            console.log('Incident Details:', {
                number: incidentData.incidentNumber,
                title: incidentData.title,
                type: incidentData.incidentType,
                urgency: incidentData.urgency,
                location: incidentData.location,
                reporter: incidentData.reporterEmail,
                description: incidentData.incidentDetails,
                evidenceFiles: incidentData.evidenceFiles?.length || 0
            });
            return { messageId: 'test-' + Date.now() };
        }

        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .incident-details { background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
                .urgent { border-left: 4px solid #ef4444; }
                .high { border-left: 4px solid #f59e0b; }
                .medium { border-left: 4px solid #3b82f6; }
                .low { border-left: 4px solid #10b981; }
                .footer { background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; }
                .evidence-list { margin: 10px 0; }
                .evidence-item { background-color: #e2e8f0; padding: 8px; margin: 5px 0; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🚨 NyaySahay - Incident Report</h1>
                <p>Incident Number: ${incidentData.incidentNumber}</p>
            </div>
            
            <div class="content">
                <div class="incident-details ${incidentData.urgency}">
                    <h2>📋 Incident Details</h2>
                    <p><strong>Title:</strong> ${incidentData.title}</p>
                    <p><strong>Type:</strong> ${incidentData.incidentType.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Urgency:</strong> ${incidentData.urgency.toUpperCase()}</p>
                    <p><strong>Location:</strong> ${incidentData.location}</p>
                    <p><strong>Reporter Email:</strong> ${incidentData.reporterEmail}</p>
                    <p><strong>Reported At:</strong> ${new Date(incidentData.createdAt).toLocaleString()}</p>
                </div>

                <div class="incident-details">
                    <h3>📝 Description</h3>
                    <p>${incidentData.incidentDetails}</p>
                </div>

                ${incidentData.evidenceFiles && incidentData.evidenceFiles.length > 0 ? `
                <div class="incident-details">
                    <h3>📎 Evidence Files</h3>
                    <div class="evidence-list">
                        ${incidentData.evidenceFiles.map(file => `
                            <div class="evidence-item">
                                <strong>${file.type.toUpperCase()}:</strong> 
                                <a href="${file.url}" target="_blank">${file.filename || 'View Evidence'}</a>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="incident-details">
                    <h3>⚠️ Action Required</h3>
                    <p>This incident report has been submitted through the NyaySahay platform and requires immediate attention from the appropriate authorities.</p>
                    <p>Please investigate this matter and take necessary action as per the law.</p>
                </div>
            </div>

            <div class="footer">
                <p>This is an automated email from NyaySahay Platform</p>
                <p>For any queries, please contact: support@nyaysahay.com</p>
                <p>© 2024 NyaySahay - Justice for All</p>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'eatyourpickle850@gmail.com', // Your fake email for prototype
            subject: `🚨 URGENT: Incident Report - ${incidentData.incidentNumber} - ${incidentData.title}`,
            html: emailHtml,
            // Add attachments if needed
            attachments: incidentData.evidenceFiles ? incidentData.evidenceFiles.map(file => ({
                filename: file.filename || `evidence_${Date.now()}`,
                path: file.url
            })) : []
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Incident report email sent:', result.messageId);
        return result;

    } catch (error) {
        console.error('Error sending incident report email:', error);
        throw error;
    }
};

// Send confirmation email to reporter
export const sendConfirmationEmail = async (reporterEmail, incidentData) => {
    try {
        const transporter = createTransporter();

        // If no transporter (no email config), just log the email
        if (!transporter) {
            console.log('📧 CONFIRMATION EMAIL (would be sent to reporter):');
            console.log('To:', reporterEmail);
            console.log('Subject: ✅ Incident Report Submitted -', incidentData.incidentNumber);
            console.log('Message: Your incident report has been submitted successfully.');
            console.log('Incident Number:', incidentData.incidentNumber);
            return { messageId: 'test-confirmation-' + Date.now() };
        }

        const confirmationHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .success-box { background-color: #f0fdf4; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 15px 0; }
                .footer { background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>✅ NyaySahay - Report Submitted Successfully</h1>
            </div>
            
            <div class="content">
                <div class="success-box">
                    <h2>Thank you for reporting the incident!</h2>
                    <p><strong>Incident Number:</strong> ${incidentData.incidentNumber}</p>
                    <p><strong>Title:</strong> ${incidentData.title}</p>
                    <p><strong>Status:</strong> Submitted</p>
                    <p><strong>Submitted At:</strong> ${new Date(incidentData.createdAt).toLocaleString()}</p>
                </div>

                <p>Your incident report has been successfully submitted and forwarded to the appropriate authorities.</p>
                
                <h3>What happens next?</h3>
                <ul>
                    <li>Your report has been forwarded to the cyber cell and relevant authorities</li>
                    <li>You will receive updates on the status of your report</li>
                    <li>If needed, authorities may contact you for additional information</li>
                    <li>You can track your report status using the incident number: <strong>${incidentData.incidentNumber}</strong></li>
                </ul>

                <p><strong>Important:</strong> Please keep this incident number for your records.</p>
            </div>

            <div class="footer">
                <p>This is an automated confirmation from NyaySahay Platform</p>
                <p>For any queries, please contact: support@nyaysahay.com</p>
                <p>© 2024 NyaySahay - Justice for All</p>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: reporterEmail,
            subject: `✅ Incident Report Submitted - ${incidentData.incidentNumber}`,
            html: confirmationHtml
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent to reporter:', result.messageId);
        return result;

    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw error;
    }
};