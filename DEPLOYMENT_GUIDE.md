# TUTOR Language Learning Platform - Deployment Guide

## 🚀 Quick Start Deployment

Your React application is configured for automatic deployment to Google Cloud Run.

### Prerequisites
- Node.js 18+ installed
- `gcloud` CLI installed ([Install](https://cloud.google.com/sdk/docs/install))
- Docker installed (optional, for local testing)
- GitHub repository set up

### Deployment Options

#### Option 1: Automatic Deployment (Recommended)
Push to your repository - GitHub Actions will automatically build and deploy:

```bash
git add .
git commit -m "Deploy tutor language platform"
git push origin main
```

**What happens automatically:**
1. GitHub Actions workflow triggers
2. Docker image is built
3. Image pushed to Google Container Registry
4. Service deployed to Cloud Run
5. Service URL: https://tutor-language-platform-929476858638.asia-southeast1.run.app/

#### Option 2: Manual Deployment with gcloud

```bash
# Set your project
gcloud config set project tutor-language-platform-929476858638

# Deploy directly
gcloud run deploy tutor-language-platform \
  --source . \
  --region asia-southeast1 \
  --platform managed \
  --allow-unauthenticated
```

#### Option 3: Docker Build & Push Locally

```bash
# Build the image
docker build -t tutor-language-platform .

# Test locally
docker run -p 3000:3000 tutor-language-platform

# Push to Google Container Registry
docker tag tutor-language-platform:latest gcr.io/tutor-language-platform-929476858638/tutor-language-platform:latest
docker push gcr.io/tutor-language-platform-929476858638/tutor-language-platform:latest

# Deploy to Cloud Run
gcloud run deploy tutor-language-platform \
  --image gcr.io/tutor-language-platform-929476858638/tutor-language-platform:latest \
  --region asia-southeast1 \
  --platform managed \
  --allow-unauthenticated
```

## 📋 Project Configuration

- **Project ID**: `tutor-language-platform-929476858638`
- **Service Name**: `tutor-language-platform`
- **Region**: `asia-southeast1`
- **Port**: `3000`
- **Memory**: `512Mi`
- **Timeout**: `3600s`

## 🔧 Environment Variables

Create `.env.production` for production-specific variables:

```
REACT_APP_API_ENDPOINT=https://your-api-endpoint.com
REACT_APP_GEMINI_API_KEY=your_key_here
```

These will be loaded during the build process.

## 📊 Monitoring & Logs

### View Deployment Status
```bash
gcloud run services describe tutor-language-platform --region asia-southeast1
```

### View Logs
```bash
gcloud run services logs read tutor-language-platform --region asia-southeast1 --limit 50
```

### View Metrics
Visit Cloud Console: https://console.cloud.google.com/run

## 🔌 API Configuration

If your app uses `/api/chat` and `/api/analyze-image` endpoints:

### Backend API Deployment (Cloud Functions)
```bash
gcloud functions deploy tutor-api \
  --runtime python39 \
  --trigger-http \
  --region asia-southeast1
```

### CORS Headers
Update your API to include CORS headers:
```
Access-Control-Allow-Origin: https://tutor-language-platform-929476858638.asia-southeast1.run.app
```

## 🗄️ File Storage (Images)

For persistent image uploads, use Google Cloud Storage:

```bash
# Create a storage bucket
gsutil mb gs://tutor-language-platform-images/

# Update your app to upload to this bucket
```

## 🐛 Troubleshooting

### Build Failures
```bash
gcloud builds log
```

### Port Issues
Ensure your app listens on port `3000` (set by Cloud Run)

### Runtime Errors
```bash
gcloud run services logs read tutor-language-platform --region asia-southeast1 --limit 100
```

### Permission Issues
```bash
gcloud auth login
gcloud config set project tutor-language-platform-929476858638
```

## 🔐 Security

### Store Secrets in Secret Manager
```bash
echo -n "your_secret" | gcloud secrets create api-key --data-file=-

# Grant Cloud Run access to secret
gcloud secrets add-iam-policy-binding api-key \
  --member=serviceAccount:tutor-language-platform@tutor-language-platform-929476858638.iam.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

## 📱 Update Deployment

Simply push changes to main/master branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

GitHub Actions will automatically redeploy your service.

## 🌐 Live URL

```
https://tutor-language-platform-929476858638.asia-southeast1.run.app/
```

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com)
- [React Documentation](https://react.dev)

---

**Status**: ✅ Ready to Deploy
**Last Updated**: June 21, 2026
