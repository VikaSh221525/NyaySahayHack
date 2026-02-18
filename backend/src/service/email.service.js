import nodemailer from 'nodemailer';

// Create transporter (you'll need to configure this with your email provider)
const createTransporter = () => {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️  Email credentials not configured. Emails will be logged instead of sent.');
        return null;
    }

    // For Gmail, you'll need to use App Password
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS  // Your app password
        }
    });
};

// Send incident report email
export const sendIncidentReportEmail = async (incidentData, reporterContact = {}) => {
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
                reporterName: reporterContact.reporterName,
                reporterEmail: incidentData.reporterEmail,
                reporterPhone: reporterContact.reporterPhone,
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
                .critical { border-left: 4px solid #dc2626; }
                .reporter-info { background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2563eb; }
                .contact-item { margin: 8px 0; padding: 8px; background-color: white; border-radius: 4px; }
                .footer { background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; }
                .evidence-list { margin: 10px 0; }
                .evidence-item { background-color: #e2e8f0; padding: 8px; margin: 5px 0; border-radius: 4px; }
                .highlight { font-weight: bold; color: #1e40af; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>� NyaySahay - Incident Report</h1>
                <p>Incident Number: ${incidentData.incidentNumber}</p>
            </div>
            
            <div class="content">
                <div class="incident-details ${incidentData.urgency}">
                    <h2>📋 Incident Details</h2>
                    <p><strong>Title:</strong> ${incidentData.title}</p>
                    <p><strong>Type:</strong> ${incidentData.incidentType.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Urgency:</strong> <span class="highlight">${incidentData.urgency.toUpperCase()}</span></p>
                    <p><strong>Location:</strong> ${incidentData.location}</p>
                    <p><strong>Reported At:</strong> ${new Date(incidentData.createdAt).toLocaleString('en-IN', { 
                        dateStyle: 'full', 
                        timeStyle: 'long' 
                    })}</p>
                </div>

                <div class="reporter-info">
                    <h2>👤 Reporter Contact Information</h2>
                    <p style="margin-bottom: 10px;"><em>Please contact the reporter for verification or additional information:</em></p>
                    <div class="contact-item">
                        <strong>📛 Full Name:</strong> ${reporterContact.reporterName || 'Not provided'}
                    </div>
                    <div class="contact-item">
                        <strong>📧 Email:</strong> <a href="mailto:${incidentData.reporterEmail}">${incidentData.reporterEmail}</a>
                    </div>
                    <div class="contact-item">
                        <strong>📱 Phone:</strong> <a href="tel:${reporterContact.reporterPhone}">${reporterContact.reporterPhone || 'Not provided'}</a>
                    </div>
                </div>

                <div class="incident-details">
                    <h3>📝 Detailed Description</h3>
                    <p style="white-space: pre-wrap;">${incidentData.incidentDetails}</p>
                </div>

                ${incidentData.evidenceFiles && incidentData.evidenceFiles.length > 0 ? `
                <div class="incident-details">
                    <h3>📎 Evidence Files (${incidentData.evidenceFiles.length})</h3>
                    <div class="evidence-list">
                        ${incidentData.evidenceFiles.map((file, index) => `
                            <div class="evidence-item">
                                <strong>Evidence ${index + 1} - ${file.type.toUpperCase()}:</strong> 
                                <a href="${file.url}" target="_blank" style="color: #2563eb;">${file.filename || 'View Evidence'}</a>
                            </div>
                        `).join('')}
                    </div>
                    <p style="margin-top: 10px; font-size: 12px; color: #666;">
                        <em>Click on the links above to view or download the evidence files.</em>
                    </p>
                </div>
                ` : ''}

                <div class="incident-details">
                    <h3>⚠️ Action Required</h3>
                    <p>This incident report has been submitted through the NyaySahay platform and requires immediate attention from the appropriate authorities.</p>
                    <p><strong>Recommended Actions:</strong></p>
                    <ul>
                        <li>Verify the incident details by contacting the reporter</li>
                        <li>Review all evidence files attached</li>
                        <li>Investigate the matter as per legal procedures</li>
                        <li>Take necessary action as per the law</li>
                        <li>Update the case status on the platform</li>
                    </ul>
                </div>
            </div>

            <div class="footer">
                <p><strong>This is an automated email from NyaySahay Platform</strong></p>
                <p>For technical support or queries about the platform, please contact: support@nyaysahay.com</p>
                <p>© 2024 NyaySahay - Justice for All | Empowering Citizens, Ensuring Justice</p>
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