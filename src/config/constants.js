module.exports = {
  CLIENT_TYPE: {
    BUYER: 1,
    SELLER: 2
  },
  
  PROD_DETAILS: [
    { id: 1, title: 'Product', map_key: 'product' },
    { id: 2, title: 'Produce', map_key: 'produce' }
  ],
  
  PROD_PAYMENT: [
    { id: 30, title: 30 },
    { id: 50, title: 50 },
    { id: 100, title: 100 },
    { id: 'payment_after_delivery', title: 'Payment after delivery' }
  ],
  
  PROD_CAT: [
    { id: 1, title: 'Raw Product', map_key: 'raw_product', days: 7 },
    { id: 2, title: 'Upcoming Product', map_key: 'pre_processed_product', days: 8 },
    { id: 3, title: 'Processed Product', map_key: 'processed_product', days: 30 }
  ],
  
  PROD_UNIT: [
    { id: 1, title: 'KG', map_key: 'kg', short_title: 'KG' },
    { id: 2, title: 'Tonn', map_key: 'tonn', short_title: 'T' },
    { id: 3, title: 'Quintal', map_key: 'quintal', short_title: 'Q' }
  ],
  
  TRADE_STATUS_LIST: [
    { id: 1, title: 'Pending', statusClass: 'yellow-status' },
    { id: 2, title: 'Rejected', statusClass: 'red-status' },
    { id: 3, title: 'Live', statusClass: 'green-status' },
    { id: 4, title: 'Sold', statusClass: 'blue-status' },
    { id: 5, title: 'Completed', statusClass: 'green-status' },
    { id: 6, title: 'Expired', statusClass: 'gray-status' },
    { id: 7, title: 'Self Sold', statusClass: 'purple-status' },
    { id: 8, title: 'Draft', statusClass: 'gray-status' },
    { id: 9, title: 'Bid Locked', statusClass: 'orange-status' }
  ],
  
  SEASON_LIST: [
    { id: 1, title: 'Kharif', map_key: 'kharif' },
    { id: 2, title: 'Late Kharif', map_key: 'late_kharif' },
    { id: 3, title: 'Rabi', map_key: 'rabi' }
  ],
  
  STEP_LIST: {
    REGISTRATION: 1,
    PROFILE: 2,
    FARM_DETAILS: 3,
    BANK_DETAILS: 4,
    DOCUMENTS: 5
  }
};
