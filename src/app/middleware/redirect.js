

const redirectUrl = (req, res, next) => {
  const host = req.headers.host; // e.g., 'uk.profitablebusinessesforsale.com' or 'profitablebusinessesforsale.com'
  console.log('Host:', host); // Debug: Log the host to verify

  try {
    // Normalize host to handle ports (e.g., localhost:3000)
    const hostWithoutPort = host.split(':')[0];

    // Define subdomain-to-country mapping
    const subdomainToCountry = {
      'uk': 'uk',
      'us': 'usa',
      'uae': 'uae',
      'za': 'rsa',
      'ca': 'ca',
      'au': 'au',
      // Add more subdomains as needed
    };

    // Check if the host is a subdomain
    if (hostWithoutPort !== 'profitablebusinessesforsale.com') {
      const subdomain = hostWithoutPort.split('.')[0]; // Extract subdomain (e.g., 'uk')
      const country = subdomainToCountry[subdomain]; // Map to country code

      if (country) {
        // Redirect subdomain to subdirectory
        const redirectUrl = `https://profitablebusinessesforsale.com/businesses-for-sale/${country}${req.url}`;
        console.log('Redirecting to:', redirectUrl);
        return res.redirect(301, redirectUrl);
      }
    }

    // Optionally handle main domain (e.g., redirect to a default country or page)
    if (hostWithoutPort === 'profitablebusinessesforsale.com') {
      // Example: Redirect main domain to a default page
      const redirectUrl = `https://profitablebusinessesforsale.com/businesses-for-sale/`;
      if (req.url === '/') {
        console.log('Redirecting main domain to:', redirectUrl);
        return res.redirect(301, redirectUrl);
      }
    }

    // If no redirect is needed, proceed to next middleware
    next();
  } catch (error) {
    console.error('Redirect middleware error:', error);
    next(error);
  }
};

export { redirectUrl};