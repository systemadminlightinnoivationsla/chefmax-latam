import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: ['https://chefmax-platform-edc3u.ondigitalocean.app', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Health check endpoint
app.get('/health', (req: any, res: any) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'chefmax-backend'
  });
});

// API routes - Note: DigitalOcean strips /api prefix, so we use /v1/
app.get('/v1/status', (req: any, res: any) => {
  res.json({ 
    message: 'ChefMax API is running!',
    version: '1.0.0'
  });
});

// Authentication endpoints
app.post('/v1/auth/login', (req: any, res: any) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, body: req.body });
  
  if (email === 'admin@chefmaxlatam.com' && password === 'admin123') {
    const token = jwt.sign(
      { id: 1, email, role: 'admin' },
      'your-secret-key',
      { expiresIn: '24h' }
    );
    
    const refreshToken = jwt.sign(
      { id: 1, email },
      'your-refresh-secret',
      { expiresIn: '7d' }
    );
    
    console.log('Login successful');
    res.json({
      success: true,
      message: 'Login exitoso',
      user: { id: 1, email, role: 'admin' },
      token,
      refreshToken
    });
  } else {
    console.log('Login failed');
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }
});

app.post('/v1/auth/refresh', (req: any, res: any) => {
  const { refreshToken } = req.body;
  
  try {
    const decoded = jwt.verify(refreshToken, 'your-refresh-secret') as any;
    const token = jwt.sign(
      { id: decoded.id, email: decoded.email, role: 'admin' },
      'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({ success: true, token });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
});

app.post('/v1/auth/logout', (req: any, res: any) => {
  res.json({ success: true, message: 'Logout exitoso' });
});

// Products endpoints
app.get('/v1/products', (req: any, res: any) => {
  const mockProducts = [
    { id: 1, name: 'Producto 1', price: 100, stock: 50 },
    { id: 2, name: 'Producto 2', price: 200, stock: 30 },
    { id: 3, name: 'Producto 3', price: 150, stock: 40 }
  ];
  
  res.json({ products: mockProducts });
});

app.post('/v1/products', (req: any, res: any) => {
  const product = req.body;
  console.log('Creating product:', product);
  res.json({ success: true, product: { id: Date.now(), ...product } });
});

// Suppliers endpoints
app.get('/v1/suppliers', (req: any, res: any) => {
  const mockSuppliers = [
    { id: 1, name: 'Proveedor 1', contact: 'contacto1@example.com' },
    { id: 2, name: 'Proveedor 2', contact: 'contacto2@example.com' }
  ];
  
  res.json({ suppliers: mockSuppliers });
});

// Excel upload endpoint with totalProducts field
app.post('/v1/uploads/excel', upload.single('file'), (req: any, res: any) => {
  console.log('Excel upload endpoint called');
  console.log('File:', req.file);
  console.log('Body:', req.body);
  
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No se encontró archivo Excel'
    });
  }
  
  const filename = req.file.originalname;
  
  // Simulate processing with mock data
  const simulatedData = [
    { id: 1, name: 'Producto A', price: 100, category: 'Bebidas', supplier: 'Auto-detectado' },
    { id: 2, name: 'Producto B', price: 150, category: 'Comida', supplier: 'Auto-detectado' },
    { id: 3, name: 'Producto C', price: 200, category: 'Snacks', supplier: 'Auto-detectado' },
    { id: 4, name: 'Producto D', price: 75, category: 'Bebidas', supplier: 'Auto-detectado' },
    { id: 5, name: 'Producto E', price: 300, category: 'Comida', supplier: 'Auto-detectado' }
  ];
  
  const response = {
    success: true,
    message: `Archivo Excel '${filename}' procesado exitosamente`,
    processed_rows: simulatedData.length,
    products_count: simulatedData.length,
    totalProducts: simulatedData.length, // Frontend expects this field
    data: simulatedData,
    products: simulatedData,
    summary: {
      total_rows: simulatedData.length,
      successful: simulatedData.length,
      failed: 0,
      warnings: 0,
      products: simulatedData.length
    },
    errors: [],
    filename: filename,
    supplier: 'Auto-detectado'
  };
  
  console.log('Excel upload response:', JSON.stringify(response, null, 2));
  res.json(response);
});

// Settings endpoints
app.get('/v1/settings', (req: any, res: any) => {
  res.json({
    appName: 'ChefMax LATAM',
    version: '1.0.0',
    theme: 'light'
  });
});

// Catch all for unmatched routes
app.use('*', (req: any, res: any) => {
  console.log(`Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    path: req.originalUrl
  });
});

app.listen(port, () => {
  console.log(`🚀 ChefMax Backend running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});