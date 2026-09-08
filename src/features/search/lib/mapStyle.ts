// OpenFreeMap's "Positron"-style vector basemap — genuinely keyless (no account, no
// signup) and actively maintained, unlike CARTO's identically-named "light_all" raster
// tiles, which now watermark every tile "API KEY REQUIRED" without one (confirmed by
// downloading and viewing an actual tile, not just checking its HTTP status — a 200
// with a watermarked image looks identical to a real tile until you look at it).
// A minimal light style (streets + muted labels, no dense land-use colors/POI icons)
// instead of standard OSM's busy default cartography.
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
