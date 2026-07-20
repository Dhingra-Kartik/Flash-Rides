function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km

  // Convert degrees to radians
  const toRad = angle => (angle * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  // Haversine formula
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.asin(Math.sqrt(a));

  const distance = R * c;
  return distance; // distance in km

}


// Example usage:
console.log(haversineDistance(28.7041, 77.1025, 19.0760, 72.8777)); 
// ~1077 km (Delhi → Mumbai)
module.exports = {
    haversineDistance
}