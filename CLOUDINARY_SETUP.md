# Connect Cloudinary image uploads

The business dashboard uploads optimized logo and cover images directly from the browser to Cloudinary. The API secret is only read by the server and must never be placed in browser code.

## Local development

1. Create a Cloudinary account and open **Console → Settings → API Keys**.
2. Copy `.env.example` to `.env.local` in the project root.
3. Fill in `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `.env.local`.
4. Restart the local server with `npm run dev` and open the dashboard again.

`.env.local` is ignored by Git. Do not commit or share it.

## Vercel deployment

In the ServeKerala Vercel project, open **Settings → Environment Variables** and add the same three variable names for the environments you deploy (Production, and Preview if needed). Save and redeploy so the function receives them.

The signing endpoint checks the Firebase ID token, verified email, and the selected Firestore profile ownership before it returns a short-lived upload signature. Profile documents continue to store the image URL and Cloudinary public ID, so public profile rendering stays provider-neutral.
