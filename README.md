# LangChain Hybrid Retrieval for Healthcare User Stories

A full-stack web application for hybrid search and analysis of healthcare user stories using LangChain, MongoDB Atlas, and React.

## 🎯 Project Overview

This project demonstrates:
- **Hybrid retrieval** combining vector search (semantic) + BM25 (keyword-based) search
- **LangChain integration** with Mistral AI embeddings for semantic understanding
- **MongoDB Atlas** vector search for scalable document retrieval
- **Full-stack application** with React frontend and Express backend

## 🏗️ Architecture

### Backend (Express.js + LangChain)
- **Port**: 4000
- **Technologies**: 
  - Express.js for REST API
  - LangChain for orchestration
  - Mistral AI for embeddings
  - MongoDB Atlas Vector Search
- **Endpoints**:
  - `GET /health` - Health check
  - `GET /diagnostics` - Database diagnostics
  - `POST /analyze` - Healthcare story analysis with hybrid retrieval

### Frontend (React + Vite)
- **Port**: 5173
- **Technologies**:
  - React 19.2.0
  - Vite 7.2.2
  - TypeScript support
  - CSS gradients and animations
- **Features**:
  - Real-time search form
  - API proxy to backend
  - Result cards with semantic scores
  - Error handling and loading states

## 📋 Prerequisites

- Node.js 25.1.0+
- npm 11.6.2+
- MongoDB Atlas account with vector search index configured
- Mistral AI API key

## 🚀 Quick Start

### 1. Installation

```bash
cd /Users/arunmanu/Documents/LangChain_Proj

# Install dependencies for all workspaces
npm install
```

### 2. Environment Setup

Create or verify `.env` file in `backend/` directory:

```properties
MISTRAL_API_KEY=your_mistral_key_here
MISTRAL_EMBEDDING_MODEL=mistral-embed
MONGODB_URI=your_mongodb_atlas_uri
MONGODB_DB=raguserstories
MONGODB_COLLECTION=ragstories
MONGODB_VECTOR_INDEX=vector_hybridretrieval_index
MONGODB_BM25_INDEX=BM25_hybridretrieval_index
VECTOR_WEIGHT=0.7
BM25_WEIGHT=0.3
RETRIEVAL_DEPTH=8
PORT=4000
```

### 3. Start Services

#### Start Backend
```bash
npm start
# Backend runs on http://localhost:4000
```

#### Start Frontend (in another terminal)
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

#### Or start both with workspace command
```bash
npm run dev
```

### 4. Access the Application

- **Frontend UI**: http://localhost:5173
- **Backend Health**: http://localhost:4000/health
- **Backend Diagnostics**: http://localhost:4000/diagnostics

## 🔍 API Endpoints

### POST /analyze
Analyze a healthcare user story and retrieve related stories.

**Request:**
```json
{
  "story": "As a patient, I want to view my medical records so that I can track my health history",
  "acceptanceCriteria": ["Records show up in 2 seconds", "All data is HIPAA compliant"],
  "vectorWeight": 0.7,
  "bm25Weight": 0.3
}
```

**Response:**
```json
{
  "normalizedStory": "...",
  "actors": ["patient"],
  "systems": [],
  "acceptanceCriteria": [...],
  "relatedStories": [
    {
      "storyId": "...",
      "normalizedStory": "...",
      "hybridScore": 0.85,
      "vectorScore": 0.9,
      "bm25Score": 0.75,
      "rationale": "..."
    }
  ],
  "evaluation": {
    "dimensions": [...],
    "overallScore": 72,
    "summaryRecommendations": [...]
  },
  "refinedStory": "..."
}
```

## 📁 Project Structure

```
LangChain_Proj/
├── backend/
│   ├── package.json
│   ├── .env
│   └── dist/                      # Compiled TypeScript (not included in git)
│       ├── server.js
│       ├── services/
│       ├── routes/
│       └── config/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx              # React entry point
│   │   ├── App.jsx               # Main component with search logic
│   │   ├── App.css               # Component styles
│   │   └── index.css             # Global styles
│   └── node_modules/
├── package.json                   # Root workspace config
├── .gitignore
└── README.md
```

## 🛠️ Development

### Build Backend
```bash
cd backend
npm run build
```

### Build Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### Run Tests
```bash
npm test
```

## ⚠️ Known Issues & Troubleshooting

### Issue: No search results returned (0 results)

**Root Cause**: MongoDB collection schema mismatch
- Backend code expects fields: `text`, `normalizedStory`, `role`, `goal`
- Actual MongoDB fields: `story_id`, `content`, `normalized_content`

**Solutions**:

1. **Option A**: Modify MongoDB documents to match expected field names
   - Rename `content` → `text`
   - Rename `normalized_content` → `normalizedStory`
   - Add `role` and `goal` fields if missing

2. **Option B**: Modify backend code (requires recompilation)
   - Edit `backend/src/services/hybridRetriever.ts` field mappings
   - Run `npm run build` in backend

3. **Option C**: Use vector search fallback
   - The code includes a fallback regex search
   - Verify MongoDB Atlas search indexes are created

### Issue: 404 errors when calling API

**Solution**: Ensure backend is running and Vite proxy is configured
- Backend running on port 4000
- Frontend proxy redirects `/api/*` to `http://localhost:4000`
- Check `frontend/vite.config.js` proxy configuration

### Issue: "Cannot find module" errors

**Solution**: Install dependencies
```bash
npm install
# or per workspace
npm install --workspace=backend
npm install --workspace=frontend
```

## 📊 API Weights

The hybrid retrieval uses configurable weights:
- **vectorWeight** (0.7 default): Importance of semantic similarity
- **bm25Weight** (0.3 default): Importance of keyword matching

Adjust in `.env`:
```properties
VECTOR_WEIGHT=0.6  # More keyword-focused
BM25_WEIGHT=0.4
```

## 🔐 Security Notes

- **Environment Variables**: Never commit `.env` to git (already in `.gitignore`)
- **API Keys**: Store Mistral and MongoDB credentials securely
- **CORS**: Configured for local development only
- **MongoDB URI**: Update with your Atlas credentials

## 🚀 Deployment

### Backend Deployment
```bash
# Build
npm run build --workspace=backend

# Deploy
node backend/dist/server.js
```

### Frontend Deployment
```bash
# Build
npm run build --workspace=frontend

# Output: frontend/dist/ (static files)
# Deploy to CDN or static host (Vercel, Netlify, AWS S3, etc.)
```

## 📚 Technologies Used

- **Frontend**: React 19, Vite 7, TypeScript
- **Backend**: Express 5, LangChain 1, MongoDB 7
- **AI/ML**: Mistral AI embeddings
- **Database**: MongoDB Atlas with vector search
- **Build Tools**: Vite, TypeScript, npm workspaces

## 📝 License

MIT

## 👤 Author

Arun Kumar

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review API endpoint documentation
3. Check MongoDB Atlas configuration
4. Verify environment variables

---

**Last Updated**: November 12, 2025
**Status**: ✅ Fully Functional (Hybrid search optimization pending)