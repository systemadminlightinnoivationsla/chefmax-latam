import express from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'chefmax-backend'
  });
});

// API routes
app.get('/api/v1/status', (req, res) => {
  res.json({ 
    message: 'ChefMax API is running!',
    version: '1.0.0'
  });
});

app.listen(port, () => {
  console.log(`🚀 ChefMax Backend running on port ${port}`);
});