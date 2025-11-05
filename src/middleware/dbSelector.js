const dbSelector = (req, res, next) => {
  const appname = req.headers['appname'] || req.headers['http_appname'];
  const domain = req.headers['domain'];

  let dbName = 'seller_buyer'; // Default database
  let clientType = 2; // Default: Seller

  // Priority 1: Use appname if provided
  if (appname) {
    dbName = appname;
  }

  // Determine client type from domain (supports "buyer", "seller", or full domain)
  if (domain) {
    const lowerDomain = domain.toLowerCase();
    if (lowerDomain === 'buyer' || lowerDomain.includes('buyer')) {
      clientType = 1; // Buyer
    } else if (lowerDomain === 'seller' || lowerDomain.includes('seller')) {
      clientType = 2; // Seller
    }
  }

  req.dbName = dbName;
  req.domain = domain || 'default';
  req.clientType = clientType;
  req.isBuyer = clientType === 1;
  req.isSeller = clientType === 2;

  next();
};

module.exports = dbSelector;
