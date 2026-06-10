export interface GeolocationData {
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number; // Precisão em metros
  source?: 'gps' | 'ip'; // Fonte da geolocalização
}

export async function getGeolocation(): Promise<GeolocationData> {
  try {
    // PRIORIDADE 1: Tentar obter localização precisa do GPS do navegador primeiro
    const browserGeo = await getBrowserGeolocation();
    
    if (browserGeo.latitude && browserGeo.longitude) {
      // Se temos GPS, usar reverse geocoding para obter cidade/estado
      const locationDetails = await reverseGeocode(browserGeo.latitude, browserGeo.longitude);
      
      return {
        latitude: browserGeo.latitude,
        longitude: browserGeo.longitude,
        accuracy: browserGeo.accuracy,
        city: locationDetails.city,
        state: locationDetails.state,
        country: locationDetails.country,
        source: 'gps'
      };
    }

    // FALLBACK: Se GPS não disponível, usar geolocalização por IP
    // Try multiple geolocation APIs for redundancy
    
    // Option 1: ipapi.co (free, no API key required)
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        return {
          city: data.city,
          state: data.region,
          country: data.country_name,
          latitude: data.latitude,
          longitude: data.longitude,
          source: 'ip'
        };
      }
    } catch (err) {
      console.log('ipapi.co failed, trying next service...');
    }

    // Option 2: ip-api.com (free, no API key required)
    try {
      const response = await fetch('http://ip-api.com/json/');
      if (response.ok) {
        const data = await response.json();
        return {
          city: data.city,
          state: data.regionName,
          country: data.country,
          latitude: data.lat,
          longitude: data.lon,
          source: 'ip'
        };
      }
    } catch (err) {
      console.log('ip-api.com failed, trying next service...');
    }

    // Option 3: ipwhois.app (free, no API key required)
    try {
      const response = await fetch('https://ipwho.is/');
      if (response.ok) {
        const data = await response.json();
        return {
          city: data.city,
          state: data.region,
          country: data.country,
          latitude: data.latitude,
          longitude: data.longitude,
          source: 'ip'
        };
      }
    } catch (err) {
      console.log('ipwho.is failed');
    }

    console.warn('All geolocation services failed');
    return {};
  } catch (error) {
    console.error('Error getting geolocation:', error);
    return {};
  }
}

export async function getBrowserGeolocation(): Promise<Pick<GeolocationData, 'latitude' | 'longitude' | 'accuracy'>> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser');
      resolve({});
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ GPS location obtained with accuracy:', position.coords.accuracy, 'meters');
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.log('Browser geolocation denied:', error.message);
        resolve({});
      },
      { 
        enableHighAccuracy: true, // Solicitar maior precisão (usa GPS no celular)
        timeout: 10000, // Aumentar timeout para 10 segundos
        maximumAge: 0 // Não usar cache, sempre buscar nova localização
      }
    );
  });
}

// Função de reverse geocoding usando Nominatim (OpenStreetMap)
async function reverseGeocode(lat: number, lon: number): Promise<Pick<GeolocationData, 'city' | 'state' | 'country'>> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ViaFluvialAmazonia/1.0' // Nominatim requer User-Agent
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      const address = data.address;
      
      return {
        city: address.city || address.town || address.village || address.municipality,
        state: address.state,
        country: address.country
      };
    }
  } catch (err) {
    console.log('Reverse geocoding failed:', err);
  }
  
  return {};
}