<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Ashgate</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d97706;">Welcome to Ashgate, {{ $user->name }}!</h2>
        
        <p>We are pleased to inform you that your application has been approved.</p>
        
        <p>An account has been created for you. You can now log in to manage your properties and access your dashboard.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Email:</strong> {{ $user->email }}</p>
            <p style="margin: 10px 0 0;"><strong>Temporary Password:</strong> {{ $password }}</p>
        </div>
        
        <p>Please log in and change your password immediately.</p>
        
        <p>
            <a href="{{ url('/login') }}" style="display: inline-block; background-color: #d97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Dashboard</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666;">
            If you did not request this account, please contact our support team immediately.
        </p>
    </div>
</body>
</html>

