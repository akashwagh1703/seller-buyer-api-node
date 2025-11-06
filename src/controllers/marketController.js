const { query } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const getNearbyMarket = async (req, res) => {
  try {
    const { lat = '19.997454', long = '73.789803' } = req.params;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(long);
    const radius = 20; // miles

    const locationSql = `
      SELECT COALESCE(
        (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )), 0
      ) AS distance, apmc_market, latitude, longitude 
      FROM apmc_location_master 
      ORDER BY distance ASC 
      LIMIT 1
    `;

    const locationResult = await query(req.dbName, locationSql, [latitude, longitude]);
    
    if (locationResult.rows.length === 0) {
      return sendError(res, 'No_Market_Found', 404);
    }

    const apmc_market = locationResult.rows[0].apmc_market.toLowerCase();
    const lang = req.headers.lang || 'en';
    
    let commodityField = 'commodityname as commodity';
    if (lang === 'mr') {
      commodityField = 'commodity_marathi as commodity';
    } else if (lang === 'hi') {
      commodityField = 'commodity_hindi as commodity';
    }

    const commoditySql = `
      SELECT market, ${commodityField}, varity as variety, 
             minimumprices as min_price, maximumprices as max_price,
             marketwiseapmcpricedate as arrival_date, arrivals, unitofarrivals
      FROM tbl_maharashtra 
      WHERE lower(market) = lower($1)
      ORDER BY marketwiseapmcpricedate DESC 
      LIMIT 20
    `;

    const commodityResult = await query(req.dbName, commoditySql, [apmc_market]);

    const response = {
      locations_data: locationResult.rows,
      data: commodityResult.rows,
      apmc_market
    };

    sendSuccess(res, 'Listed_Successfully', response);
  } catch (error) {
    logger.error('Get nearby market error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

const getNearbyMarketAllData = async (req, res) => {
  try {
    const { apmc_market, lat, long, start = 1 } = req.body;
    const latitude = parseFloat(lat) || 19.997454;
    const longitude = parseFloat(long) || 73.789803;
    const limit = 10;
    const startSql = limit * (start - 1);
    const lang = req.headers.lang || 'en';

    let marketData = apmc_market;
    
    if (!marketData) {
      const locationSql = `
        SELECT COALESCE(
          (6371 * acos(
            cos(radians($1)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians($2)) + 
            sin(radians($1)) * sin(radians(latitude))
          )), 0
        ) AS distance, apmc_market, latitude, longitude 
        FROM apmc_location_master 
        ORDER BY distance ASC 
        LIMIT 1
      `;
      
      const locationResult = await query(req.dbName, locationSql, [latitude, longitude]);
      marketData = locationResult.rows[0]?.apmc_market?.toLowerCase();
    }

    if (!marketData) {
      return sendError(res, 'No_Market_Found', 404);
    }

    let commodityField = 'tm.commodityname as commodity_title';
    let mapKeyField = 'tm.commodityname as map_key';
    
    if (lang === 'mr') {
      commodityField = 'tm.commodity_marathi as commodity_title';
    } else if (lang === 'hi') {
      commodityField = 'tm.commodity_hindi as commodity_title';
    }

    const commoditySql = `
      SELECT tm.market, ${mapKeyField}, ${commodityField}, 
             tm.commodityname as commodity, tm.varity as variety,
             tm.minimumprices as min_price, tm.maximumprices as max_price,
             tm.marketwiseapmcpricedate as arrival_date,
             to_char(to_timestamp(tm.marketwiseapmcpricedate, 'YYYY-MM-DD'), 'YYYY-MM-DD') as NewDateFormat,
             tm.arrivals, tm.unitofarrivals, tm.modalprices, tm.unitofprice, cr.logo
      FROM tbl_maharashtra as tm
      LEFT JOIN crop as cr ON cr.crop_id = tm.pg_crop_master_id
      WHERE lower(tm.market) = lower($1)
      ORDER BY tm.marketwiseapmcpricedate DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await query(req.dbName, commoditySql, [marketData, limit, startSql]);

    const response = {
      locations_data: [{ 
        apmc_market: marketData.charAt(0).toUpperCase() + marketData.slice(1), 
        latitude, 
        longitude 
      }],
      data: result.rows,
      apmc_market: marketData
    };

    sendSuccess(res, 'Listed_Successfully', response);
  } catch (error) {
    logger.error('Get nearby market all data error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

const getMarkets = async (req, res) => {
  try {
    const sql = `
      SELECT *, CONCAT(UPPER(SUBSTRING(apmc_market,1,1)),LOWER(SUBSTRING(apmc_market,2))) AS market 
      FROM apmc_location_master
      WHERE is_deleted = false 
      ORDER BY market ASC
    `;

    const result = await query(req.dbName, sql, []);

    if (result.rows.length > 0) {
      sendSuccess(res, 'APMC_Market_Listing', result.rows);
    } else {
      sendError(res, 'No_Markets_Found', 404);
    }
  } catch (error) {
    logger.error('Get markets error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

const getSellerMarkets = async (req, res) => {
  try {
    const sql = `
      SELECT * FROM market_master 
      WHERE is_active = true AND is_deleted = false
    `;

    const result = await query(req.dbName, sql, []);

    if (result.rows.length > 0) {
      sendSuccess(res, 'Seller_Market_Listing', result.rows);
    } else {
      sendError(res, 'No_Markets_Found', 404);
    }
  } catch (error) {
    logger.error('Get seller markets error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

const getCommodityDetails = async (req, res) => {
  try {
    const { commodity_name, market_name, varity, is_encode } = req.body;
    let commodityName = commodity_name;
    let marketName = market_name;
    let varietyName = varity;

    if (is_encode == 1) {
      commodityName = commodity_name ? Buffer.from(commodity_name, 'base64').toString() : '';
      marketName = market_name ? Buffer.from(market_name, 'base64').toString() : '';
      varietyName = varity ? Buffer.from(varity, 'base64').toString() : '';
    }

    const lang = req.headers.lang || 'en';
    let commodityField = 'commodityname';
    
    if (lang === 'mr') {
      commodityField = 'commodity_marathi';
    } else if (lang === 'hi') {
      commodityField = 'commodity_hindi';
    }

    const varietyCondition = varietyName ? `AND varity ILIKE '${varietyName}'` : '';

    // Get recent 5 days data
    const recentSql = `
      SELECT marketwiseapmcpricedate as NewDateFormat, commodityname, market,
             minimumprices, maximumprices, modalprices, unitofprice,
             unitofarrivals, arrivals, varity
      FROM tbl_maharashtra 
      WHERE ${commodityField} ILIKE '${commodityName}' ${varietyCondition}
        AND market ILIKE '${marketName}'
      ORDER BY marketwiseapmcpricedate DESC 
      LIMIT 5
    `;

    const recentResult = await query(req.dbName, recentSql, []);

    // Get 30 days data for graph
    const graphSql = `
      SELECT marketwiseapmcpricedate as NewDateFormat, commodityname, market,
             minimumprices, maximumprices, modalprices, unitofprice,
             unitofarrivals, arrivals, varity
      FROM tbl_maharashtra 
      WHERE ${commodityField} ILIKE '${commodityName}' ${varietyCondition}
        AND market ILIKE '${marketName}'
      ORDER BY marketwiseapmcpricedate DESC 
      LIMIT 28
    `;

    const graphResult = await query(req.dbName, graphSql, []);

    // Get prediction data (if available)
    const predictionSql = `
      SELECT * FROM prediction_data_files 
      WHERE commodity ILIKE '${commodityName}' AND market ILIKE '${marketName}'
      ORDER BY id DESC 
      LIMIT 1
    `;

    const predictionResult = await query(req.dbName, predictionSql, []);

    const response = {
      data: graphResult.rows.reverse(),
      days_data: recentResult.rows,
      graph_array: [],
      cost_array: [],
      graph_image: predictionResult.rows[0]?.graph_file_name || ''
    };

    sendSuccess(res, 'Listed_Successfully', response);
  } catch (error) {
    logger.error('Get commodity details error', { error: error.message });
    sendError(res, 'Error_Retrieving_Data', 500);
  }
};

module.exports = {
  getNearbyMarket,
  getNearbyMarketAllData,
  getMarkets,
  getSellerMarkets,
  getCommodityDetails
};