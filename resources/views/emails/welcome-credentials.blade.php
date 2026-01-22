<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Ashgate</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d97706;">Welcome to Ashgate, {{ $user->name }}!</h2>
        
        <p>We are pleased to inform you that your application has been approved.</p>
        
        <p>An account has been created for you. To get started, please set up your password by clicking the button below.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Email:</strong> {{ $user->email }}</p>
        </div>
        
        <p style="margin: 20px 0;">
            <a href="{{ $frontendUrl }}/set-password?token={{ $token }}&email={{ urlencode($user->email) }}" style="display: inline-block; background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Set Up Your Password</a>
        </p>
        
        <p style="font-size: 14px; color: #666;">
            This link will expire in 24 hours. If you have any issues, please contact us at <a href="mailto:info@ashgate.co.ke">info@ashgate.co.ke</a> or call +254 700 580 379.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666;">
            If you did not request this account, please contact our support team immediately at <a href="mailto:info@ashgate.co.ke">info@ashgate.co.ke</a>.
        </p>
        <p style="font-size: 12px; color: #666; margin-top: 10px;">
            <strong>Ashgate Limited</strong><br>
            Nairobi, Kenya<br>
            Phone: +254 700 580 379<br>
            Email: info@ashgate.co.ke
        </p>
    </div>
</body>
</html>

