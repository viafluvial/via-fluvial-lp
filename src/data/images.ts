import type { ImageMetadata } from 'astro';
import heroMamiraua from '../assets/photos/hero-mamiraua.jpg';
import barcosRioNegro from '../assets/photos/barcos-rio-negro.jpg';
import portoManausPanorama from '../assets/photos/porto-manaus-panorama.jpg';
import portoManausCarga from '../assets/photos/porto-manaus-carga.jpg';
import convesCarga from '../assets/photos/conves-carga.jpg';
import redesBarco from '../assets/photos/redes-barco.jpg';
import encontroDasAguas from '../assets/photos/encontro-das-aguas-aereo.jpg';
import casaFlutuante from '../assets/photos/casa-flutuante-ubim.jpg';
import passageirosMobile from '../assets/screens/passageiros-mobile.jpg';
import cargasDesktop from '../assets/screens/cargas-desktop.jpg';

/** Fotos licenciadas. Os créditos de cada uma ficam em src/content/credits/photos.json (mesmo id). */
export const photos: Record<string, ImageMetadata> = {
  'hero-mamiraua': heroMamiraua,
  'barcos-rio-negro': barcosRioNegro,
  'porto-manaus-panorama': portoManausPanorama,
  'porto-manaus-carga': portoManausCarga,
  'conves-carga': convesCarga,
  'redes-barco': redesBarco,
  'encontro-das-aguas-aereo': encontroDasAguas,
  'casa-flutuante-ubim': casaFlutuante,
};

/** Telas reais do produto (capturas do portal de conhecimento, sem avisos de ambiente de teste). */
export const screens = {
  passageirosMobile,
  cargasDesktop,
};
