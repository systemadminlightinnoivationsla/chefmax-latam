const axios = require('axios');

async function testLeadAI() {
  const testLead = {
    source: "website_contact_form",
    data: {
      name: "Juan Pérez Test",
      email: "juan.test@restaurante.com",
      phone: "+52 55 1234 5678",
      company: "Restaurante Test",
      message: "Necesito cotización para equipos de cocina industrial",
      interests: ["freidoras", "parrillas", "refrigeradores"]
    },
    metadata: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "equipos_cocina_test"
    },
    priority: "high"
  };

  try {
    console.log('🚀 Enviando lead a LeadAI...');
    const response = await axios.post('http://localhost:3001/api/v1/leadai/leads', testLead, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Lead creado exitosamente:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Error al crear lead:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }

  // Test GET endpoint (requiere autenticación)
  try {
    console.log('\n🔍 Intentando obtener lista de leads...');
    const getResponse = await axios.get('http://localhost:3001/api/v1/leadai/leads');
    console.log('✅ Lista de leads obtenida:', getResponse.data);
  } catch (error) {
    console.log('⚠️ GET endpoint requiere autenticación (esperado):', error.response?.status);
  }
}

testLeadAI();
