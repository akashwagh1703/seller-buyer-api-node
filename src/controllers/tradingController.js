const tradingService = require('../services/tradingService');
const { successResponse, errorResponse } = require('../utils/response');

class TradingController {
  // Get all commodities
  async getCommodities(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await tradingService.getCommodities(req.dbConfig, page, limit);
      return successResponse(res, result, 'Commodities retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get commodity by ID
  async getCommodityById(req, res) {
    try {
      const { id } = req.params;
      const result = await tradingService.getCommodityById(req.dbConfig, id);
      return successResponse(res, result, 'Commodity details retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Create new commodity listing
  async createCommodityListing(req, res) {
    try {
      const userId = req.user.id;
      const result = await tradingService.createCommodityListing(req.dbConfig, { ...req.body, user_id: userId });
      return successResponse(res, result, 'Commodity listing created successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Update commodity listing
  async updateCommodityListing(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const result = await tradingService.updateCommodityListing(req.dbConfig, id, req.body, userId);
      return successResponse(res, result, 'Commodity listing updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Delete commodity listing
  async deleteCommodityListing(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await tradingService.deleteCommodityListing(req.dbConfig, id, userId);
      return successResponse(res, null, 'Commodity listing deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get user's commodity listings
  async getUserCommodityListings(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;
      const result = await tradingService.getUserCommodityListings(req.dbConfig, userId, page, limit, status);
      return successResponse(res, result, 'User commodity listings retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Search commodities
  async searchCommodities(req, res) {
    try {
      const { query, location, category, min_price, max_price, page = 1, limit = 10 } = req.query;
      const result = await tradingService.searchCommodities(req.dbConfig, {
        query, location, category, min_price, max_price, page, limit
      });
      return successResponse(res, result, 'Commodity search completed successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get commodity categories
  async getCommodityCategories(req, res) {
    try {
      const result = await tradingService.getCommodityCategories(req.dbConfig);
      return successResponse(res, result, 'Commodity categories retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Create bid on commodity
  async createBid(req, res) {
    try {
      const userId = req.user.id;
      const result = await tradingService.createBid(req.dbConfig, { ...req.body, bidder_id: userId });
      return successResponse(res, result, 'Bid created successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get bids for commodity
  async getCommodityBids(req, res) {
    try {
      const { commodity_id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const result = await tradingService.getCommodityBids(req.dbConfig, commodity_id, page, limit);
      return successResponse(res, result, 'Commodity bids retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Accept/Reject bid
  async updateBidStatus(req, res) {
    try {
      const { bid_id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;
      const result = await tradingService.updateBidStatus(req.dbConfig, bid_id, status, userId);
      return successResponse(res, result, 'Bid status updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get user's bids
  async getUserBids(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;
      const result = await tradingService.getUserBids(req.dbConfig, userId, page, limit, status);
      return successResponse(res, result, 'User bids retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Create order
  async createOrder(req, res) {
    try {
      const userId = req.user.id;
      const result = await tradingService.createOrder(req.dbConfig, { ...req.body, buyer_id: userId });
      return successResponse(res, result, 'Order created successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get user orders
  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status, type } = req.query;
      const result = await tradingService.getUserOrders(req.dbConfig, userId, page, limit, status, type);
      return successResponse(res, result, 'User orders retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const { order_id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;
      const result = await tradingService.updateOrderStatus(req.dbConfig, order_id, status, userId);
      return successResponse(res, result, 'Order status updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get order details
  async getOrderDetails(req, res) {
    try {
      const { order_id } = req.params;
      const userId = req.user.id;
      const result = await tradingService.getOrderDetails(req.dbConfig, order_id, userId);
      return successResponse(res, result, 'Order details retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get trading statistics
  async getTradingStats(req, res) {
    try {
      const userId = req.user.id;
      const result = await tradingService.getTradingStats(req.dbConfig, userId);
      return successResponse(res, result, 'Trading statistics retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get market trends
  async getMarketTrends(req, res) {
    try {
      const { commodity_id, days = 30 } = req.query;
      const result = await tradingService.getMarketTrends(req.dbConfig, commodity_id, days);
      return successResponse(res, result, 'Market trends retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Add to watchlist
  async addToWatchlist(req, res) {
    try {
      const userId = req.user.id;
      const { commodity_id } = req.body;
      const result = await tradingService.addToWatchlist(req.dbConfig, userId, commodity_id);
      return successResponse(res, result, 'Added to watchlist successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Get user watchlist
  async getUserWatchlist(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;
      const result = await tradingService.getUserWatchlist(req.dbConfig, userId, page, limit);
      return successResponse(res, result, 'Watchlist retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Remove from watchlist
  async removeFromWatchlist(req, res) {
    try {
      const userId = req.user.id;
      const { commodity_id } = req.params;
      await tradingService.removeFromWatchlist(req.dbConfig, userId, commodity_id);
      return successResponse(res, null, 'Removed from watchlist successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = new TradingController();