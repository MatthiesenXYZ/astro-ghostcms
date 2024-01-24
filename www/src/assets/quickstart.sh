# First Create a fresh Astro Install
npm create astro@latest
# Create Empty Install with standard typescript
# Then Delete entire 'pages' folder under '/src/'
npx astro add @matthiesenxyz/astro-ghostcms
# Then Create the following environment variables in .env
# Tip: Set these to YOUR GhostCMS server to pull your content!
CONTENT_API_KEY=a33da3965a3a9fb2c6b3f63b48
CONTENT_API_URL=https://ghostdemo.matthiesen.xyz