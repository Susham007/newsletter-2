# Email edition

The production build creates `_site/email/index.html`. This is a separate email-safe rendering of the same issue used by the website.

## Why it is separate

Email clients do not reliably support CSS Grid, JavaScript, forms, local fonts, or relative asset URLs. The email edition therefore uses:

- a 640px presentation-table layout;
- inline styles and conservative media queries;
- Arial/Helvetica and Georgia fallbacks;
- explicit image width and height;
- table-based call-to-action buttons;
- absolute links to the hosted article pages;
- no signup form or JavaScript.

## Build with the correct public URL

Netlify supplies the production `URL` environment variable during its build, so deployed email links point to the live site automatically.

For a local production test in PowerShell:

```powershell
$env:URL = "https://your-site.netlify.app"
npm run build
```

Then import the contents of `_site/email/index.html` into the email platform.

## Before sending

1. Build after the Netlify URL is final.
2. Send test messages to Gmail, Outlook, and Apple Mail.
3. Configure the sending platform's unsubscribe link and physical sender information. Those values are platform-specific and are intentionally not invented in this template.
4. Do not paste the normal website HTML into an email campaign; use only `_site/email/index.html`.
