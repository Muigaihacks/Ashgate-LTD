<!DOCTYPE html>
<html>
<head>
    <title>Application Approved</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0ea5e9;">Welcome to Ashgate!</h1>
        </div>
        
        <p>Dear {{ $application->name }},</p>
        
        <p>We are thrilled to inform you that your application to join the Ashgate Community as a verified <strong>{{ ucfirst($application->details['profession'] ?? 'Professional') }}</strong> has been approved!</p>
        
        <p>Our team has verified your credentials, and your profile has been successfully added to our Community Experts directory.</p>
        
        <p><strong>What happens next?</strong></p>
        <p>Your profile is now visible to thousands of homeowners and investors looking for trusted professionals like you. You may start receiving inquiries directly via the contact details you provided.</p>
        
        <p>If you need to update your profile details in the future, please contact our support team at <a href="mailto:support@ashgate.co.ke">support@ashgate.co.ke</a>.</p>
        
        <p>Thank you for being part of the Ashgate ecosystem.</p>
        
        <p>Best regards,<br>
        The Ashgate Team</p>
        
        <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
            <p>&copy; {{ date('Y') }} Ashgate Limited. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

