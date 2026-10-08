// The United States as the train crosses it: real cities with their real
// positions, metro populations (thousands), climates and what they're known
// for. A city's size sets how many places there are to search, what kind
// of buildings they are and how dangerous it is; its traits tilt the loot.
// Distances between cities are real (great-circle miles) and set the coal a
// trip needs.
//
// biome: the climate the camp gets (forest = temperate & wet, desert = arid
// southwest, tundra = cold north and mountains, plains = Great Plains and
// prairie, swamp = Gulf Coast and Florida).
// tags: farm (food), coal (coal country), industry (scrap), medical
// (hospitals, medicine), military (bases: weapons & ammo), port (food &
// scrap from the docks).

export const CITIES = [
  ['seattle', 'Seattle', 'WA', 47.61, -122.33, 4000, 'forest', ['port', 'industry']],
  ['portland', 'Portland', 'OR', 45.52, -122.68, 2500, 'forest', ['port']],
  ['spokane', 'Spokane', 'WA', 47.66, -117.43, 590, 'forest', []],
  ['boise', 'Boise', 'ID', 43.62, -116.2, 800, 'plains', ['farm']],
  ['sanfrancisco', 'San Francisco', 'CA', 37.77, -122.42, 4700, 'forest', ['port', 'medical']],
  ['sacramento', 'Sacramento', 'CA', 38.58, -121.49, 2400, 'plains', ['farm']],
  ['fresno', 'Fresno', 'CA', 36.74, -119.79, 1000, 'plains', ['farm']],
  ['losangeles', 'Los Angeles', 'CA', 34.05, -118.24, 13000, 'desert', ['port', 'industry']],
  ['sandiego', 'San Diego', 'CA', 32.72, -117.16, 3300, 'desert', ['military', 'port']],
  ['lasvegas', 'Las Vegas', 'NV', 36.17, -115.14, 2300, 'desert', []],
  ['reno', 'Reno', 'NV', 39.53, -119.81, 500, 'desert', []],
  ['phoenix', 'Phoenix', 'AZ', 33.45, -112.07, 5000, 'desert', []],
  ['tucson', 'Tucson', 'AZ', 32.22, -110.97, 1000, 'desert', ['military']],
  ['saltlake', 'Salt Lake City', 'UT', 40.76, -111.89, 1300, 'desert', ['industry']],
  ['albuquerque', 'Albuquerque', 'NM', 35.08, -106.65, 900, 'desert', ['military']],
  ['elpaso', 'El Paso', 'TX', 31.76, -106.49, 870, 'desert', ['military']],
  ['denver', 'Denver', 'CO', 39.74, -104.99, 3000, 'tundra', []],
  ['coloradosprings', 'Colorado Springs', 'CO', 38.83, -104.82, 760, 'tundra', ['military']],
  ['cheyenne', 'Cheyenne', 'WY', 41.14, -104.82, 100, 'tundra', ['coal']],
  ['billings', 'Billings', 'MT', 45.78, -108.5, 180, 'tundra', ['coal']],
  ['rapidcity', 'Rapid City', 'SD', 44.08, -103.23, 150, 'tundra', ['military']],
  ['fargo', 'Fargo', 'ND', 46.88, -96.79, 250, 'tundra', ['farm']],
  ['minneapolis', 'Minneapolis', 'MN', 44.98, -93.27, 3700, 'tundra', ['industry']],
  ['duluth', 'Duluth', 'MN', 46.79, -92.1, 280, 'tundra', ['port']],
  ['rochestermn', 'Rochester', 'MN', 44.02, -92.47, 220, 'tundra', ['medical']],
  ['siouxfalls', 'Sioux Falls', 'SD', 43.55, -96.73, 280, 'plains', ['farm']],
  ['desmoines', 'Des Moines', 'IA', 41.59, -93.62, 700, 'plains', ['farm']],
  ['omaha', 'Omaha', 'NE', 41.26, -95.93, 970, 'plains', ['farm']],
  ['kansascity', 'Kansas City', 'MO', 39.1, -94.58, 2200, 'plains', []],
  ['wichita', 'Wichita', 'KS', 37.69, -97.34, 650, 'plains', ['farm', 'industry']],
  ['oklahomacity', 'Oklahoma City', 'OK', 35.47, -97.52, 1400, 'plains', ['military']],
  ['tulsa', 'Tulsa', 'OK', 36.15, -95.99, 1000, 'plains', ['industry']],
  ['dallas', 'Dallas', 'TX', 32.78, -96.8, 7600, 'plains', []],
  ['austin', 'Austin', 'TX', 30.27, -97.74, 2400, 'plains', []],
  ['killeen', 'Killeen', 'TX', 31.12, -97.73, 450, 'plains', ['military']],
  ['sanantonio', 'San Antonio', 'TX', 29.42, -98.49, 2600, 'plains', ['military']],
  ['houston', 'Houston', 'TX', 29.76, -95.37, 7100, 'swamp', ['medical', 'port', 'industry']],
  ['neworleans', 'New Orleans', 'LA', 29.95, -90.07, 1300, 'swamp', ['port']],
  ['batonrouge', 'Baton Rouge', 'LA', 30.45, -91.15, 870, 'swamp', ['industry']],
  ['memphis', 'Memphis', 'TN', 35.15, -90.05, 1300, 'forest', ['port']],
  ['littlerock', 'Little Rock', 'AR', 34.75, -92.29, 750, 'forest', ['military']],
  ['stlouis', 'St. Louis', 'MO', 38.63, -90.2, 2800, 'plains', ['industry']],
  ['chicago', 'Chicago', 'IL', 41.88, -87.63, 9400, 'tundra', ['industry', 'port']],
  ['milwaukee', 'Milwaukee', 'WI', 43.04, -87.91, 1600, 'tundra', ['industry']],
  ['detroit', 'Detroit', 'MI', 42.33, -83.05, 4300, 'tundra', ['industry']],
  ['indianapolis', 'Indianapolis', 'IN', 39.77, -86.16, 2100, 'plains', []],
  ['cincinnati', 'Cincinnati', 'OH', 39.1, -84.51, 2200, 'forest', []],
  ['columbus', 'Columbus', 'OH', 39.96, -83.0, 2100, 'forest', []],
  ['cleveland', 'Cleveland', 'OH', 41.5, -81.69, 2100, 'tundra', ['industry', 'medical']],
  ['pittsburgh', 'Pittsburgh', 'PA', 40.44, -79.99, 2400, 'forest', ['coal', 'industry', 'medical']],
  ['louisville', 'Louisville', 'KY', 38.25, -85.76, 1300, 'forest', []],
  ['lexington', 'Lexington', 'KY', 38.04, -84.5, 520, 'forest', ['coal']],
  ['charlestonwv', 'Charleston', 'WV', 38.35, -81.63, 200, 'forest', ['coal']],
  ['nashville', 'Nashville', 'TN', 36.16, -86.78, 2000, 'forest', []],
  ['atlanta', 'Atlanta', 'GA', 33.75, -84.39, 6100, 'forest', ['medical']],
  ['birmingham', 'Birmingham', 'AL', 33.52, -86.8, 1100, 'forest', ['industry']],
  ['jacksonville', 'Jacksonville', 'FL', 30.33, -81.66, 1600, 'swamp', ['military', 'port']],
  ['orlando', 'Orlando', 'FL', 28.54, -81.38, 2700, 'swamp', []],
  ['tampa', 'Tampa', 'FL', 27.95, -82.46, 3200, 'swamp', ['port']],
  ['miami', 'Miami', 'FL', 25.76, -80.19, 6100, 'swamp', ['port']],
  ['savannah', 'Savannah', 'GA', 32.08, -81.09, 400, 'swamp', ['port']],
  ['charlotte', 'Charlotte', 'NC', 35.23, -80.84, 2700, 'forest', []],
  ['raleigh', 'Raleigh', 'NC', 35.78, -78.64, 1400, 'forest', ['medical']],
  ['fayetteville', 'Fayetteville', 'NC', 35.05, -78.88, 390, 'forest', ['military']],
  ['norfolk', 'Norfolk', 'VA', 36.85, -76.29, 1800, 'forest', ['military', 'port']],
  ['richmond', 'Richmond', 'VA', 37.54, -77.44, 1300, 'forest', []],
  ['washington', 'Washington', 'DC', 38.91, -77.04, 6300, 'forest', ['military', 'medical']],
  ['baltimore', 'Baltimore', 'MD', 39.29, -76.61, 2800, 'forest', ['medical', 'port']],
  ['philadelphia', 'Philadelphia', 'PA', 39.95, -75.17, 6200, 'forest', ['medical', 'industry']],
  ['newyork', 'New York', 'NY', 40.71, -74.01, 19500, 'forest', ['port', 'medical']],
  ['hartford', 'Hartford', 'CT', 41.76, -72.67, 1200, 'forest', []],
  ['albany', 'Albany', 'NY', 42.65, -73.75, 900, 'tundra', []],
  ['buffalo', 'Buffalo', 'NY', 42.89, -78.88, 1100, 'tundra', ['industry']],
  ['boston', 'Boston', 'MA', 42.36, -71.06, 4900, 'tundra', ['medical', 'port']],
  ['portlandme', 'Portland', 'ME', 43.66, -70.26, 550, 'tundra', ['port']],
  ['burlington', 'Burlington', 'VT', 44.48, -73.21, 230, 'tundra', ['farm']],
].map(([id, name, state, lat, lon, pop, biome, tags]) => ({ id, name, state, lat, lon, pop, biome, tags }));

export const CITY = Object.fromEntries(CITIES.map((c) => [c.id, c]));

export function cityLabel(c) {
  return `${c.name}, ${c.state}`;
}

// Great-circle distance in miles.
export function miles(a, b) {
  const R = 3959;
  const r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r;
  const dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// How big a place it is: 0 town, 1 small city, 2 city, 3 metropolis.
export function citySize(c) {
  return c.pop < 300 ? 0 : c.pop < 1000 ? 1 : c.pop < 3500 ? 2 : 3;
}
export const SIZE_NAMES = ['Small town', 'Small city', 'City', 'Metropolis'];

// Map projection: lon/lat to 0..1 across the lower 48 (equirectangular,
// squeezed by cos(38°) so the country keeps its shape).
const LON0 = -125.5;
const LON1 = -66.0;
const LAT0 = 24.0;
const LAT1 = 49.8;
const K = Math.cos((38 * Math.PI) / 180);
export const MAP_ASPECT = ((LON1 - LON0) * K) / (LAT1 - LAT0);
export function project(lat, lon) {
  return [(lon - LON0) / (LON1 - LON0), (LAT1 - lat) / (LAT1 - LAT0)];
}

// The lower 48, simplified, as [lon, lat] points (clockwise from Cape
// Flattery). The northern border runs through the middle of the Great Lakes;
// the US halves of the lakes are drawn on top as water.
export const US_OUTLINE = [
  [-124.7, 48.4], [-122.75, 49.0], [-95.15, 49.0], [-94.6, 48.7], [-93.0, 48.6], [-91.4, 48.05], [-89.6, 48.0], [-88.4, 48.3],
  [-84.8, 46.9], [-84.4, 46.5], [-83.6, 46.1], [-82.4, 45.3], [-82.4, 43.0], [-82.5, 42.6], [-83.1, 42.05], [-81.2, 42.2],
  [-79.8, 42.5], [-78.9, 42.9], [-79.05, 43.25], [-77.6, 43.6], [-76.3, 43.95], [-75.8, 44.4], [-74.7, 45.0], [-71.5, 45.0],
  [-70.9, 45.3], [-70.0, 46.7], [-69.2, 47.45], [-68.2, 47.35], [-67.8, 47.07], [-67.8, 45.7], [-67.0, 44.9], [-68.5, 44.2],
  [-70.2, 43.6], [-70.7, 42.6], [-70.0, 41.8], [-70.6, 41.5], [-71.9, 41.3], [-73.6, 40.9], [-74.0, 40.5], [-74.0, 39.8],
  [-74.9, 38.9], [-75.4, 38.4], [-75.6, 37.6], [-76.0, 37.0], [-75.5, 35.3], [-76.6, 34.7], [-77.9, 33.9], [-79.2, 33.2],
  [-80.9, 32.0], [-81.4, 30.7], [-81.3, 29.5], [-80.6, 28.4], [-80.0, 26.7], [-80.1, 25.8], [-80.4, 25.2], [-81.1, 25.1],
  [-81.8, 26.1], [-82.6, 27.5], [-82.8, 28.8], [-83.7, 29.9], [-84.4, 30.0], [-85.4, 29.7], [-86.5, 30.4], [-88.0, 30.4],
  [-89.6, 30.2], [-89.4, 29.2], [-90.2, 29.1], [-91.5, 29.5], [-93.8, 29.7], [-94.8, 29.3], [-96.4, 28.4], [-97.2, 27.7],
  [-97.4, 26.0], [-99.1, 26.4], [-99.5, 27.5], [-100.3, 28.3], [-101.4, 29.8], [-102.4, 29.8], [-103.1, 29.0], [-104.5, 29.6],
  [-106.4, 31.8], [-108.2, 31.8], [-108.2, 31.33], [-111.1, 31.33], [-114.8, 32.5], [-117.1, 32.5], [-118.3, 33.7], [-119.0, 34.1],
  [-120.6, 34.6], [-121.9, 36.6], [-122.5, 37.8], [-123.7, 38.9], [-124.4, 40.4], [-124.2, 42.0], [-124.5, 43.0], [-123.9, 46.2],
  [-124.1, 47.0], [-124.7, 48.4],
];

// The US side of the Great Lakes (Michigan is wholly inside).
export const LAKES = [
  // Superior
  [[-92.1, 46.7], [-90.8, 46.6], [-89.0, 46.9], [-87.5, 46.5], [-86.0, 46.6], [-85.0, 46.75], [-84.4, 46.5], [-84.8, 46.9], [-88.4, 48.3], [-89.6, 48.0], [-91.4, 47.4]],
  // Michigan
  [[-87.8, 41.65], [-86.6, 41.8], [-86.3, 42.4], [-86.2, 43.3], [-86.5, 44.0], [-85.6, 45.0], [-84.8, 45.8], [-85.6, 45.95], [-86.6, 45.7], [-87.0, 45.4], [-87.6, 44.6], [-87.8, 43.0], [-87.6, 42.2]],
  // Huron
  [[-84.4, 46.0], [-83.6, 46.1], [-82.4, 45.3], [-82.4, 43.0], [-82.6, 44.0], [-83.0, 44.0], [-83.8, 43.9], [-83.4, 45.1], [-84.3, 45.7]],
  // Erie
  [[-83.4, 41.75], [-81.7, 41.5], [-80.1, 42.1], [-78.9, 42.9], [-79.8, 42.5], [-81.2, 42.2], [-83.1, 42.05]],
  // Ontario
  [[-79.05, 43.25], [-77.6, 43.25], [-76.5, 43.45], [-76.2, 43.9], [-76.3, 43.95], [-77.6, 43.6]],
];
