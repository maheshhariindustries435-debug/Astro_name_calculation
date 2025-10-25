# Tamil Numerology Calculator

A responsive web application for calculating numerology numbers and analyzing names from documents.

## Features
- Calculate numerology numbers for individual names
- Analyze PDF/PPT documents to find names matching specific numerology numbers
- Tamil language interface
- Responsive design for mobile and desktop
- History tracking of calculations

## Deployment to Render

### Prerequisites
1. A Render account (https://render.com)
2. This repository cloned or downloaded

### Deployment Steps

1. **Create a new Web Service on Render:**
   - Go to your Render Dashboard
   - Click "New" → "Web Service"
   - Connect your repository or upload your code

2. **Configure the Web Service:**
   - **Name:** Choose a name for your service
   - **Runtime:** Static Site
   - **Build Command:** (Leave empty for static sites)
   - **Start Command:** `python -m http.server 8000`
   - **Root Directory:** (Leave as default or specify if needed)

3. **Environment Variables:**
   - No environment variables are required for this static site

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your site

### Manual Deployment (if not using Git)

1. **Create a new Static Site on Render:**
   - Go to your Render Dashboard
   - Click "New" → "Static Site"

2. **Upload your files:**
   - Zip all files in your project directory
   - Upload the zip file to Render

3. **Configure Build Settings:**
   - **Publish Directory:** (Leave as default)

4. **Advanced Settings:**
   - Add an "Install" command if needed: `npm install -g serve`
   - Add a "Build" command: `echo "Build completed"`
   - Add a "Start" command: `serve -s . -l 8000`

### File Structure
Ensure your project has the following files:
```
├── index.html
├── styles.css
├── script.js
└── README.md
```

### Custom Domain (Optional)
1. In your Render dashboard, go to your web service
2. Navigate to "Settings" → "Custom Domains"
3. Follow Render's instructions to add your domain

## Local Development

To run locally:
```bash
python -m http.server 8000
```

Then visit http://localhost:8000

## Technologies Used
- HTML5
- CSS3 (with responsive design)
- JavaScript (ES6)
- Tamil language localization

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers