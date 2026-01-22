<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        if (!$user->is_active) {
            return response()->json(['message' => 'Account is inactive'], 403);
        }

        // Check if user must change password
        if ($user->must_change_password) {
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'message' => 'Password change required',
                'require_password_change' => true,
                'user' => $user->load('roles'),
                'token' => $token
            ]);
        }

        // Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Load user roles
        $user->load('roles');

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'require_password_change' => false
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Invalid current password'], 401);
        }

        // Check limit (max 4 changes)
        if (($user->password_change_count ?? 0) >= 4) {
            $user->update(['is_active' => false]);
            
            // Log the account lockout
            activity()
                ->causedBy($user)
                ->performedOn($user)
                ->withProperties(['reason' => 'password_change_limit_exceeded'])
                ->log('Account locked due to excessive password changes');
            
            return response()->json([
                'message' => 'Security alert: You have exceeded the maximum number of password changes (4). Your account has been locked for security reasons. Please contact Ashgate administrators at info@ashgate.co.ke to unlock your account.',
                'account_locked' => true
            ], 403);
        }

        // Update password with SHA-256 hashing (Laravel's Hash::make uses bcrypt by default, but we can configure it)
        $user->update([
            'password' => Hash::make($request->new_password),
            'must_change_password' => false,
            'password_changed_at' => now(),
            'password_change_count' => ($user->password_change_count ?? 0) + 1,
        ]);

        // Log password change activity
        activity()
            ->causedBy($user)
            ->performedOn($user)
            ->withProperties(['ip' => $request->ip()])
            ->log('Password changed');

        return response()->json(['message' => 'Password updated successfully.']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // We will send the link to the client side.
        // Ensure APP_URL in .env points to frontend or configure reset URL in AuthServiceProvider
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => __($status)]);
        }

        return response()->json(['email' => __($status)], 422);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => __($status)]);
        }

        return response()->json(['email' => __($status)], 422);
    }
    
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Validate password setup token
     */
    public function validatePasswordToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['valid' => false, 'message' => 'User not found'], 404);
        }

        // Check if a token record exists for this email
        // Note: We do a basic check here. Full token validation happens in setPassword via Password::reset()
        // Laravel stores tokens hashed, so we verify by attempting to get the broker and check token existence
        $tokenRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$tokenRecord) {
            return response()->json(['valid' => false, 'message' => 'No password setup link found for this email'], 422);
        }

        // Check if token is not expired (default is 60 minutes)
        $tokenExpiryMinutes = config('auth.passwords.users.expire', 60);
        $expiresAt = now()->subMinutes($tokenExpiryMinutes);
        
        if ($tokenRecord->created_at < $expiresAt) {
            return response()->json(['valid' => false, 'message' => 'This link has expired. Please request a new one.'], 422);
        }

        // Token exists and is not expired
        // Full token validation will happen in setPassword method
        return response()->json([
            'valid' => true,
            'message' => 'Token is valid',
            'email' => $user->email,
            'name' => $user->name,
        ]);
    }

    /**
     * Set password using token (for new users setting up their password)
     */
    public function setPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'must_change_password' => false, // Password is now set, no need to change
                    'password_changed_at' => now(),
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password set successfully. You can now log in.',
            ]);
        }

        return response()->json([
            'message' => $status === Password::INVALID_TOKEN 
                ? 'Invalid or expired token' 
                : 'Unable to set password. Please request a new link.',
        ], 422);
    }
}
