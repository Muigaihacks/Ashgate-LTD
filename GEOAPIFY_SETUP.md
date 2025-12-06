# Geoapify API Key Setup Guide

## Which API Key Do You Need?

For the Ashgate platform, you need the **Places API** key to fetch nearby amenities (schools, hospitals, supermarkets, transit stations).

## Steps to Get Your API Key

### Option 1: Main API Key (Recommended)
1. Log into your [Geoapify Account](https://myprojects.geoapify.com/)
2. Go to **"My Projects"** or **"API Keys"** section
3. You should see your **main API key** - this single key works for all Geoapify services including:
   - Places API (what we need)
   - Geocoding API
   - Routing API
   - Map Tiles (if needed later)

**Use this main API key** - it's the simplest option and works for everything.

### Option 2: Service-Specific Keys (If Available)
If you see separate keys for different services:

1. Select **"Places API"** key
   - This is the one we're using: `https://api.geoapify.com/v2/places`
   - Used to fetch nearby POIs (Points of Interest)

2. **DO NOT** use these separately (unless specifically required):
   - Map Tiles API - only if you want to use Geoapify's map tiles (we're using MapTiler for maps)
   - Geocoding API - only if you need address lookup (not currently used)
   - Routing API - only if you need directions/routing (not currently used)

## Current Implementation

We're using the **Places API v2** endpoint:
```
https://api.geoapify.com/v2/places?categories=...&filter=circle:...&apiKey=YOUR_KEY
```

This endpoint fetches:
- Schools (education.school, education.university, education.college)
- Hospitals (healthcare.hospital, healthcare.clinic, healthcare.pharmacy)
- Supermarkets (commercial.supermarket, commercial.marketplace)
- Transit stations (public_transport.bus_station, train_station, etc.)

## Setup in Your Project

1. Add the key to your `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_GEOAPIFY_KEY=your_geoapify_api_key_here
   ```

2. Restart your development server after adding the key.

## Free Tier Limits

- **3,000 requests per day** on the free tier
- Each listing opening fetches amenities (4 requests per listing: one per category)
- Should be sufficient for development and testing
- Monitor usage in your Geoapify dashboard

## Production Deployment

When deploying to production:

1. Add `NEXT_PUBLIC_GEOAPIFY_KEY` to your hosting platform's environment variables
2. **Important**: Add your production domain to Geoapify's "Allowed Origins" in your dashboard to prevent CORS issues
   - Go to your Geoapify dashboard
   - Navigate to API Key settings
   - Add your production domain (e.g., `https://yourdomain.com`)

## Testing

Once you've added the key:
1. Open a listing details modal
2. Click on the "Map & Amenities" tab (should be active by default)
3. Click the amenity buttons (Schools, Hospitals, Supermarkets, Transit)
4. You should see colored markers appear on the map showing nearby amenities

## Troubleshooting

- **No amenities showing?** Check browser console for errors
- **403 errors?** Make sure your API key is correct and your domain is whitelisted
- **Rate limit errors?** You've exceeded 3,000 requests/day on free tier

