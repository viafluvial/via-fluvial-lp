import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { MapPin, Navigation, Gauge, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface GeolocationData {
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  source?: 'gps' | 'ip';
}

interface LocationMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  geolocation: GeolocationData;
  userEmail?: string;
}

export function LocationMapModal({ open, onOpenChange, geolocation, userEmail }: LocationMapModalProps) {
  const [mapError, setMapError] = useState(false);
  
  const { latitude, longitude, city, state, country, accuracy, source } = geolocation;
  
  // Coordenadas padrão (centro do Brasil) caso não tenha localização
  const defaultLat = -14.235;
  const defaultLon = -51.925;
  
  const lat = latitude || defaultLat;
  const lon = longitude || defaultLon;
  
  const getAccuracyColor = (acc?: number) => {
    if (!acc) return 'gray';
    if (acc < 50) return 'green';
    if (acc < 200) return 'yellow';
    return 'orange';
  };

  const getSourceBadge = (src?: string) => {
    if (src === 'gps') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <Navigation className="w-3 h-3 mr-1" />
          GPS Preciso
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
        <MapPin className="w-3 h-3 mr-1" />
        Localização IP
      </Badge>
    );
  };

  const getAccuracyBadgeColor = (acc?: number) => {
    const color = getAccuracyColor(acc);
    if (color === 'green') return 'bg-green-100 text-green-800 border-green-300';
    if (color === 'yellow') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-orange-100 text-orange-800 border-orange-300';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--amazon-green)]" />
            Localização do Usuário
          </DialogTitle>
          <DialogDescription>
            Visualize a localização geográfica e detalhes de precisão do usuário inscrito
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações da Localização */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{userEmail || 'Não disponível'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Localização</p>
              <p className="font-semibold text-gray-900">
                {city && state 
                  ? `${city}, ${state}, ${country || 'Brasil'}`
                  : 'Não disponível'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Coordenadas</p>
              <p className="font-mono text-sm text-gray-900">
                {latitude && longitude
                  ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                  : 'Não disponível'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Fonte & Precisão</p>
              <div className="flex gap-2 items-center flex-wrap">
                {getSourceBadge(source)}
                {accuracy && (
                  <Badge className={getAccuracyBadgeColor(accuracy)}>
                    <Gauge className="w-3 h-3 mr-1" />
                    ±{Math.round(accuracy)}m
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Visualização do Mapa via Google Maps Embed */}
          <div className="relative w-full rounded-lg overflow-hidden border-2 border-gray-200">
            {latitude && longitude ? (
              <div className="space-y-4">
                {/* Google Maps Static Image */}
                <div className="relative h-96 w-full bg-gray-100">
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=${accuracy && accuracy < 100 ? 15 : accuracy && accuracy < 1000 ? 13 : 10}&size=800x400&markers=color:red%7C${lat},${lon}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
                    alt="Mapa da localização"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback para OpenStreetMap se Google Maps falhar
                      setMapError(true);
                    }}
                  />
                  {mapError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="text-center p-8">
                        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-700 font-semibold mb-2">
                          Mapa não disponível
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Visualize a localização no Google Maps usando o botão abaixo
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Informações sobre precisão visual */}
                {accuracy && (
                  <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Gauge className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          Raio de precisão: ±{Math.round(accuracy)} metros
                        </p>
                        <p className="text-xs text-blue-700">
                          A localização real do usuário está dentro deste raio de {Math.round(accuracy)}m do ponto marcado no mapa.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-100">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">
                    Localização não disponível
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Este usuário não compartilhou sua localização
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Botão para abrir no Google Maps */}
          {latitude && longitude && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-[var(--amazon-green)] hover:bg-[var(--amazon-green-dark)] text-white"
              >
                <a
                  href={`https://www.google.com/maps?q=${lat},${lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir no Google Maps
                </a>
              </Button>
              
              <Button
                asChild
                variant="outline"
              >
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Traçar rota
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}