const { Pool } = require('pg');

class TradingModel {
  // Commodities
  async getCommodities(dbConfig, limit, offset) {
    const pool = new Pool(dbConfig);
    const query = `
      SELECT cl.*, c.name as commodity_name, c.category, u.name as seller_name, u.phone as seller_phone
      FROM commodity_listings cl
      JOIN commodities c ON cl.commodity_id = c.id
      JOIN users u ON cl.user_id = u.id
      WHERE cl.status = 'active'
      ORDER BY cl.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    await pool.end();
    return result.rows;
  }

  async getCommoditiesCount(dbConfig) {
    const pool = new Pool(dbConfig);
    const query = 'SELECT COUNT(*) FROM commodity_listings WHERE status = \'active\'';
    const result = await pool.query(query);
    await pool.end();
    return result.rows[0];
  }

  async getCommodityById(dbConfig, id) {
    const pool = new Pool(dbConfig);
    const query = `
      SELECT cl.*, c.name as commodity_name, c.category, u.name as seller_name, u.phone as seller_phone, u.email as seller_email
      FROM commodity_listings cl
      JOIN commodities c ON cl.commodity_id = c.id
      JOIN users u ON cl.user_id = u.id
      WHERE cl.id = $1
    `;
    const result = await pool.query(query, [id]);
    await pool.end();
    return result.rows[0];
  }

  async createCommodityListing(dbConfig, data) {
    const pool = new Pool(dbConfig);
    const query = `
      INSERT INTO commodity_listings (user_id, commodity_id, quantity, unit, price_per_unit, location, description, images, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', NOW())
      RETURNING id
    `;
    const values = [data.user_id, data.commodity_id, data.quantity, data.unit, data.price_per_unit, data.location, data.description, JSON.stringify(data.images || [])];
    const result = await pool.query(query, values);
    await pool.end();
    return result.rows[0].id;
  }

  async getCommodityListingById(dbConfig, id) {
    const pool = new Pool(dbConfig);
    const query = 'SELECT * FROM commodity_listings WHERE id = $1';
    const result = await pool.query(query, [id]);
    await pool.end();
    return result.rows[0];
  }

  async updateCommodityListing(dbConfig, id, data) {
    const pool = new Pool(dbConfig);
    const query = `
      UPDATE commodity_listings 
      SET quantity = $2, unit = $3, price_per_unit = $4, location = $5, description = $6, images = $7, updated_at = NOW()
      WHERE id = $1
    `;
    const values = [id, data.quantity, data.unit, data.price_per_unit, data.location, data.description, JSON.stringify(data.images || [])];
    await pool.query(query, values);
    await pool.end();
  }

  async deleteCommodityListing(dbConfig, id) {
    const pool = new Pool(dbConfig);
    const query = 'UPDATE commodity_listings SET status = \'deleted\' WHERE id = $1';
    await pool.query(query, [id]);
    await pool.end();
  }

  async getUserCommodityListings(dbConfig, userId, limit, offset, status) {
    const pool = new Pool(dbConfig);
    let query = `
      SELECT cl.*, c.name as commodity_name, c.category
      FROM commodity_listings cl
      JOIN commodities c ON cl.commodity_id = c.id
      WHERE cl.user_id = $1
    `;
    const values = [userId];
    
    if (status) {
      query += ' AND cl.status = $4';
      values.push(status);
    }
    
    query += ' ORDER BY cl.created_at DESC LIMIT $2 OFFSET $3';
    values.splice(1, 0, limit, offset);
    
    const result = await pool.query(query, values);
    await pool.end();
    return result.rows;
  }

  async getUserCommodityListingsCount(dbConfig, userId, status) {
    const pool = new Pool(dbConfig);
    let query = 'SELECT COUNT(*) FROM commodity_listings WHERE user_id = $1';
    const values = [userId];
    
    if (status) {
      query += ' AND status = $2';
      values.push(status);
    }
    
    const result = await pool.query(query, values);
    await pool.end();
    return result.rows[0];
  }

  async searchCommodities(dbConfig, filters, limit, offset) {
    const pool = new Pool(dbConfig);
    let query = `
      SELECT cl.*, c.name as commodity_name, c.category, u.name as seller_name
      FROM commodity_listings cl
      JOIN commodities c ON cl.commodity_id = c.id
      JOIN users u ON cl.user_id = u.id
      WHERE cl.status = 'active'
    `;
    const values = [];
    let paramCount = 0;

    if (filters.query) {
      paramCount++;
      query += ` AND (c.name ILIKE $${paramCount} OR cl.description ILIKE $${paramCount})`;
      values.push(`%${filters.query}%`);
    }

    if (filters.location) {
      paramCount++;
      query += ` AND cl.location ILIKE $${paramCount}`;
      values.push(`%${filters.location}%`);
    }

    if (filters.category) {
      paramCount++;
      query += ` AND c.category = $${paramCount}`;
      values.push(filters.category);
    }

    if (filters.min_price) {
      paramCount++;
      query += ` AND cl.price_per_unit >= $${paramCount}`;
      values.push(filters.min_price);
    }

    if (filters.max_price) {
      paramCount++;
      query += ` AND cl.price_per_unit <= $${paramCount}`;
      values.push(filters.max_price);
    }

    query += ` ORDER BY cl.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    await pool.end();
    return result.rows;
  }

  async searchCommoditiesCount(dbConfig, filters) {
    const pool = new Pool(dbConfig);
    let query = `
      SELECT COUNT(*)
      FROM commodity_listings cl
      JOIN commodities c ON cl.commodity_id = c.id
      WHERE cl.status = 'active'
    `;
    const values = [];
    let paramCount = 0;

    if (filters.query) {
      paramCount++;
      query += ` AND (c.name ILIKE $${paramCount} OR cl.description ILIKE $${paramCount})`;
      values.push(`%${filters.query}%`);
    }

    if (filters.location) {
      paramCount++;
      query += ` AND cl.location ILIKE $${paramCount}`;
      values.push(`%${filters.location}%`);
    }

    if (filters.category) {
      paramCount++;
      query += ` AND c.category = $${paramCount}`;
      values.push(filters.category);
    }

    if (filters.min_price) {
      paramCount++;
      query += ` AND cl.price_per_unit >= $${paramCount}`;
      values.push(filters.min_price);
    }

    if (filters.max_price) {
      paramCount++;
      query += ` AND cl.price_per_unit <= $${paramCount}`;
      values.push(filters.max_price);
    }

    const result = await pool.query(query, values);
    await pool.end();
    return result.rows[0];
  }

  async getCommodityCategories(dbConfig) {
    const pool = new Pool(dbConfig);
    const query = 'SELECT DISTINCT category FROM commodities ORDER BY category';
    const result = await pool.query(query);
    await pool.end();
    return result.rows;
  }

  // Bids
  async createBid(dbConfig, data) {
    const pool = new Pool(dbConfig);
    const query = `
      INSERT INTO bids (commodity_listing_id, bidder_id, bid_amount, quantity, message, status, created_at)
      VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
      RETURNING id
    `;
    const values = [data.commodity_listing_id, data.bidder_id, data.bid_amount, data.quantity, data.message];
    const result = await pool.query(query, values);
    await pool.end();
    return result.rows[0].id;
  }

  async getCommodityBids(dbConfig, commodityId, limit, offset) {
    const pool = new Pool(dbConfig);
    const query = `
      SELECT b.*, u.name as bidder_name, u.phone as bidder_phone
      FROM bids b
      JOIN users u ON b.bidder_id = u.id
      WHERE b.commodity_listing_id = $1
      ORDER BY b.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [commodityId, limit, offset]);
    await pool.end();
    return result.rows;
  }

  async getCommodityBidsCount(dbConfig, commodityId) {
    const pool = new Pool(dbConfig);
    const query = 'SELECT COUNT(*) FROM bids WHERE commodity_listing_id = $1';
    const result = await pool.query(query, [commodityId]);
    await pool.end();
    return result.rows[0];
  }

  async getBidById(dbConfig, bidId) {
    const pool = new Pool(dbConfig);
    const query = 'SELECT * FROM bids WHERE id = $1';
    const result = await pool.query(query, [bidId]);
    await pool.end();
    return result.rows[0];
  }

  async updateBidStatus(dbConfig, bidId, status) {
    const pool = new Pool(dbConfig);
    const query = 'UPDATE bids SET status = $2, updated_at = NOW() WHERE id = $1';
    await pool.query(query, [bidId, status]);
    await pool.end();
  }

  async getUserBids(dbConfig, userId, limit, offset, status) {
    const pool = new Pool(dbConfig);
    let query = `
      SELECT b.*, cl.commodity_id, c.name as commodity_name, u.name as seller_name
      FROM bids b
      JOIN commodity_listings cl ON b.commodity_listing_id = cl.id
      JOIN commodities c ON cl.commodity_id = c.id
      JOIN users u ON cl.user_id = u.id
      WHERE b.bidder_id = $1
    `;
    const values = [userId];
    
    if (status) {
      query += ' AND b.status = $4';
      values.push(status);
    }
    
    query += ' ORDER BY b.created_at DESC LIMIT $2 OFFSET $3';
    values.splice(1, 0, limit, offset);
    
    const result = await pool.query(query, values);
    await pool.end();
    return result.rows;
  }

  async getUserBidsCount(dbConfig, userId, status) {
    const pool = new Pool(dbConfig);
    let query = 'SELECT COUNT(*) FROM bids WHERE bidder_id = $1';
    const values = [userId];
    
    if (status) {
      query += ' AND status = $2';
      values.push(status);
    }
    
    const result = await pool.query(query, values);
    await pool.end();
    return result.rows[0];
  }

  // Orders
  async createOrder(dbConfig, data) {
    const pool = new Pool(dbConfig);
    const query = `
      INSERT INTO orders (commodity_listing_id, buyer_id, seller_id, quantity, unit_price, total_amount, delivery_address, payment_method, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
      RETURNING id
    `;
    const values = [data.commodity_listing_id, data.buyer_id, data.seller_id, data.quantity, data.unit_price, data.total_amount, data.delivery_address, data.payment_method];
    const result = await pool.query(query, values);
    await pool.end();
    return result.rows[0].id;
  }

  async getUserOrders(dbConfig, userId, limit, offset, status, type) {
    const pool = new Pool(dbConfig);
    let query = `
      SELECT o.*, cl.commodity_id, c.name as commodity_name, 
             CASE WHEN o.buyer_id = $1 THEN u_seller.name ELSE u_buyer.name END as other_party_name
      FROM orders o
      JOIN commodity_listings cl ON o.commodity_listing_id = cl.id
      JOIN commodities c ON cl.commodity_id = c.id
      LEFT JOIN users u_seller ON o.seller_id = u_seller.id
      LEFT JOIN users u_buyer ON o.buyer_id = u_buyer.id
      WHERE (o.buyer_id = $1 OR o.seller_id = $1)
    `;
    const values = [userId];
    let paramCount = 1;

    if (type === 'buy') {
      paramCount++;
      query += ` AND o.buyer_id = $${paramCount}`;
      values.push(userId);
    } else if (type === 'sell') {
      paramCount++;
      query += ` AND o.seller_id = $${paramCount}`;
      values.push(userId);
    }

    if (status) {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      values.push(status);
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    await pool.end();
    return result.rows;
  }

  async getUserOrdersCount(dbConfig, userId, status, type) {
    const pool = new Pool(dbConfig);
    let query = 'SELECT COUNT(*) FROM orders WHERE (buyer_id = $1 OR seller_id = $1)';
    const values = [userId];
    let paramCount = 1;

    if (type === 'buy') {
      paramCount++;
      query += ` AND buyer_id = $${paramCount}`;
      values.push(userId);
    } else if (type === 'sell') {
      paramCount++;
      query += ` AND seller_id = $${paramCount}`;
      values.push(userId);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      values.push(status);
    }

    const result = await pool.query(query, values);
    await pool.end();
    return result.rows[0];
  }

  async getOrderById(dbConfig, orderId) {
    const pool = new Pool(dbConfig);
    const query = 'SELECT * FROM orders WHERE id = $1';
    const result = await pool.query(query, [orderId]);
    await pool.end();
    return result.rows[0];
  }

  async updateOrderStatus(dbConfig, orderId, status) {
    const pool = new Pool(dbConfig);
    const query = 'UPDATE orders SET status = $2, updated_at = NOW() WHERE id = $1';
    await pool.query(query, [orderId, status]);
    await pool.end();
  }

  async getOrderDetails(dbConfig, orderId) {
    const pool = new Pool(dbConfig);
    const query = `
      SELECT o.*, cl.commodity_id, c.name as commodity_name, c.category,
             u_buyer.name as buyer_name, u_buyer.phone as buyer_phone, u_buyer.email as buyer_email,
             u_seller.name as seller_name, u_seller.phone as seller_phone, u_seller.email as seller_email
      FROM orders o
      JOIN commodity_listings cl ON o.commodity_listing_id = cl.id
      JOIN commodities c ON cl.commodity_id = c.id
      JOIN users u_buyer ON o.buyer_id = u_buyer.id
      JOIN users u_seller ON o.seller_id = u_seller.id
      WHERE o.id = $1
    `;
    const result = await pool.query(query, [orderId]);
    await pool.end();
    return result.rows[0];
  }

  // Statistics
  async getTradingStats(dbConfig, userId) {
    const pool = new Pool(dbConfig);
    const queries = [
      'SELECT COUNT(*) as total_listings FROM commodity_listings WHERE user_id = $1',
      'SELECT COUNT(*) as active_listings FROM commodity_listings WHERE user_id = $1 AND status = \'active\'',
      'SELECT COUNT(*) as total_orders_as_buyer FROM orders WHERE buyer_id = $1',
      'SELECT COUNT(*) as total_orders_as_seller FROM orders WHERE seller_id = $1',
      'SELECT COUNT(*) as total_bids_made FROM bids WHERE bidder_id = $1',
      'SELECT COUNT(*) as total_bids_received FROM bids b JOIN commodity_listings cl ON b.commodity_listing_id = cl.id WHERE cl.user_id = $1'
    ];

    const results = await Promise.all(queries.map(query => pool.query(query, [userId])));
    await pool.end();

    return {
      total_listings: results[0].rows[0].total_listings,
      active_listings: results[1].rows[0].active_listings,
      total_orders_as_buyer: results[2].rows[0].total_orders_as_buyer,
      total_orders_as_seller: results[3].rows[0].total_orders_as_seller,
      total_bids_made: results[4].rows[0].total_bids_made,
      total_bids_received: results[5].rows[0].total_bids_received
    };
  }

  async getMarketTrends(dbConfig, commodityId, days) {
    const pool = new Pool(dbConfig);
    const query = `
      SELECT DATE(created_at) as date, AVG(price_per_unit) as avg_price, COUNT(*) as listings_count
      FROM commodity_listings
      WHERE commodity_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
    const result = await pool.query(query, [commodityId]);
    await pool.end();
    return result.rows;
  }

  // Watchlist
  async addToWatchlist(dbConfig, userId, commodityId) {
    const pool = new Pool(dbConfig);
    const query = `
      INSERT INTO watchlist (user_id, commodity_id, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id, commodity_id) DO NOTHING
      RETURNING id
    `;
    const result = await pool.query(query, [userId, commodityId]);
    await pool.end();
    return result.rows[0]?.id || null;
  }

  async getUserWatchlist(dbConfig, userId, limit, offset) {
    const pool = new Pool(dbConfig);
    const query = `
      SELECT w.*, c.name as commodity_name, c.category,
             COUNT(cl.id) as active_listings,
             AVG(cl.price_per_unit) as avg_price
      FROM watchlist w
      JOIN commodities c ON w.commodity_id = c.id
      LEFT JOIN commodity_listings cl ON c.id = cl.commodity_id AND cl.status = 'active'
      WHERE w.user_id = $1
      GROUP BY w.id, c.id, c.name, c.category
      ORDER BY w.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [userId, limit, offset]);
    await pool.end();
    return result.rows;
  }

  async getUserWatchlistCount(dbConfig, userId) {
    const pool = new Pool(dbConfig);
    const query = 'SELECT COUNT(*) FROM watchlist WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    await pool.end();
    return result.rows[0];
  }

  async removeFromWatchlist(dbConfig, userId, commodityId) {
    const pool = new Pool(dbConfig);
    const query = 'DELETE FROM watchlist WHERE user_id = $1 AND commodity_id = $2';
    await pool.query(query, [userId, commodityId]);
    await pool.end();
  }
}

module.exports = new TradingModel();