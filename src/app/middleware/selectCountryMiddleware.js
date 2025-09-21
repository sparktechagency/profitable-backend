import geoip from "geoip-lite";

export function detectCountry(req, res, next) {
  // Get client IP
  try {
    
      const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    
      // Look up country by IP
      const geo = geoip.lookup(ip);
    
      if (geo && geo.country) {
        req.country = geo.country; // e.g. "bd", "us", "in"
      } else {
        req.country = "UAE"; // fallback default country
      }
      console.log("country",req.country);
      next();

  } catch (error) {
    next(error);
  }
}


