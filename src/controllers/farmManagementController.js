const farmManagementService = require('../services/farmManagementService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class FarmManagementController {
  // Crop Management
  async getCrops(req, res) {
    try {
      const { page = 1, limit = 10, category, season } = req.query;
      const result = await farmManagementService.getCrops(req.dbConfig, page, limit, category, season);
      return successResponse(res, result, 'Crops retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getCropById(req, res) {
    try {
      const { id } = req.params;
      const result = await farmManagementService.getCropById(req.dbConfig, id);
      return successResponse(res, result, 'Crop details retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async addCropToFarm(req, res) {
    try {
      const userId = req.user.id;
      const result = await farmManagementService.addCropToFarm(req.dbConfig, { ...req.body, user_id: userId });
      return successResponse(res, result, 'Crop added to farm successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async updateFarmCrop(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const result = await farmManagementService.updateFarmCrop(req.dbConfig, id, req.body, userId);
      return successResponse(res, result, 'Farm crop updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async deleteFarmCrop(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await farmManagementService.deleteFarmCrop(req.dbConfig, id, userId);
      return successResponse(res, null, 'Farm crop deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getFarmCrops(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status, season } = req.query;
      const result = await farmManagementService.getFarmCrops(req.dbConfig, userId, page, limit, status, season);
      return successResponse(res, result, 'Farm crops retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Farm Activities
  async addFarmActivity(req, res) {
    try {
      const userId = req.user.id;
      const result = await farmManagementService.addFarmActivity(req.dbConfig, { ...req.body, user_id: userId });
      return successResponse(res, result, 'Farm activity added successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getFarmActivities(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, activity_type, date_from, date_to } = req.query;
      const result = await farmManagementService.getFarmActivities(req.dbConfig, userId, page, limit, activity_type, date_from, date_to);
      return successResponse(res, result, 'Farm activities retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async updateFarmActivity(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const result = await farmManagementService.updateFarmActivity(req.dbConfig, id, req.body, userId);
      return successResponse(res, result, 'Farm activity updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async deleteFarmActivity(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await farmManagementService.deleteFarmActivity(req.dbConfig, id, userId);
      return successResponse(res, null, 'Farm activity deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Expense Management
  async addExpense(req, res) {
    try {
      const userId = req.user.id;
      const result = await farmManagementService.addExpense(req.dbConfig, { ...req.body, user_id: userId });
      return successResponse(res, result, 'Expense added successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getExpenses(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, category, date_from, date_to } = req.query;
      const result = await farmManagementService.getExpenses(req.dbConfig, userId, page, limit, category, date_from, date_to);
      return successResponse(res, result, 'Expenses retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async updateExpense(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const result = await farmManagementService.updateExpense(req.dbConfig, id, req.body, userId);
      return successResponse(res, result, 'Expense updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async deleteExpense(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await farmManagementService.deleteExpense(req.dbConfig, id, userId);
      return successResponse(res, null, 'Expense deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Income Management
  async addIncome(req, res) {
    try {
      const userId = req.user.id;
      const result = await farmManagementService.addIncome(req.dbConfig, { ...req.body, user_id: userId });
      return successResponse(res, result, 'Income added successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getIncomes(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, source, date_from, date_to } = req.query;
      const result = await farmManagementService.getIncomes(req.dbConfig, userId, page, limit, source, date_from, date_to);
      return successResponse(res, result, 'Incomes retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async updateIncome(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const result = await farmManagementService.updateIncome(req.dbConfig, id, req.body, userId);
      return successResponse(res, result, 'Income updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async deleteIncome(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await farmManagementService.deleteIncome(req.dbConfig, id, userId);
      return successResponse(res, null, 'Income deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Financial Reports
  async getFinancialSummary(req, res) {
    try {
      const userId = req.user.id;
      const { year, month } = req.query;
      const result = await farmManagementService.getFinancialSummary(req.dbConfig, userId, year, month);
      return successResponse(res, result, 'Financial summary retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getProfitLossReport(req, res) {
    try {
      const userId = req.user.id;
      const { date_from, date_to } = req.query;
      const result = await farmManagementService.getProfitLossReport(req.dbConfig, userId, date_from, date_to);
      return successResponse(res, result, 'Profit & Loss report retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Inventory Management
  async addInventoryItem(req, res) {
    try {
      const userId = req.user.id;
      const result = await farmManagementService.addInventoryItem(req.dbConfig, { ...req.body, user_id: userId });
      return successResponse(res, result, 'Inventory item added successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getInventory(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, category, low_stock } = req.query;
      const result = await farmManagementService.getInventory(req.dbConfig, userId, page, limit, category, low_stock);
      return successResponse(res, result, 'Inventory retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async updateInventoryItem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const result = await farmManagementService.updateInventoryItem(req.dbConfig, id, req.body, userId);
      return successResponse(res, result, 'Inventory item updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async deleteInventoryItem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await farmManagementService.deleteInventoryItem(req.dbConfig, id, userId);
      return successResponse(res, null, 'Inventory item deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  // Weather & Alerts
  async getWeatherData(req, res) {
    try {
      const { latitude, longitude } = req.query;
      const result = await farmManagementService.getWeatherData(latitude, longitude);
      return successResponse(res, result, 'Weather data retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getFarmAlerts(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, type, status } = req.query;
      const result = await farmManagementService.getFarmAlerts(req.dbConfig, userId, page, limit, type, status);
      return successResponse(res, result, 'Farm alerts retrieved successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async markAlertAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await farmManagementService.markAlertAsRead(req.dbConfig, id, userId);
      return successResponse(res, null, 'Alert marked as read successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

module.exports = new FarmManagementController();