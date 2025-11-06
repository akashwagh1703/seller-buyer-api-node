const tradingModel = require('../models/tradingModel');

class TradingService {
  async getCommodities(dbConfig, page, limit) {
    const offset = (page - 1) * limit;
    const commodities = await tradingModel.getCommodities(dbConfig, limit, offset);
    const total = await tradingModel.getCommoditiesCount(dbConfig);
    
    return {
      commodities,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: total.count,
        total_pages: Math.ceil(total.count / limit)
      }
    };
  }

  async getCommodityById(dbConfig, id) {
    const commodity = await tradingModel.getCommodityById(dbConfig, id);
    if (!commodity) {
      throw new Error('Commodity not found');
    }
    return commodity;
  }

  async createCommodityListing(dbConfig, data) {
    const listingId = await tradingModel.createCommodityListing(dbConfig, data);
    return { listing_id: listingId };
  }

  async updateCommodityListing(dbConfig, id, data, userId) {
    const listing = await tradingModel.getCommodityListingById(dbConfig, id);
    if (!listing || listing.user_id !== userId) {
      throw new Error('Listing not found or unauthorized');
    }
    
    await tradingModel.updateCommodityListing(dbConfig, id, data);
    return { listing_id: id };
  }

  async deleteCommodityListing(dbConfig, id, userId) {
    const listing = await tradingModel.getCommodityListingById(dbConfig, id);
    if (!listing || listing.user_id !== userId) {
      throw new Error('Listing not found or unauthorized');
    }
    
    await tradingModel.deleteCommodityListing(dbConfig, id);
  }

  async getUserCommodityListings(dbConfig, userId, page, limit, status) {
    const offset = (page - 1) * limit;
    const listings = await tradingModel.getUserCommodityListings(dbConfig, userId, limit, offset, status);
    const total = await tradingModel.getUserCommodityListingsCount(dbConfig, userId, status);
    
    return {
      listings,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: total.count,
        total_pages: Math.ceil(total.count / limit)
      }
    };
  }

  async searchCommodities(dbConfig, filters) {
    const { page, limit, ...searchFilters } = filters;
    const offset = (page - 1) * limit;
    
    const commodities = await tradingModel.searchCommodities(dbConfig, searchFilters, limit, offset);
    const total = await tradingModel.searchCommoditiesCount(dbConfig, searchFilters);
    
    return {
      commodities,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: total.count,
        total_pages: Math.ceil(total.count / limit)
      }
    };
  }

  async getCommodityCategories(dbConfig) {
    return await tradingModel.getCommodityCategories(dbConfig);
  }

  async createBid(dbConfig, data) {
    const bidId = await tradingModel.createBid(dbConfig, data);
    return { bid_id: bidId };
  }

  async getCommodityBids(dbConfig, commodityId, page, limit) {
    const offset = (page - 1) * limit;
    const bids = await tradingModel.getCommodityBids(dbConfig, commodityId, limit, offset);
    const total = await tradingModel.getCommodityBidsCount(dbConfig, commodityId);
    
    return {
      bids,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: total.count,
        total_pages: Math.ceil(total.count / limit)
      }
    };
  }

  async updateBidStatus(dbConfig, bidId, status, userId) {
    const bid = await tradingModel.getBidById(dbConfig, bidId);
    if (!bid) {
      throw new Error('Bid not found');
    }
    
    // Check if user owns the commodity listing
    const listing = await tradingModel.getCommodityListingById(dbConfig, bid.commodity_listing_id);
    if (!listing || listing.user_id !== userId) {
      throw new Error('Unauthorized to update bid status');
    }
    
    await tradingModel.updateBidStatus(dbConfig, bidId, status);
    return { bid_id: bidId, status };
  }

  async getUserBids(dbConfig, userId, page, limit, status) {
    const offset = (page - 1) * limit;
    const bids = await tradingModel.getUserBids(dbConfig, userId, limit, offset, status);
    const total = await tradingModel.getUserBidsCount(dbConfig, userId, status);
    
    return {
      bids,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: total.count,
        total_pages: Math.ceil(total.count / limit)
      }
    };
  }

  async createOrder(dbConfig, data) {
    const orderId = await tradingModel.createOrder(dbConfig, data);
    return { order_id: orderId };
  }

  async getUserOrders(dbConfig, userId, page, limit, status, type) {
    const offset = (page - 1) * limit;
    const orders = await tradingModel.getUserOrders(dbConfig, userId, limit, offset, status, type);
    const total = await tradingModel.getUserOrdersCount(dbConfig, userId, status, type);
    
    return {
      orders,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: total.count,
        total_pages: Math.ceil(total.count / limit)
      }
    };
  }

  async updateOrderStatus(dbConfig, orderId, status, userId) {
    const order = await tradingModel.getOrderById(dbConfig, orderId);
    if (!order || (order.buyer_id !== userId && order.seller_id !== userId)) {
      throw new Error('Order not found or unauthorized');
    }
    
    await tradingModel.updateOrderStatus(dbConfig, orderId, status);
    return { order_id: orderId, status };
  }

  async getOrderDetails(dbConfig, orderId, userId) {
    const order = await tradingModel.getOrderDetails(dbConfig, orderId);
    if (!order || (order.buyer_id !== userId && order.seller_id !== userId)) {
      throw new Error('Order not found or unauthorized');
    }
    
    return order;
  }

  async getTradingStats(dbConfig, userId) {
    return await tradingModel.getTradingStats(dbConfig, userId);
  }

  async getMarketTrends(dbConfig, commodityId, days) {
    return await tradingModel.getMarketTrends(dbConfig, commodityId, days);
  }

  async addToWatchlist(dbConfig, userId, commodityId) {
    const watchlistId = await tradingModel.addToWatchlist(dbConfig, userId, commodityId);
    return { watchlist_id: watchlistId };
  }

  async getUserWatchlist(dbConfig, userId, page, limit) {
    const offset = (page - 1) * limit;
    const watchlist = await tradingModel.getUserWatchlist(dbConfig, userId, limit, offset);
    const total = await tradingModel.getUserWatchlistCount(dbConfig, userId);
    
    return {
      watchlist,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: total.count,
        total_pages: Math.ceil(total.count / limit)
      }
    };
  }

  async removeFromWatchlist(dbConfig, userId, commodityId) {
    await tradingModel.removeFromWatchlist(dbConfig, userId, commodityId);
  }
}

module.exports = new TradingService();