<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
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
}
