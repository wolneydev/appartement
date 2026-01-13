// Dados mockados para apartamentos
export const mockApartments = [
  {
    id: 1,
    title: "Apto Moderno Vila Mariana",
    location: "Vila Mariana, São Paulo",
    price: 4200,
    area: 68,
    bedrooms: 2,
    parking: 1,
    score: 9.4,
    badges: ["MELHOR PREÇO", "NOVO"],
    isForRent: true,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    amenities: {
      nearby: 12,
      items: ["Padaria", "Academia", "Parque", "Metrô", "Mercado", "Farmácia", "Restaurante", "Banco", "Escola", "Posto", "Shopping", "Cinema"]
    },
    description: "Apartamento moderno e bem localizado em Vila Mariana, próximo ao metrô e com excelente infraestrutura.",
    address: "Rua Harmonia, 1234 - São Paulo, SP",
    iptu: 1200,
    condominium: 750,
    priceWeight: 75,
    amenityWeight: 92,
    transport: [
      { name: "Metro Vila Mariana", line: "Green Line", distance: "450m", walkTime: "6 min walk" },
      { name: "Fradique Coutinho", line: "Yellow Line", distance: "1.2km", walkTime: "15 min walk" }
    ],
    bakeries: [
      { name: "Padaria Villa Bahia", type: "Artisan Bread", distance: "120m", walkTime: "2 min walk" },
      { name: "Pão de Açúcar", type: "Supermarket", distance: "800m", walkTime: "10 min walk" }
    ],
    wellness: [
      { name: "Smart Fit Vila Madalena", type: "Gym", distance: "300m", walkTime: "4 min walk" }
    ]
  },
  {
    id: 2,
    title: "Studio Design Pinheiros",
    location: "Pinheiros, São Paulo",
    price: 3850,
    isForRent: true,
    area: 42,
    bedrooms: 1,
    parking: 0,
    score: 8.7,
    badges: [],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    amenities: {
      nearby: 8,
      items: ["Metrô", "Ônibus", "Padaria", "Farmácia", "Restaurante", "Academia", "Parque", "Mercado"]
    },
    description: "Studio moderno e aconchegante em Pinheiros, perfeito para quem busca praticidade e localização.",
    address: "Rua dos Pinheiros, 567 - São Paulo, SP",
    iptu: 900,
    condominium: 650,
    priceWeight: 68,
    amenityWeight: 85,
    transport: [
      { name: "Metro Pinheiros", line: "Yellow Line", distance: "300m", walkTime: "4 min walk" }
    ],
    bakeries: [
      { name: "Padaria Artesanal", type: "Bakery", distance: "200m", walkTime: "3 min walk" }
    ],
    wellness: [
      { name: "BlueFit Pinheiros", type: "Gym", distance: "500m", walkTime: "6 min walk" }
    ]
  },
  {
    id: 3,
    title: "Residencial Premium Itaim",
    location: "Itaim Bibi, São Paulo",
    price: 7900,
    isForRent: false,
    area: 110,
    bedrooms: 3,
    parking: 2,
    score: 8.2,
    badges: [],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    amenities: {
      nearby: 24,
      items: ["Academia", "Restaurante", "Parque", "Metrô", "Shopping", "Cinema", "Teatro", "Hospital", "Escola", "Universidade", "Banco", "Farmácia", "Padaria", "Mercado", "Posto", "Lavanderia", "Salão", "Veterinário", "Pet Shop", "Livraria", "Café", "Bar", "Balada", "Praia"]
    },
    description: "Residencial premium com amplos espaços e excelente localização no coração do Itaim Bibi.",
    address: "Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP",
    iptu: 2500,
    condominium: 1200,
    priceWeight: 60,
    amenityWeight: 88,
    transport: [
      { name: "Metro Faria Lima", line: "Yellow Line", distance: "600m", walkTime: "8 min walk" }
    ],
    bakeries: [
      { name: "Padaria Premium", type: "Bakery", distance: "150m", walkTime: "2 min walk" },
      { name: "Carrefour", type: "Supermarket", distance: "1km", walkTime: "12 min walk" }
    ],
    wellness: [
      { name: "Bodytech Itaim", type: "Gym", distance: "400m", walkTime: "5 min walk" }
    ]
  },
  {
    id: 4,
    title: "Loft Garden Moema",
    location: "Moema, São Paulo",
    price: 5400,
    isForRent: true,
    area: 85,
    bedrooms: 2,
    parking: 1,
    score: 8.1,
    badges: ["DESTAQUE"],
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    amenities: {
      nearby: 15,
      items: ["Academia", "Parque", "Metrô", "Shopping", "Cinema", "Restaurante", "Padaria", "Mercado", "Farmácia", "Banco", "Escola", "Hospital", "Posto", "Lavanderia", "Salão"]
    },
    description: "Loft moderno com jardim em Moema, próximo ao Parque do Ibirapuera e excelente infraestrutura.",
    address: "Av. Ibirapuera, 1500 - São Paulo, SP",
    iptu: 1500,
    condominium: 850,
    priceWeight: 70,
    amenityWeight: 80,
    transport: [
      { name: "Metro Moema", line: "Green Line", distance: "800m", walkTime: "10 min walk" }
    ],
    bakeries: [
      { name: "Padaria Moema", type: "Bakery", distance: "250m", walkTime: "3 min walk" }
    ],
    wellness: [
      { name: "Smart Fit Moema", type: "Gym", distance: "600m", walkTime: "8 min walk" }
    ]
  },
  {
    id: 5,
    title: "Apartamento Solar",
    location: "Jardins, São Paulo",
    price: 4200,
    isForRent: false,
    area: 65,
    bedrooms: 2,
    parking: 1,
    score: 9.4,
    badges: ["MELHOR PONTUAÇÃO"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    amenities: {
      nearby: 18,
      items: ["Metrô", "Padaria", "Academia", "Parque", "Shopping", "Cinema", "Restaurante", "Mercado", "Farmácia", "Banco", "Escola", "Hospital", "Posto", "Lavanderia", "Salão", "Veterinário", "Pet Shop", "Livraria"]
    },
    description: "Apartamento com excelente pontuação em localização privilegiada nos Jardins.",
    address: "Rua Oscar Freire, 500 - São Paulo, SP",
    iptu: 1100,
    condominium: 700,
    priceWeight: 75,
    amenityWeight: 95,
    transport: [
      { name: "Metro Consolação", line: "Green Line", distance: "400m", walkTime: "5 min walk" },
      { name: "Metro Trianon", line: "Yellow Line", distance: "500m", walkTime: "6 min walk" }
    ],
    bakeries: [
      { name: "Padaria Artesanal Jardins", type: "Artisan Bread", distance: "100m", walkTime: "1 min walk" },
      { name: "Café Especial", type: "Café", distance: "150m", walkTime: "2 min walk" },
      { name: "Mais 3+", type: "Others", distance: "", walkTime: "" }
    ],
    wellness: [
      { name: "SmartFit Jardins", type: "Gym", distance: "300m", walkTime: "4 min walk" },
      { name: "BlueFit", type: "Gym", distance: "500m", walkTime: "6 min walk" }
    ]
  },
  {
    id: 6,
    title: "Residencial Parque",
    location: "Vila Mariana, São Paulo",
    price: 3150,
    isForRent: true,
    area: 52,
    bedrooms: 1,
    parking: 2,
    score: 7.8,
    badges: ["MAIS BARATO"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    amenities: {
      nearby: 8,
      items: ["Padaria", "Mercado", "Farmácia", "Restaurante", "Academia", "Parque", "Banco", "Posto"]
    },
    description: "Residencial com o melhor custo-benefício em Vila Mariana, com 2 vagas de garagem.",
    address: "Rua Domingos de Morais, 800 - São Paulo, SP",
    iptu: 800,
    condominium: 550,
    priceWeight: 85,
    amenityWeight: 65,
    transport: [],
    bakeries: [
      { name: "Padaria Vila", type: "Bakery", distance: "300m", walkTime: "4 min walk" },
      { name: "Padaria Central", type: "Bakery", distance: "500m", walkTime: "6 min walk" }
    ],
    wellness: [
      { name: "Academia Local", type: "Gym", distance: "700m", walkTime: "9 min walk" }
    ]
  },
  {
    id: 7,
    title: "Edifício Aurora",
    location: "Pinheiros, São Paulo",
    price: 5800,
    isForRent: false,
    area: 98,
    bedrooms: 3,
    parking: 1,
    score: 8.2,
    badges: ["MAIS COMPLETO"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    amenities: {
      nearby: 40,
      items: ["Metrô", "Padaria", "Academia", "Parque", "Shopping", "Cinema", "Teatro", "Restaurante", "Mercado", "Farmácia", "Banco", "Escola", "Hospital", "Posto", "Lavanderia", "Salão", "Veterinário", "Pet Shop", "Livraria", "Café", "Bar", "Balada", "Praia", "Clube", "Piscina", "Quadra", "Playground", "Biblioteca", "Museu", "Galeria", "Estúdio", "Coworking", "Hotel", "Aeroporto", "Rodoviária", "Terminal", "Bicicletário", "Estacionamento", "Praça", "Igreja"]
    },
    description: "Edifício ultra-conectado com mais de 40 serviços em 10 minutos de caminhada.",
    address: "Rua dos Pinheiros, 1000 - São Paulo, SP",
    iptu: 1800,
    condominium: 950,
    priceWeight: 65,
    amenityWeight: 90,
    transport: [
      { name: "Metro Pinheiros", line: "Yellow Line", distance: "500m", walkTime: "6 min walk" }
    ],
    bakeries: [
      { name: "Padaria Artesanal", type: "Bakery", distance: "100m", walkTime: "1 min walk" },
      { name: "Café Especial", type: "Café", distance: "150m", walkTime: "2 min walk" },
      { name: "Mais 10+", type: "Others", distance: "", walkTime: "" }
    ],
    wellness: [
      { name: "SmartFit", type: "Gym", distance: "200m", walkTime: "3 min walk" },
      { name: "BlueFit", type: "Gym", distance: "400m", walkTime: "5 min walk" },
      { name: "Bodytech", type: "Gym", distance: "600m", walkTime: "7 min walk" },
      { name: "Academia Local", type: "Gym", distance: "800m", walkTime: "10 min walk" }
    ]
  }
];

// Função para filtrar apartamentos
export const filterApartments = (apartments, filters) => {
  return apartments.filter(apt => {
    // Filtro de preço
    if (apt.price < filters.minPrice || apt.price > filters.maxPrice) {
      return false;
    }
    
    // Filtro de área
    if (apt.area < filters.minArea) {
      return false;
    }
    
    // Filtro de quartos
    if (apt.bedrooms < filters.minBedrooms) {
      return false;
    }
    
    // Filtro de proximidade
    if (filters.nearby.length > 0) {
      const hasNearby = filters.nearby.some(nearby => {
        return apt.amenities.items.some(item => 
          item.toLowerCase().includes(nearby.toLowerCase())
        );
      });
      if (!hasNearby) return false;
    }
    
    return true;
  });
};

// Função para ordenar apartamentos
export const sortApartments = (apartments, sortBy) => {
  const sorted = [...apartments];
  
  switch(sortBy) {
    case 'score':
      return sorted.sort((a, b) => b.score - a.score);
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'area-asc':
      return sorted.sort((a, b) => a.area - b.area);
    case 'area-desc':
      return sorted.sort((a, b) => b.area - a.area);
    default:
      return sorted;
  }
};

