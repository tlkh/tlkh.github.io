# Regional basemap

`southeast-asia-countries.geojson` is a local extract of Natural Earth's
public-domain 1:10m Admin 0 Countries dataset:
https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/

Source GeoJSON retrieved on 2026-09-19:
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_admin_0_countries.geojson

Retained polygons intersecting 75E-142E, 25S-35N, kept only the English name,
rounded coordinates to four decimal places, and simplified each ring with a
0.004-degree Douglas-Peucker tolerance (retaining original rings if simplification
would leave fewer than four points). The wider extract provides a buffer around
the map's pan bounds. This is a regional overview, not a street map.

Country labels are placed manually in script.js; city labels use event locations.
All geometry, labels, and styles are served locally. No map API key is required.
