// controllers/calculateprice.js

// Haversine formula to calculate distance
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }
  
  // Controller to calculate the price
  exports.calculatePrice = (req, res) => {
    const { fromLat, fromLon, toLat, toLon } = req.body;
    
    if (!fromLat || !fromLon || !toLat || !toLon) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
  
    // Calculate the distance using Haversine formula
    const distance = haversine(fromLat, fromLon, toLat, toLon);
  
    // Price per kilometer (1.5)
    const pricePerKm = 1.5;
    const price = distance * pricePerKm;
  
    // Return the calculated price and distance
    res.json({ price: price.toFixed(2), distance: distance.toFixed(2) });
  };
  