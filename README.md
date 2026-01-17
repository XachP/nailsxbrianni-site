# Nails x Brianni - Booking Site

Mobile-first booking site for a nail business with a bold pink/black aesthetic.

## Quick start (local)
- Open `index.html` via a local server so `config.json` loads.
- Example:
  - `python -m http.server 8080`
  - Visit `http://localhost:8080`

## Content management
Edit `config.json` for everything:
- `brand` = name/tagline
- `links` = primary nav + quick links
- `services` = cards on Services + booking dropdowns (add `"featured": true` to show on Home)
- `servicesEditor` = admin editor settings
- `policies` = Policies page
- `testimonials` = client reviews on Home
- `collections` = gallery content + editor settings
- `booking` = scheduler + deposit
- `contact` = location, map embed, and contact info

## Location map
Add a map embed URL in `contact.mapEmbedUrl` and a click-through link in `contact.mapLink`.

## Booking setup
Default mode uses an embedded scheduler.

### Path A (Square Appointments, preferred)
1. In Square Appointments, enable a deposit (fixed or percent).
2. Get your embed code or booking URL.
3. Paste into `config.json`:
   - `booking.embed.embedCode` for full widget embed, OR
   - `booking.embed.embedUrl` for iframe URL.

### Path B (Calendly + Stripe)
1. Enable Stripe payments in Calendly for required deposits.
2. Copy the Calendly embed code.
3. Paste into `booking.embed.embedCode`.

### Path C (Acuity Scheduling)
1. Enable deposits inside Acuity.
2. Copy the embed code or direct booking URL.
3. Paste into `booking.embed.embedCode` or `booking.embed.embedUrl`.

## Collections gallery
The gallery uses the JSON image list in `collections.categories` inside `config.json`.

Replace `assets/collection-*.svg` with real photos (or update the JSON paths).

## Collections editor (optional)
Use the Admin page to edit collections (local browser only):
- `collections.editor.enabled = true`
- `collections.editor.pin = "1234"` (optional)

Edits only save to the current browser. To publish changes, copy them into `config.json`.

## Services editor (admin)
Open the Admin page from the Home nav to unlock the local editor.
- `servicesEditor.enabled = true`
- `servicesEditor.pin = "brianni123"` (optional)

Edits only save to the current browser. To publish changes, copy them into `config.json`. The Admin PIN can also be updated in the Admin page (local only).

## Network-wide admin (recommended)
This project includes a Decap (Netlify) CMS at `/admin` for network-wide updates.

Setup:
1. Push the site to a GitHub repository.
2. In Netlify, connect the site to that repo (new deploys come from Git).
3. Enable Netlify Identity (Site settings -> Identity).
4. Enable Git Gateway (Identity -> Services).
5. Invite yourself as a user in Identity.
6. Visit `https://<your-site>.netlify.app/admin` to edit content.

Edits made in `/admin` commit to the repo and trigger a redeploy so everyone sees updates.

## Deployment (Vercel or Netlify)
1. Drag and drop the `nailsxbrianni-site` folder into Netlify.
2. Or deploy with Vercel as a static site (no build command needed).

Make sure `index.html`, `styles.css`, `app.js`, `config.json`, and `assets/` are in the project root.
