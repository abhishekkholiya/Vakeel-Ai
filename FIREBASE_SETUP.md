# Firebase Setup Guide

## Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication in the Firebase Console

## Step 2: Get Firebase Configuration
1. In your Firebase project console, click on the gear icon (⚙️) next to 'Project Overview'
2. Select 'Project settings'
3. Scroll down to the 'Your apps' section
4. Click on the web icon (</>)
5. Register your app with a nickname
6. Copy the Firebase configuration object

## Step 3: Set Up Environment Variables
Create a `.env.local` file in your project root and add these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the values with your Firebase configuration details.

## Step 4: Restart Development Server
After setting up the environment variables:
1. Stop your development server if it's running
2. Run `npm run dev` to start the server with the new environment variables

## Troubleshooting
- If you see 'Service is unavailable', check that all environment variables are correctly set
- Verify that the Firebase configuration in `firebase/config.js` matches your Firebase project settings
- Ensure you've enabled Authentication in your Firebase project console