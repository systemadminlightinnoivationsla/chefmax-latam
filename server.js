const http = require('http');
const url = require('url');

// Simple JSON body parser
function parseJSON(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    try {
      callback(null, JSON.parse(body || '{}'));
    } catch (e) {
      callback(e, null);
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check endpoints
  if (path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      message: 'ChefMax Backend is running',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (path === '/api/v1/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      service: 'ChefMax API v1',
      environment: process.env.NODE_ENV || 'production'
    }));
    return;
  }

  // Authentication endpoints
  if (path === '/api/v1/auth/login' && method === 'POST') {
    parseJSON(req, (err, data) => {
      if (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      if (data.email && data.password) {
        const token = 'demo-jwt-token-' + Date.now();
        const refreshToken = 'demo-refresh-token-' + Date.now();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Login successful',
          token,
          refreshToken,
          user: {
            id: 1,
            email: data.email,
            name: 'Demo User',
            role: 'admin'
          }
        }));
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false,
          error: 'Email and password are required' 
        }));
      }
    });
    return;
  }

  // User profile endpoint
  if (path === '/api/v1/user/profile' && method === 'GET') {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        user: {
          id: 1,
          email: 'demo@chefmax.com',
          name: 'Demo User',
          role: 'admin',
          created_at: new Date().toISOString()
        }
      }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: false,
        error: 'Authorization token required' 
      }));
    }
    return;
  }

  // Products endpoint
  if (path === '/api/v1/products' && method === 'GET') {
    const query = parsedUrl.query;
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const response = {
      success: true,
      products: [
        {
          id: 1,
          name: 'Demo Product 1',
          price: 29.99,
          category: 'Kitchen Equipment',
          stock: 50,
          min_stock: 10,
          supplier_id: 1,
          supplier_name: 'Proveedor Demo 1',
          sku: 'DEMO-001',
          description: 'Producto de demostración para equipos de cocina',
          status: 'active',
          availability: 'in_stock'
        },
        {
          id: 2,
          name: 'Demo Product 2', 
          price: 149.99,
          category: 'Restaurant Supplies',
          stock: 25,
          min_stock: 5,
          supplier_id: 2,
          supplier_name: 'Proveedor Demo 2',
          sku: 'DEMO-002', 
          description: 'Suministros para restaurantes de demostración',
          status: 'active',
          availability: 'in_stock'
        }
      ],
      pagination: {
        page: parseInt(query.page) || 1,
        limit: parseInt(query.limit) || 20,
        total: 2,
        total_pages: 1
      }
    };
    
    res.end(JSON.stringify(response));
    return;
  }

  // Suppliers endpoint
  if (path === '/api/v1/suppliers' && method === 'GET') {
    const query = parsedUrl.query;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: [
        {
          id: 1,
          name: 'Proveedor Demo 1',
          contact: 'Juan Pérez',
          email: 'juan@proveedor1.com',
          phone: '+52 55 1234 5678',
          is_active: true
        },
        {
          id: 2,
          name: 'Proveedor Demo 2', 
          contact: 'María González',
          email: 'maria@proveedor2.com',
          phone: '+52 55 8765 4321',
          is_active: true
        }
      ],
      pagination: {
        page: parseInt(query.page) || 1,
        limit: parseInt(query.limit) || 100,
        total: 2
      }
    }));
    return;
  }

  // 🔥 CRITICAL: Excel upload endpoint with FIXED totalProducts field
  if (path === '/api/v1/uploads/excel' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      console.log('Excel upload request received');
      
      // Simulate processing Excel file
      const filename = 'uploaded-file.xlsx';
      const simulatedData = [
        { name: 'Freidora Industrial', price: 599.99, category: 'Kitchen Equipment', stock: 15, sku: 'FREID-001' },
        { name: 'Wok Automático', price: 899.50, category: 'Kitchen Equipment', stock: 8, sku: 'WOK-001' },
        { name: 'Vaporera Industrial', price: 1299.75, category: 'Kitchen Equipment', stock: 12, sku: 'VAP-001' },
        { name: 'Campana Sin Ducto', price: 2500.00, category: 'Ventilation', stock: 5, sku: 'CAMP-001' },
        { name: 'Trampa de Grasa', price: 450.25, category: 'Plumbing', stock: 20, sku: 'TRAP-001' }
      ];
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const response = {
        success: true,
        message: `Archivo Excel '${filename}' procesado exitosamente`,
        processed_rows: simulatedData.length,
        products_count: simulatedData.length,
        totalProducts: simulatedData.length, // ✅ FIXED: Frontend expects this field
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
      
      console.log('Excel upload response with totalProducts:', response.totalProducts);
      res.end(JSON.stringify(response));
    });
    return;
  }

  // Sample files endpoint  
  if (path === '/api/v1/sample-files' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      files: [
        {
          name: 'Fanny Fan.xlsx',
          description: 'Archivo de ejemplo - Productos Fanny Fan',
          size: '904 KB',
          url: '/api/v1/sample-files/download/fanny-fan'
        },
        {
          name: 'Lily Cnix.xlsx', 
          description: 'Archivo de ejemplo - Productos Lily Cnix',
          size: '2.8 MB',
          url: '/api/v1/sample-files/download/lily-cnix'
        }
      ]
    }));
    return;
  }

  // Default 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    error: 'Not Found',
    message: 'ChefMax Backend - Clean Optimized Server',
    requested: `${method} ${path}`,
    available_endpoints: {
      health: '/health',
      api_health: '/api/v1/health',
      login: 'POST /api/v1/auth/login',
      profile: 'GET /api/v1/user/profile',
      products: 'GET /api/v1/products',
      suppliers: 'GET /api/v1/suppliers',
      uploads_excel: 'POST /api/v1/uploads/excel',
      sample_files: 'GET /api/v1/sample-files'
    }
  }));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ChefMax Clean Backend running on port ${PORT}`);
  console.log('✅ Excel upload with totalProducts field FIXED');
  console.log('Available endpoints:');
  console.log('- POST /api/v1/auth/login');
  console.log('- GET /api/v1/user/profile');
  console.log('- GET /api/v1/products');
  console.log('- POST /api/v1/uploads/excel (FIXED)');
  console.log('- GET /health');
});