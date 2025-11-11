const tradeModel = require('../models/tradeModel');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');
const { PROD_CAT, PROD_UNIT, TRADE_STATUS_LIST, SEASON_LIST, PROD_DETAILS } = require('../config/constants');

const getListings = async (req, res) => {
  try {
    const { listing_name } = req.params;
    let result;

    if (listing_name) {
      switch (listing_name) {
        case 'product_category': result = PROD_CAT; break;
        case 'season': result = SEASON_LIST; break;
        case 'product_unit': result = PROD_UNIT; break;
        case 'trade_status_list': result = TRADE_STATUS_LIST; break;
        case 'prod_details': result = PROD_DETAILS; break;
        case 'all_products': 
          const { rows } = await tradeModel.getTradeProducts(req.dbName, {}, 1000, 0);
          result = rows;
          break;
        default: result = [];
      }
    } else {
      result = { 
        product_category: PROD_CAT, 
        season: SEASON_LIST, 
        product_unit: PROD_UNIT, 
        trade_status_list: TRADE_STATUS_LIST, 
        prod_details: PROD_DETAILS 
      };
    }

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.json({ success: 0, data: [], message: 'Data_Not_Found' });
    }

    res.json({ success: 1, data: result, message: 'Listed_Successfully' });
  } catch (error) {
    logger.error('Get listings error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

const addTradeProduct = async (req, res) => {
  try {
    const { id, step, ...postdata } = req.body;
    const insertdata = {};

    const postval = ['user_id', 'prod_cat_id', 'prod_type_id', 'prod_id', 'prod_variety_id', 'surplus', 'surplus_unit',
      'sell_qty', 'sell_qty_unit', 'price', 'price_unit', 'with_logistic_partner', 'storage_type_id', 'state', 'city',
      'pickup_location', 'produce_to_highway_distance', 'advance_payment', 'negotiations', 'certifcations'];

    if (postdata.prod_cat_id == 2) postval.push('prod_details');

    postval.forEach(key => {
      if (postdata[key] !== undefined && postdata[key] !== '') insertdata[key] = postdata[key];
    });

    if (step == 1) {
      insertdata.with_packging = postdata.with_packging === 'true';
      insertdata.packaging_master_id = insertdata.with_packging ? postdata.packaging_master_id : null;

      const other_details = {};
      if (postdata.prod_cat_id == 2) {
        other_details.season_from = '';
        other_details.season_to = '';
        other_details.availability_from = postdata.availability_from || '';
        other_details.availability_to = postdata.availability_to || '';
        other_details.yield_from = postdata.yield_from || '';
        other_details.yield_from_unit = postdata.yield_from_unit || '';
        other_details.yield_to = postdata.yield_to || '';
        other_details.yield_to_unit = postdata.yield_to_unit || '';
      } else {
        other_details.season_from = postdata.season_from || '';
        other_details.season_to = postdata.season_to || '';
        other_details.availability_from = '';
        other_details.availability_to = '';
        other_details.yield_from = '';
        other_details.yield_from_unit = '';
        other_details.yield_to = '';
        other_details.yield_to_unit = '';
      }
      insertdata.other_details = JSON.stringify(other_details);

      if (postdata.active_till_date) {
        const activeDate = new Date(postdata.active_till_date).toISOString();
        insertdata.active_till_date = activeDate;
        insertdata.expiry_date = activeDate;
      }
    }

    if (step == 2) {
      const other_distance = {
        railway: postdata.railway || '',
        airport: postdata.airport || '',
        post_office: postdata.post_office || '',
        godown: postdata.godown || '',
        national_highway: postdata.national_highway || '',
        state_highway: postdata.state_highway || ''
      };
      insertdata.other_distance = JSON.stringify(other_distance);
    }

    let result, insert_id, msg;

    if (!id) {
      insertdata.trade_status = 8;
      insertdata.status = 8;
      insertdata.added_date = new Date().toISOString();
      insertdata.created_on = new Date().toISOString();
      insertdata.created_by_id = postdata.user_id;

      result = await tradeModel.addTradeProduct(req.dbName, insertdata);
      insert_id = result.id;
      msg = 'Added_Successfully';
    } else {
      insertdata.updated_by_id = postdata.user_id;
      insertdata.updated_on = new Date().toISOString();

      const existing = await tradeModel.getTradeProductById(req.dbName, id);
      if (!existing) {
        return res.json({ success: 0, status: 0, data: [], message: 'Data_Not_Found' });
      }

      result = await tradeModel.updateTradeProduct(req.dbName, id, insertdata);
      insert_id = id;
      msg = 'Updated_Successfully';
    }

    res.json({ success: 1, status: 1, data: insert_id, message: msg });
  } catch (error) {
    logger.error('Add trade product error', { error: error.message, stack: error.stack });
    res.json({ success: 0, status: 0, data: [], message: 'Data_Not_Found' });
  }
};

const getTradeProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.json({ success: 0, data: [], message: 'Missing_Parameter' });
    }

    const filters = { id };
    const { rows } = await tradeModel.getTradeProducts(req.dbName, filters, 1, 0);
    
    if (rows.length === 0) {
      return res.json({ success: 0, data: [], message: 'Data_Not_Found' });
    }

    const product = rows[0];
    
    // Add enrichment similar to getTradeProducts
    const prodCat = PROD_CAT.find(p => p.id == product.prod_cat_id);
    product.product_category_title = prodCat?.title || '';
    
    const prodDetails = PROD_DETAILS.find(p => p.id == product.prod_details);
    product.prod_details_title = prodDetails?.title || '';
    
    ['surplus_unit', 'sell_qty_unit', 'price_unit'].forEach(unitKey => {
      const unit = PROD_UNIT.find(u => u.id == product[unitKey]);
      product[`${unitKey}_title`] = unit?.title || '';
    });
    
    ['status', 'trade_status'].forEach(statusKey => {
      const status = TRADE_STATUS_LIST.find(s => s.id == product[statusKey]);
      product[`${statusKey}_title`] = status?.title || '';
      product[`${statusKey}_class`] = status?.statusClass || '';
    });
    
    // Parse JSON fields safely
    try {
      product.other_details = product.other_details && typeof product.other_details === 'string' ? JSON.parse(product.other_details) : {};
    } catch (e) {
      product.other_details = {};
    }
    
    try {
      product.other_distance = product.other_distance && typeof product.other_distance === 'string' ? JSON.parse(product.other_distance) : {};
    } catch (e) {
      product.other_distance = {};
    }
    
    try {
      product.prod_images = product.prod_images && typeof product.prod_images === 'string' ? JSON.parse(product.prod_images) : {};
    } catch (e) {
      product.prod_images = {};
    }
    
    res.json({ success: 1, data: product, message: 'Listed_Successfully' });
  } catch (error) {
    logger.error('Get trade product by ID error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

const getTradeProducts = async (req, res) => {
  try {
    let { user_id, id, prod_cat_id, trade_status, start = 1 } = req.body;
    
    // Convert empty strings to null/undefined
    user_id = user_id === '' ? undefined : user_id;
    id = id === '' ? undefined : id;
    prod_cat_id = prod_cat_id === '' ? undefined : prod_cat_id;
    trade_status = trade_status === '' ? undefined : trade_status;
    
    const limit = 10;
    const offset = (start - 1) * limit;

    logger.info('Trade products request', { user_id, id, prod_cat_id, trade_status, start, dbName: req.dbName });

    const filters = { user_id, id, prod_cat_id, trade_status };
    const { rows, total } = await tradeModel.getTradeProducts(req.dbName, filters, limit, offset);

    logger.info('Trade products query result', { rowCount: rows.length, total });

    const result = [];
    for (const value of rows) {
      // Product category title
      const prodCat = PROD_CAT.find(p => p.id == value.prod_cat_id);
      value.product_category_title = prodCat?.title || '';

      // Product details title
      const prodDetails = PROD_DETAILS.find(p => p.id == value.prod_details);
      value.prod_details_title = prodDetails?.title || '';

      // Unit titles
      ['surplus_unit', 'sell_qty_unit', 'price_unit'].forEach(unitKey => {
        const unit = PROD_UNIT.find(u => u.id == value[unitKey]);
        value[`${unitKey}_title`] = unit?.title || '';
      });

      // Status titles and classes
      ['status', 'trade_status'].forEach(statusKey => {
        const status = TRADE_STATUS_LIST.find(s => s.id == value[statusKey]);
        value[`${statusKey}_title`] = status?.title || '';
        value[`${statusKey}_class`] = status?.statusClass || '';
      });

      // Parse JSON fields
      const other_details = value.other_details ? JSON.parse(value.other_details) : {};
      value.other_distance = value.other_distance ? JSON.parse(value.other_distance) : {};
      const prod_images = value.prod_images ? JSON.parse(value.prod_images) : {};

      // Season text generation
      let season_text = '';
      if (other_details.season_from) {
        const seasonFrom = SEASON_LIST.find(s => s.id == other_details.season_from);
        season_text += `From - ${seasonFrom?.title || ''}, `;
      }
      if (other_details.season_to) {
        const seasonTo = SEASON_LIST.find(s => s.id == other_details.season_to);
        season_text += ` To - ${seasonTo?.title || ''}`;
      }
      value.season_text = season_text;

      // Yield unit titles
      if (other_details.yield_from_unit) {
        const yieldFromUnit = PROD_UNIT.find(u => u.id == other_details.yield_from_unit);
        other_details.yield_from_unit_text = yieldFromUnit?.title || '';
      }
      if (other_details.yield_to_unit) {
        const yieldToUnit = PROD_UNIT.find(u => u.id == other_details.yield_to_unit);
        other_details.yield_to_unit_text = yieldToUnit?.title || '';
      }
      value.other_details = other_details;

      // Logistic text
      value.logistic_text = value.with_logistic_partner ? 'Included' : 'Not included';

      // Date formatting
      value.active_till_date = value.active_till_date ? new Date(value.active_till_date).toISOString().split('T')[0].split('-').reverse().join('-') : '';
      value.added_date = value.added_date ? new Date(value.added_date).toISOString().replace('T', ' ').split('.')[0] : '';
      value.expiry_date = value.expiry_date ? new Date(value.expiry_date).toISOString().replace('T', ' ').split('.')[0] : '';
      value.rejected_date = value.rejected_date || '';
      value.updated_on = value.updated_on ? new Date(value.updated_on).toISOString().replace('T', ' ').split('.')[0] : '';

      // Product images
      const prodImages = [];
      Object.values(prod_images).forEach(images => {
        if (Array.isArray(images)) prodImages.push(...images);
      });
      value.prod_images = prod_images;
      value.all_prod_images = prodImages;
      value.prod_thumbnail = `http://localhost:3000/uploads/config_master/prod_master/${value.product_logo}`;
      value.revoke_expire = false;

      // Get trade product bidding
      const biddingQuery = `SELECT * FROM trade_product_bidding 
        WHERE seller_id = $1 AND trade_product_id = $2 AND buyer_action != '3' 
        AND is_deleted = false AND is_active = true 
        ORDER BY seller_action ASC, buyer_action ASC, id DESC`;
      const biddingResult = await require('../config/database').query(req.dbName, biddingQuery, [value.user_id, value.id]);
      
      const bidding = [];
      for (const bid of biddingResult.rows) {
        bid.bid_date = bid.bid_date ? new Date(bid.bid_date).toISOString().replace('T', ' ').split('.')[0] : '';
        
        const bidStatus = TRADE_STATUS_LIST.find(s => s.id == bid.bid_status);
        bid.bid_status_title = bidStatus?.title || '';
        
        const qtyUnit = PROD_UNIT.find(u => u.id == bid.qty_unit);
        bid.qty_unit_title = qtyUnit?.title || '';

        // Get buyer details
        const buyerQuery = `SELECT first_name, last_name, profile_image FROM client WHERE id = $1`;
        const buyerResult = await require('../config/database').query(req.dbName, buyerQuery, [bid.buyer_id]);
        if (buyerResult.rows[0]) {
          const buyer = buyerResult.rows[0];
          bid.buyer_name = `${buyer.first_name || ''} ${buyer.last_name || ''}`.trim();
          bid.buyer_profile_image = buyer.profile_image;
        }

        bid.seller_action_date = bid.seller_action_date ? new Date(bid.seller_action_date).toISOString().replace('T', ' ').split('.')[0] : '';
        bid.buyer_action_date = bid.buyer_action_date ? new Date(bid.buyer_action_date).toISOString().replace('T', ' ').split('.')[0] : '';

        if (bid.seller_action == 1 || bid.seller_action == 5) {
          value.sold_to_buyer_id = bid.buyer_id;
          value.sold_to = bid.buyer_name;
          value.sold_on = bid.seller_action_date;
          value.bidding_id = bid.id;
          value.sold_bid_date = bid.bid_date;
          value.sold_price = bid.bid_price;
        }

        bidding.push(bid);
      }
      
      value.trade_product_bidding_count = bidding.length;
      value.trade_product_bidding = bidding;
      value.buyer_intrest_count = 0;
      value.buyer_intrest = [];

      result.push(value);
    }

    const image_path = 'http://localhost:3000/uploads/config_master/trade_products';
    const seller_invoice_path = 'http://localhost:3000/uploads/config_master/seller_invoice';
    const client_profile_path = 'http://localhost:3000/uploads/seller_buyer/user_data/profile';
    const prod_master_image_path = 'http://localhost:3000/uploads/config_master/prod_master';

    if (result.length > 0) {
      logger.info('Returning trade products', { count: result.length });
      res.json({
        success: 1,
        data: result,
        message: 'Listed_Successfully',
        total,
        image_path,
        seller_invoice_path,
        client_profile_path,
        prod_master_image_path
      });
    } else {
      logger.info('No trade products found', { filters });
      res.json({
        success: 0,
        data: [],
        message: 'Data_Not_Found',
        image_path,
        client_profile_path
      });
    }
  } catch (error) {
    logger.error('Get trade products error', { error: error.message, stack: error.stack });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

const deleteTradeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.json({ success: 0, data: [], message: 'Missing_Parameter' });
    }

    const result = await tradeModel.deleteTradeProduct(req.dbName, id);
    
    if (!result) {
      return res.json({ success: 0, data: [], message: 'Data_Not_Found' });
    }
    
    res.json({ success: 1, data: result, message: 'Deleted_Successfully' });
  } catch (error) {
    logger.error('Delete trade product error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

const getTradeBidding = async (req, res) => {
  try {
    const { product_id, id, start = 1 } = req.body;
    const limit = 4;
    const offset = (start - 1) * limit;

    if (!product_id) {
      return res.json({ success: 0, data: [], message: 'Missing_Parameter' });
    }

    const filters = { trade_product_id: product_id, id };
    const { rows, total } = await tradeModel.getTradeBidding(req.dbName, filters, limit, offset);

    const bidding = rows.map(bid => {
      const bidStatus = TRADE_STATUS_LIST.find(s => s.id == bid.bid_status);
      bid.bid_status_title = bidStatus?.title || '';

      const qtyUnit = PROD_UNIT.find(u => u.id == bid.qty_unit);
      bid.qty_unit_title = qtyUnit?.title || '';

      return bid;
    });

    const highestBidQuery = `SELECT MAX(bid_price) as highestBid FROM trade_product_bidding WHERE is_deleted = false AND is_active = true AND trade_product_id = $1`;
    const highestBidResult = await require('../config/database').query(req.dbName, highestBidQuery, [product_id]);
    const highestBid = highestBidResult.rows[0]?.highestbid || null;

    if (bidding.length > 0) {
      res.json({ success: 1, data: bidding, message: 'Listed_Successfully', num_rows: total, highestBid });
    } else {
      res.json({ success: 0, data: [], message: 'Data_Not_Found' });
    }
  } catch (error) {
    logger.error('Get trade bidding error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

const sellerAction = async (req, res) => {
  try {
    const { id: bidId, status, product_id, seller_id } = req.body;

    if (!product_id || !seller_id || !status) {
      return res.json({ success: 0, data: [], message: 'Missing_Parameter' });
    }

    const result = await tradeModel.updateSellerAction(req.dbName, bidId, product_id, seller_id, status);
    
    const data = {};
    data.trade_product = await require('../config/database').query(
      req.dbName,
      'SELECT id, user_id, status, reason FROM trade_product WHERE id = $1 AND is_deleted = false AND is_active = true',
      [product_id]
    );

    if (status !== '6' && bidId) {
      data.trade_product_bidding = await require('../config/database').query(
        req.dbName,
        'SELECT id, buyer_id, seller_id, trade_product_id, seller_action, bid_status FROM trade_product_bidding WHERE id = $1 AND is_deleted = false AND is_active = true',
        [bidId]
      );
    }

    if (data.trade_product.rows.length > 0) {
      res.json({ success: 1, data, message: 'Status_Updated_Successfully' });
    } else {
      res.json({ success: 0, data: [], message: 'Data_Not_Found' });
    }
  } catch (error) {
    logger.error('Seller action error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

// Additional trade functions to match original API
const getProductType = async (req, res) => {
  try {
    // Mock implementation
    const result = [];
    res.json({ success: result.length > 0 ? 1 : 0, data: result, message: result.length > 0 ? 'Listed_Successfully' : 'Data_Not_Found' });
  } catch (error) {
    logger.error('Get product type error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

const getProductData = async (req, res) => {
  try {
    const { product_category, product_type } = req.body;
    // Mock implementation
    const result = [];
    res.json({ success: result.length > 0 ? 1 : 0, data: result, message: result.length > 0 ? 'Listed_Successfully' : 'Data_Not_Found' });
  } catch (error) {
    logger.error('Get product data error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Missing_Parameter' });
  }
};

const getProductVariety = async (req, res) => {
  try {
    const { product_id } = req.params;
    if (!product_id) {
      return res.json({ success: 0, data: [], message: 'Missing_Parameter' });
    }
    // Mock implementation
    const result = [];
    res.json({ success: result.length > 0 ? 1 : 0, data: result, message: result.length > 0 ? 'Listed_Successfully' : 'Data_Not_Found' });
  } catch (error) {
    logger.error('Get product variety error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

const getPackagingList = async (req, res) => {
  try {
    // Mock implementation
    const result = [];
    res.json({ success: result.length > 0 ? 1 : 0, data: result, message: result.length > 0 ? 'Listed_Successfully' : 'Data_Not_Found' });
  } catch (error) {
    logger.error('Get packaging list error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

const getStorageType = async (req, res) => {
  try {
    // Mock implementation
    const result = [];
    res.json({ success: result.length > 0 ? 1 : 0, data: result, message: result.length > 0 ? 'Listed_Successfully' : 'Data_Not_Found' });
  } catch (error) {
    logger.error('Get storage type error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

const uploadTradeImages = async (req, res) => {
  try {
    const { id } = req.body;
    // Mock implementation
    const response = {
      success: 1,
      data: { uploaded_image: [] },
      message: 'Image_Uploaded_Successfully',
      error: ''
    };
    res.json(response);
  } catch (error) {
    logger.error('Upload trade images error', { error: error.message });
    res.json({ success: 0, data: { uploaded_image: [] }, message: 'Not_Able_Update', error: 1 });
  }
};

const removeImage = async (req, res) => {
  try {
    const { id, image, type } = req.body;
    if (!id || !image || !type) {
      return res.json({ success: 0, data: [], message: 'Missing_Parameter' });
    }
    // Mock implementation
    res.json({ success: 1, data: {}, message: 'Deleted_Successfully' });
  } catch (error) {
    logger.error('Remove image error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

const getIncentiveList = async (req, res) => {
  try {
    // Mock implementation
    const result = [];
    res.json({ success: result.length > 0 ? 1 : 0, data: result, message: result.length > 0 ? 'Listed Successfully!' : 'No Record Found!' });
  } catch (error) {
    logger.error('Get incentive list error', { error: error.message });
    res.json({ success: 0, data: [], message: 'No Record Found!' });
  }
};

const applyForIncentive = async (req, res) => {
  try {
    const { incentive_id, trade_bidding_id, user_id } = req.body;
    if (!incentive_id || !trade_bidding_id || !user_id) {
      return res.json({ success: 0, data: [], message: 'Parameter Missing!' });
    }
    // Mock implementation
    res.json({ success: 1, data: {}, message: 'Updated successfully!' });
  } catch (error) {
    logger.error('Apply for incentive error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Parameter Missing!' });
  }
};

const uploadInvoice = async (req, res) => {
  try {
    const { trade_bidding_id, action_by } = req.body;
    if (!trade_bidding_id) {
      return res.json({ success: 0, data: [], message: 'Missing Parameter!', error: '' });
    }
    // Mock implementation
    res.json({ success: 1, data: {}, message: 'Invoice uploaded successfully', error: '' });
  } catch (error) {
    logger.error('Upload invoice error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Missing Parameter!', error: '' });
  }
};

const addInterestOnProduct = async (req, res) => {
  try {
    const { buyer_id, trade_product_id } = req.body;
    if (!buyer_id || !trade_product_id) {
      return res.json({ status: 0, data: [], message: 'Missing_Parameter' });
    }
    // Mock implementation
    res.json({ status: 1, data: 1, message: 'Added_Successfully' });
  } catch (error) {
    logger.error('Add interest on product error', { error: error.message });
    res.json({ status: 0, data: [], message: 'Missing_Parameter' });
  }
};

const getBuyersInterestProductList = async (req, res) => {
  try {
    const { seller_id, trade_product_id } = req.body;
    if (!seller_id || !trade_product_id) {
      return res.json({ status: 0, data: [], message: 'Missing_Parameter' });
    }
    // Mock implementation
    const data = {};
    res.json({ success: 1, data, message: 'Listed Successfully!' });
  } catch (error) {
    logger.error('Get buyers interest product list error', { error: error.message });
    res.json({ status: 0, data: [], message: 'Missing_Parameter' });
  }
};

const getUpcomingProductList = async (req, res) => {
  try {
    const { seller_id } = req.params;
    // Mock implementation
    const result = [];
    res.json({ success: result.length > 0 ? 1 : 0, data: result, message: result.length > 0 ? 'Listed Successfully!' : 'No Record Found!' });
  } catch (error) {
    logger.error('Get upcoming product list error', { error: error.message });
    res.json({ success: 0, data: [], message: 'No Record Found!' });
  }
};

const addDemandProduct = async (req, res) => {
  try {
    const { buyer_id } = req.body;
    if (!buyer_id) {
      return res.json({ status: 0, data: [], message: 'Missing_Parameter' });
    }
    // Mock implementation
    res.json({ status: 1, data: 1, message: 'Added_Successfully' });
  } catch (error) {
    logger.error('Add demand product error', { error: error.message });
    res.json({ status: 0, data: [], message: 'Missing_Parameter' });
  }
};

const getBuyersDemandProductList = async (req, res) => {
  try {
    // Mock implementation
    const result = [];
    res.json({ success: result.length > 0 ? 1 : 0, data: result, message: result.length > 0 ? 'Listed Successfully!' : 'No Record Found!' });
  } catch (error) {
    logger.error('Get buyers demand product list error', { error: error.message });
    res.json({ success: 0, data: [], message: 'No Record Found!' });
  }
};

const getProductList = async (req, res) => {
  try {
    // Mock implementation
    const result = [];
    res.json({ success: 1, data: result, message: result.length > 0 ? 'Listed_Successfully' : 'Data_Not_Found' });
  } catch (error) {
    logger.error('Get product list error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Missing_Parameter' });
  }
};

const getTradeProductReport = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.json({ success: 0, data: [], message: 'User id is required.' });
    }
    // Mock implementation
    const data = [];
    res.json({ success: data.length > 0 ? 1 : 0, data, message: data.length > 0 ? 'Listed_Successfully' : 'Data_Not_Found' });
  } catch (error) {
    logger.error('Get trade product report error', { error: error.message });
    res.json({ success: 0, data: [], message: error.message });
  }
};

const getHomeFilter = async (req, res) => {
  try {
    const report_filter = [
      { id: 1, title: 'Year', value: new Date().getFullYear().toString() },
      { id: 2, title: 'Month', value: (new Date().getMonth() + 1).toString().padStart(2, '0') },
      { id: 3, title: 'Day', value: new Date().getDate().toString().padStart(2, '0') }
    ];
    res.json({ success: 1, data: report_filter, message: 'Listed_Successfully' });
  } catch (error) {
    logger.error('Get home filter error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

const getMarketableSurplus = async (req, res) => {
  try {
    const { user_id } = req.body;
    // Mock implementation
    const result = [];
    res.json({ success: result.length > 0 ? 1 : 0, data: result, message: result.length > 0 ? 'Listed_Successfully' : 'Data_Not_Found' });
  } catch (error) {
    logger.error('Get marketable surplus error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Data_Not_Found' });
  }
};

const markSelfSold = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) {
      return res.json({ success: 0, data: [], message: 'Missing_Parameter' });
    }
    // Mock implementation
    res.json({ success: 1, data: {}, message: 'Status updated successfully!' });
  } catch (error) {
    logger.error('Mark self sold error', { error: error.message });
    res.json({ success: 0, data: [], message: 'Status not updated!' });
  }
};

module.exports = {
  getListings,
  addTradeProduct,
  getTradeProducts,
  getTradeProductById,
  deleteTradeProduct,
  getTradeBidding,
  sellerAction,
  getProductType,
  getProductData,
  getProductVariety,
  getPackagingList,
  getStorageType,
  uploadTradeImages,
  removeImage,
  getIncentiveList,
  applyForIncentive,
  uploadInvoice,
  addInterestOnProduct,
  getBuyersInterestProductList,
  getUpcomingProductList,
  addDemandProduct,
  getBuyersDemandProductList,
  getProductList,
  getTradeProductReport,
  getHomeFilter,
  getMarketableSurplus,
  markSelfSold
};
