const API_BASE_URL = 'https://imitative-verline-quintuply.ngrok-free.dev';

// Função auxiliar para fazer requisições
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Header para evitar warning do ngrok
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    console.log('Fetching:', url, config); // Debug
    const response = await fetch(url, config);
    console.log('Response status:', response.status); // Debug
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Se não conseguir parsear JSON, usa a mensagem padrão
        const text = await response.text();
        console.error('Error response text:', text);
      }
      throw new Error(errorMessage);
    }
    
    // Verificar se a resposta tem conteúdo
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const jsonData = await response.json();
      console.log('API Response data:', jsonData); // Debug
      return jsonData;
    }
    
    // Se não for JSON, retornar texto vazio ou a resposta
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('API Error:', error);
    // Se for erro de CORS ou rede
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      throw new Error('Erro de conexão com o servidor. Verifique se o servidor está acessível.');
    }
    throw error;
  }
}

// Converter tipo de imóvel do formato do formulário para o formato da API
const mapPropertyType = (type) => {
  const typeMap = {
    'Apartamento': 'apartamento',
    'Casa': 'casa',
    'Loft': 'loft',
    'Studio': 'studio',
    'Terreno': 'terreno',
    'Comercial': 'comercial',
    'Outro': 'outro',
  };
  return typeMap[type] || 'outro';
};

// Converter preço do formato brasileiro para numérico
const parsePrice = (priceString) => {
  if (!priceString && priceString !== 0) return 0;
  
  // Se já for número, retornar diretamente
  if (typeof priceString === 'number') {
    return parseFloat(priceString.toFixed(2));
  }
  
  // Se for string, converter
  if (typeof priceString === 'string') {
    // Remove espaços e caracteres não numéricos exceto vírgula e ponto
    let cleaned = priceString.trim().replace(/[^\d.,]/g, '');
    
    // Se tiver vírgula, assume formato brasileiro (1.234,56)
    if (cleaned.includes(',')) {
      // Remove pontos (separadores de milhar) e substitui vírgula por ponto
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    }
    
    const numPrice = parseFloat(cleaned);
    if (isNaN(numPrice)) {
      console.warn('Erro ao converter preço:', priceString);
      return 0;
    }
    
    // Retornar com 2 casas decimais
    return parseFloat(numPrice.toFixed(2));
  }
  
  return 0;
};

// Converter área para numérico
const parseArea = (areaString) => {
  if (!areaString) return null;
  return parseFloat(areaString) || null;
};

// API de Propriedades
export const propertiesAPI = {
  // Buscar todas as propriedades
  getAll: async () => {
    return fetchAPI('/api/properties');
  },

  // Buscar propriedade por ID
  getById: async (id) => {
    return fetchAPI(`/api/properties/${id}`);
  },

  // Criar nova propriedade
  create: async (formData) => {
    // Mapear dados do formulário para o formato da API
    const priceValue = parsePrice(formData.price);
    console.log('Preço original:', formData.price, 'Preço convertido:', priceValue); // Debug
    
    const propertyData = {
      title: formData.title,
      property_type: mapPropertyType(formData.propertyType),
      price: priceValue,
      is_for_rent: formData.isForRent || false,
      usable_area: parseArea(formData.area),
      original_url: formData.originalUrl || null,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      parking_spaces: formData.parking,
      has_pool: formData.pool || false,
      address: formData.address || null,
      zip_code: formData.zipCode || null,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      status: formData.status || 'rascunho',
      cover_photo: formData.coverPhoto || null,
      user_id: 1111, // Mock user_id
    };

    console.log('Payload enviado:', propertyData); // Debug

    return fetchAPI('/api/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  // Atualizar propriedade
  update: async (id, formData) => {
    const priceValue = parsePrice(formData.price);
    console.log('Preço original (update):', formData.price, 'Preço convertido:', priceValue); // Debug
    
    const propertyData = {
      title: formData.title,
      property_type: mapPropertyType(formData.propertyType),
      price: priceValue,
      is_for_rent: formData.isForRent || false,
      usable_area: parseArea(formData.area),
      original_url: formData.originalUrl || null,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      parking_spaces: formData.parking,
      has_pool: formData.pool || false,
      address: formData.address || null,
      zip_code: formData.zipCode || null,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      status: formData.status || 'rascunho',
      cover_photo: formData.coverPhoto || null,
      // user_id não é enviado no update, apenas no create
    };

    console.log('Payload enviado (update):', propertyData); // Debug

    return fetchAPI(`/api/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  },

  // Deletar propriedade
  delete: async (id) => {
    return fetchAPI(`/api/properties/${id}`, {
      method: 'DELETE',
    });
  },
};

// API de Nearby Items
export const nearbyItemsAPI = {
  // Buscar todos os nearby items disponíveis
  getAll: async () => {
    return fetchAPI('/api/nearby-items');
  },

  // Buscar property-nearby-items por property_id
  getByPropertyId: async (propertyId) => {
    return fetchAPI(`/api/property-nearby-items?property_id=${propertyId}`);
  },

  // Criar property-nearby-item
  create: async (data) => {
    return fetchAPI('/api/property-nearby-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export default {
  properties: propertiesAPI,
  nearbyItems: nearbyItemsAPI,
};

