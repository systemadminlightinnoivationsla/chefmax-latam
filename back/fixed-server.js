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

  console.log(`${method} ${path}`); // Debug logging

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

  if (path === '/v1/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      service: 'ChefMax API v1',
      environment: process.env.NODE_ENV || 'production'
    }));
    return;
  }

  // Authentication endpoints (note: /api prefix is stripped by DigitalOcean routing)
  if (path === '/v1/auth/login' && method === 'POST') {
    parseJSON(req, (err, data) => {
      console.log('Login attempt:', data); // Debug logging
      
      if (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      // Simple demo authentication - accept any email/password for now
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

  if (path === '/v1/auth/register' && method === 'POST') {
    parseJSON(req, (err, data) => {
      if (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      // Simple demo registration
      if (data.email && data.password && data.name) {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'User registered successfully',
          user: {
            id: Date.now(),
            email: data.email,
            name: data.name,
            role: 'user'
          }
        }));
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false,
          error: 'Name, email and password are required' 
        }));
      }
    });
    return;
  }

  // User profile endpoint
  if (path === '/v1/user/profile' && method === 'GET') {
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

  // Products/inventory endpoint
  if (path === '/v1/products' && method === 'GET') {
    const query = parsedUrl.query;
    console.log('GET /v1/products called with query:', query);
    
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
            availability: 'in_stock',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
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
            availability: 'in_stock',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
      pagination: {
        page: parseInt(query.page) || 1,
        limit: parseInt(query.limit) || 20,
        total: 2,
        total_pages: 1
      }
    };
    
    console.log('Sending products response with', response.products.length, 'products');
    res.end(JSON.stringify(response));
    return;
  }

  // Suppliers endpoints
  if (path === '/v1/suppliers' && method === 'GET') {
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
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Proveedor Demo 2', 
          contact: 'María González',
          email: 'maria@proveedor2.com',
          phone: '+52 55 8765 4321',
          is_active: true,
          created_at: new Date().toISOString()
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

  // Inventory alerts endpoint
  if (path === '/v1/inventory/alerts' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      alerts: [
        {
          id: 1,
          type: 'low_stock',
          message: 'Stock bajo en Demo Product 1',
          product_id: 1,
          current_stock: 5,
          min_stock: 10,
          severity: 'warning',
          created_at: new Date().toISOString()
        }
      ]
    }));
    return;
  }

  // Uploads endpoints
  if (path === '/v1/uploads/suppliers' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      uploads: []
    }));
    return;
  }

  if (path === '/v1/uploads/excel' && method === 'POST') {
    // Handle multipart/form-data for file uploads
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
        totalProducts: simulatedData.length, // Frontend expects this field
        data: simulatedData,
        products: simulatedData, // Frontend might be looking for this
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
      res.end(JSON.stringify(response));
    });
    return;
  }

  // Sample Excel files endpoint  
  if (path === '/v1/sample-files' && method === 'GET') {
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

  // Download sample files endpoint
  if (path.startsWith('/v1/sample-files/download/') && method === 'GET') {
    const fileId = path.split('/').pop();
    let filename = '';
    
    if (fileId === 'fanny-fan') {
      filename = 'Fanny Fan.xlsx';
    } else if (fileId === 'lily-cnix') {
      filename = 'Lily Cnix.xlsx';
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File not found' }));
      return;
    }
    
    res.writeHead(200, { 
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`
    });
    res.end(JSON.stringify({
      message: `Descarga simulada de ${filename}`,
      note: 'En un entorno real, aquí se enviaría el archivo binario'
    }));
    return;
  }

  // Default 404 for unmatched routes
  console.log('No route matched for:', method, path); // Debug logging
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    error: 'Not Found',
    message: 'ChefMax Backend - Fixed Demo Server',
    requested: `${method} ${path}`,
    available_endpoints: {
      health: '/health',
      api_health: '/api/v1/health',
      login: 'POST /api/v1/auth/login',
      register: 'POST /api/v1/auth/register', 
      profile: 'GET /api/v1/user/profile',
      products: 'GET /api/v1/products',
      suppliers: 'GET /api/v1/suppliers',
      alerts: 'GET /api/v1/inventory/alerts',
      uploads_suppliers: 'GET /api/v1/uploads/suppliers',
      uploads_excel: 'POST /api/v1/uploads/excel',
      sample_files: 'GET /api/v1/sample-files',
      download_sample: 'GET /api/v1/sample-files/download/{id}'
    }
  }));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`ChefMax Fixed Backend running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('- POST /api/v1/auth/login');
  console.log('- POST /api/v1/auth/register'); 
  console.log('- GET /api/v1/user/profile');
  console.log('- GET /api/v1/products');
  console.log('- GET /health');
});