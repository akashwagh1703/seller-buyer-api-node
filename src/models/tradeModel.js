const db = require('../config/database');

const tradeModel = {
  async addTradeProduct(dbName, data) {
    const query = `INSERT INTO trade_product (
      user_id, prod_cat_id, prod_type_id, prod_id, prod_variety_id, surplus, surplus_unit,
      sell_qty, sell_qty_unit, price, price_unit, with_logistic_partner, storage_type_id,
      state, city, pickup_location, produce_to_highway_distance, advance_payment, negotiations,
      certifcations, trade_status, status, added_date, created_on, created_by_id, with_packging,
      packaging_master_id, prod_details, other_details, other_distance, active_till_date, expiry_date
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)
    RETURNING id`;
    
    const values = [
      data.user_id, data.prod_cat_id, data.prod_type_id, data.prod_id, data.prod_variety_id,
      data.surplus, data.surplus_unit, data.sell_qty, data.sell_qty_unit, data.price, data.price_unit,
      data.with_logistic_partner, data.storage_type_id, data.state, data.city, data.pickup_location,
      data.produce_to_highway_distance, data.advance_payment, data.negotiations, data.certifcations,
      data.trade_status, data.status, data.added_date, data.created_on, data.created_by_id,
      data.with_packging, data.packaging_master_id, data.prod_details, data.other_details,
      data.other_distance, data.active_till_date, data.expiry_date
    ];
    
    const result = await db.query(dbName, query, values);
    return result.rows[0];
  },

  async updateTradeProduct(dbName, id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      fields.push(`${key} = $${paramCount}`);
      values.push(data[key]);
      paramCount++;
    });

    values.push(id);
    const query = `UPDATE trade_product SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await db.query(dbName, query, values);
    return result.rows[0];
  },

  async getTradeProductById(dbName, id) {
    const query = `SELECT * FROM trade_product WHERE id = $1 AND is_deleted = false`;
    const result = await db.query(dbName, query, [id]);
    return result.rows[0];
  },

  async getTradeProducts(dbName, filters, limit, offset) {
    let query = `SELECT tp.*, pm.title as product_title, pm.logo as product_logo,
      pv.title as product_variety_title, pt.title as product_type_title,
      pkg.title as packaging_title, st.title as storage_type_title,
      s.name as state_name, c.name as city_name
      FROM trade_product tp
      LEFT JOIN prod_master pm ON pm.id = tp.prod_id
      LEFT JOIN prod_variety pv ON pv.id = tp.prod_variety_id
      LEFT JOIN prod_type pt ON pt.id = tp.prod_type_id
      LEFT JOIN packaging_master pkg ON pkg.id = tp.packaging_master_id
      LEFT JOIN storage_type st ON st.id = tp.storage_type_id
      LEFT JOIN states_new s ON s.id::varchar = tp.state::varchar
      LEFT JOIN cities_new c ON c.id::varchar = tp.city::varchar
      WHERE tp.is_deleted = false AND tp.is_active = true`;
    
    const values = [];
    let paramCount = 1;

    if (filters.user_id) {
      query += ` AND tp.user_id = $${paramCount}`;
      values.push(filters.user_id);
      paramCount++;
    }
    if (filters.prod_cat_id) {
      query += ` AND tp.prod_cat_id = $${paramCount}`;
      values.push(filters.prod_cat_id);
      paramCount++;
    }
    if (filters.trade_status) {
      query += ` AND tp.status = $${paramCount}`;
      values.push(filters.trade_status);
      paramCount++;
    }
    if (filters.id) {
      query += ` AND tp.id = $${paramCount}`;
      values.push(filters.id);
      paramCount++;
    }

    query += ` ORDER BY CASE WHEN tp.updated_on IS NOT NULL THEN tp.updated_on ELSE '0001-01-01' END DESC, tp.id DESC`;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await db.query(dbName, query, values);
    
    const countQuery = query.split('LIMIT')[0];
    const countResult = await db.query(dbName, `SELECT COUNT(*) FROM (${countQuery}) as count_query`, values.slice(0, -2));
    
    return { rows: result.rows, total: parseInt(countResult.rows[0].count) };
  },

  async deleteTradeProduct(dbName, id) {
    const query = `UPDATE trade_product SET is_deleted = true WHERE id = $1 RETURNING id`;
    const result = await db.query(dbName, query, [id]);
    return result.rows[0];
  },

  async getTradeBidding(dbName, filters, limit, offset) {
    let query = `SELECT * FROM trade_product_bidding WHERE is_deleted = false AND is_active = true`;
    const values = [];
    let paramCount = 1;

    if (filters.trade_product_id) {
      query += ` AND trade_product_id = $${paramCount}`;
      values.push(filters.trade_product_id);
      paramCount++;
    }
    if (filters.id) {
      query += ` AND id = $${paramCount}`;
      values.push(filters.id);
      paramCount++;
    }

    query += ` ORDER BY id DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await db.query(dbName, query, values);
    const countQuery = `SELECT COUNT(*) FROM trade_product_bidding WHERE is_deleted = false AND is_active = true AND trade_product_id = $1`;
    const countResult = await db.query(dbName, countQuery, [filters.trade_product_id]);
    
    return { rows: result.rows, total: parseInt(countResult.rows[0].count) };
  },

  async updateSellerAction(dbName, bidId, productId, sellerId, status) {
    const currentDate = new Date().toISOString();
    let reason, bidStatus, tradeProduct;

    switch (status) {
      case '1': // Accept
        reason = 'Accepted by Seller';
        bidStatus = tradeProduct = 4; // Sold
        break;
      case '2': // Revoke
        reason = 'Revoked by Seller';
        bidStatus = status;
        tradeProduct = 3; // Live
        break;
      case '3': // Reject
        reason = 'Reject by Seller';
        bidStatus = status;
        tradeProduct = 3; // Live
        break;
      case '5': // Complete
        reason = 'Completed by Seller';
        bidStatus = status;
        tradeProduct = 5; // Completed
        break;
      case '7': // Self sold
        reason = 'Sold by out of system';
        tradeProduct = 7; // Self Sold
        break;
      case '9': // Bid Lock
        reason = 'Bid locked';
        bidStatus = status;
        tradeProduct = 9; // Bid Locked
        break;
      default:
        reason = null;
        bidStatus = null;
    }

    // Update trade_product
    const productQuery = `UPDATE trade_product SET status = $1, reason = $2, updated_by_id = $3, updated_on = $4 WHERE id = $5`;
    await db.query(dbName, productQuery, [tradeProduct, reason, sellerId, currentDate, productId]);

    // Update trade_product_bidding if not self-sold
    if (status !== '6' && bidId) {
      const biddingQuery = `UPDATE trade_product_bidding SET seller_action = $1, seller_action_date = $2, bid_status = $3, updated_by_id = $4, updated_on = $5 WHERE id = $6`;
      await db.query(dbName, biddingQuery, [status, currentDate, bidStatus, sellerId, currentDate, bidId]);
    }

    return { success: true, reason, tradeProduct };
  }
};

module.exports = tradeModel;
