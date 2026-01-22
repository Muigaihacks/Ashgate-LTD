<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ApplicationController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Application submission received', $request->all());

        try {
            $validated = $request->validate([
                'recaptchaToken' => 'required|string',
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'profession' => 'required|string',
                'yearsOfExperience' => 'required|numeric',
                'serialNumber' => 'required|string',
                'professionalBoard' => 'required|string',
                'bio' => 'required|string',
                'documents' => 'array',
                'documents.*' => 'file|max:5120', // 5MB max
            ]);

            // Verify CAPTCHA to prevent bot registrations
            $recaptchaSecret = config('services.recaptcha.secret');

            if ($recaptchaSecret) {
                try {
                    $captchaResponse = Http::asForm()->post(
                        'https://www.google.com/recaptcha/api/siteverify',
                        [
                            'secret' => $recaptchaSecret,
                            'response' => $validated['recaptchaToken'],
                            'remoteip' => $request->ip(),
                        ]
                    );

                    $captchaData = $captchaResponse->json();

                    if (!($captchaData['success'] ?? false)) {
                        Log::warning('reCAPTCHA validation failed for application', [
                            'email' => $validated['email'] ?? null,
                            'errors' => $captchaData['error-codes'] ?? null,
                        ]);

                        return response()->json([
                            'message' => 'CAPTCHA validation failed. Please try again.',
                        ], 422);
                    }
                } catch (\Throwable $e) {
                    Log::error('reCAPTCHA verification error: ' . $e->getMessage());

                    return response()->json([
                        'message' => 'Unable to verify CAPTCHA. Please try again.',
                    ], 422);
                }
            } else {
                Log::warning('reCAPTCHA secret not configured. Skipping CAPTCHA verification.');
            }

            // Map frontend profession to backend types
            $type = 'expert';
            if ($validated['profession'] === 'real-estate-agent') {
                $type = 'agent';
            } elseif ($validated['profession'] === 'property-manager') {
                $type = 'owner'; // Assuming property manager = owner role for now as per user instruction
            } elseif ($validated['profession'] === 'property-owner') { // Adding this explicit case
                $type = 'owner';
            }

            // Handle File Uploads
            $documentPaths = [];
            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $file) {
                    $path = $file->store('application-documents', 'public');
                    $documentPaths[] = $path;
                }
            }

            // Create Application Record
            $application = Application::create([
                'name' => $validated['firstName'] . ' ' . $validated['lastName'],
                'email' => $validated['email'],
                'type' => $type,
                'status' => 'pending',
                'details' => [
                    'phone' => $validated['phone'],
                    'profession' => $validated['profession'],
                    'registration_number' => $validated['serialNumber'],
                    'professional_board' => $validated['professionalBoard'],
                    'agency' => $validated['professionalBoard'], // For agents, this is the agency name
                    'years_of_experience' => $validated['yearsOfExperience'],
                    'bio' => $validated['bio'],
                ],
                'documents' => $documentPaths,
            ]);

            return response()->json([
                'message' => 'Application submitted successfully',
                'application_id' => $application->id
            ], 201);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Application submission error: ' . $e->getMessage());
            return response()->json(['message' => 'Server error occurred'], 500);
        }
    }

    /**
     * Get user's application (for authenticated users to view their own application)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $application = Application::where('email', $user->email)
            ->where('status', 'approved')
            ->first();

        if (!$application) {
            return response()->json(['message' => 'Application not found'], 404);
        }

        return response()->json($application);
    }
}
