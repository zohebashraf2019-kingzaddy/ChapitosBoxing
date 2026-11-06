# Chapito's Boxing Gym — website

Static site + one Vercel serverless function for the contact form.

## Update the schedule each month
Edit **`js/schedule.js`** only:
- `closures` — days with no classes, e.g. `"2026-12-24": "Closed for Christmas Eve"`
- `events` — fight nights or special sessions
- `announcements` — the red banner under the hero, keyed by month (`"2026-12"`)
- `weekly` — the regular week (change only if class times change)

The calendar opens on the current month automatically.

## Add reels or photos
- Reels: drop a vertical `.mp4` + poster `.jpg` into `assets/video/` and copy a `<figure class="reel">` block in `index.html`.
- Photos: add to `assets/gallery/` and copy a `<button class="g">` block (`g--wide` / `g--tall` for size).

## Contact form (Vercel env vars)
| Variable | Value |
|---|---|
| `GMAIL_USER` | Gmail that sends the emails |
| `GMAIL_APP_PASSWORD` | Google App Password (Google Account → Security → App passwords) |
| `CONTACT_TO` | Inbox that receives messages (optional, defaults to `GMAIL_USER`) |

## Deploy
Push to GitHub repo `ChapitosBoxing`, import in Vercel, framework preset **Other**, no build command.
