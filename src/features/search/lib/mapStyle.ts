import type { StyleSpecification } from '@maplibre/maplibre-react-native';

// CARTO's free, keyless "Positron" basemap — a minimal light style (streets + muted
// labels, no dense land-use colors/POI icons) — instead of standard OSM's busy default
// cartography. Same raster architecture, no account/API key involved either way.
export const OSM_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors © CARTO',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};
