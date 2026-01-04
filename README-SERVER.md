# Local Server Setup for Clean URLs

## Why Clean URLs Don't Work with file://

When you open HTML files directly in a browser (using `file://` protocol), the browser shows the actual file path including `.html` extensions. Clean URLs require a web server to rewrite the URLs.

## Quick Start - Node.js Server

1. Make sure you have Node.js installed
2. Run the server:
   ```bash
   node server.js
   ```
   Or:
   ```bash
   npm start
   ```

3. Open your browser and go to:
   - http://localhost:3000/
   - http://localhost:3000/about
   - http://localhost:3000/work
   - etc.

You'll see clean URLs without `.html` extensions!

## Alternative: Python Server

If you don't have Node.js, you can use Python:

```bash
# Python 3
python3 -m http.server 8000

# Then visit: http://localhost:8000/about
```

Note: Python's simple server won't handle clean URLs automatically, but Node.js server will.

## After Deployment

Once you deploy to:
- **Netlify**: Uses `_redirects` file automatically
- **Vercel**: Uses `vercel.json` automatically  
- **Apache**: Uses `.htaccess` file automatically
- **Other hosts**: Check their documentation for URL rewriting

Clean URLs will work automatically after deployment!

