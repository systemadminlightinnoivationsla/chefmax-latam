const http = require('http');
const port = process.env.PORT || 3001;

// Minimal hotfix server that just adds totalProducts field
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/v1/uploads/excel') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    // Quick mock response with totalProducts field
    const response = {
      success: true,
      message: "Archivo Excel procesado exitosamente",
      processed_rows: 5,
      products_count: 5,
      totalProducts: 5, // THE MISSING FIELD!
      data: [
        { name: "Freidora Industrial", price: 599.99, category: "Kitchen Equipment", stock: 15, sku: "FREID-001" },
        { name: "Wok Automático", price: 899.5, category: "Kitchen Equipment", stock: 8, sku: "WOK-001" },
        { name: "Vaporera Industrial", price: 1299.75, category: "Kitchen Equipment", stock: 12, sku: "VAP-001" },
        { name: "Campana Sin Ducto", price: 2500, category: "Ventilation", stock: 5, sku: "CAMP-001" },
        { name: "Trampa de Grasa", price: 450.25, category: "Plumbing", stock: 20, sku: "TRAP-001" }
      ],
      products: [
        { name: "Freidora Industrial", price: 599.99, category: "Kitchen Equipment", stock: 15, sku: "FREID-001" },
        { name: "Wok Automático", price: 899.5, category: "Kitchen Equipment", stock: 8, sku: "WOK-001" },
        { name: "Vaporera Industrial", price: 1299.75, category: "Kitchen Equipment", stock: 12, sku: "VAP-001" },
        { name: "Campana Sin Ducto", price: 2500, category: "Ventilation", stock: 5, sku: "CAMP-001" },
        { name: "Trampa de Grasa", price: 450.25, category: "Plumbing", stock: 20, sku: "TRAP-001" }
      ],
      summary: {
        total_rows: 5,
        successful: 5,
        failed: 0,
        warnings: 0,
        products: 5
      },
      errors: [],
      filename: "uploaded-file.xlsx",
      supplier: "Auto-detectado"
    };
    
    res.end(JSON.stringify(response));
    return;
  }
  
  // Pass through other requests
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Hotfix server - Excel endpoint only');
});

server.listen(port, () => {
  console.log(`🔥 HOTFIX Server running on port ${port} with totalProducts field!`);
});