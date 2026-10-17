# Youth Wamphamvu Organization — Premium Website

## Run locally
1. Open this folder in VS Code.
2. Install the VS Code extension **Live Server** (Ritwick Dey), if you don't already have it.
3. Right-click `index.html` and select **Open with Live Server**.
   Alternatively, open `index.html` directly in a browser. Some features work best through Live Server.

## Add your audio and video
Create a folder named `media` inside this project:
- `media/ywz-campaign.mp4` — your campaign video
- `media/ywz-message.mp3` — your short audio message

The file names and extensions must match the HTML source paths. If your video is `.mov`, convert it to MP4 (H.264 video + AAC audio) for broader browser compatibility, or update the `<source>` type and test on your target browsers.

## Important before publishing
- Replace demo photos with organization-approved images. The current photos load from Unsplash and need an internet connection.
- Confirm all organization descriptions, programme details, contact information, safeguarding language, and any claims before launch.
- The contact form validates locally and prepares an email using the visitor's default mail app. It does not send/store form submissions on a server. For a real contact form, connect a trusted form service or build a backend.
- The website is a static front-end demo; it does not process donations or store personal data.
- Theme, accent colour and motion preferences are saved in the visitor's browser using localStorage.
