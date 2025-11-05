module.exports = {
  CLIENT_TYPE: {
    BUYER: 1,
    SELLER: 2
  },
  
  PROD_DETAILS: [
    { id: 1, title: 'Fresh', statusClass: 'green-status' },
    { id: 2, title: 'Processed', statusClass: 'blue-status' }
  ],
  
  PROD_CAT: [
    { id: 1, title: 'Cereals', statusClass: 'green-status' },
    { id: 2, title: 'Upcoming', statusClass: 'blue-status' },
    { id: 3, title: 'Fruits', statusClass: 'orange-status' },
    { id: 4, title: 'Vegetables', statusClass: 'yellow-status' }
  ],
  
  PROD_UNIT: [
    { id: 1, title: 'Kg', statusClass: '' },
    { id: 2, title: 'Quintal', statusClass: '' },
    { id: 3, title: 'Ton', statusClass: '' },
    { id: 4, title: 'Litre', statusClass: '' },
    { id: 5, title: 'Piece', statusClass: '' }
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
    { id: 1, title: 'Kharif', statusClass: '' },
    { id: 2, title: 'Rabi', statusClass: '' },
    { id: 3, title: 'Zaid', statusClass: '' },
    { id: 4, title: 'Summer', statusClass: '' },
    { id: 5, title: 'Winter', statusClass: '' }
  ],
  
  STEP_LIST: {
    REGISTRATION: 1,
    PROFILE: 2,
    FARM_DETAILS: 3,
    BANK_DETAILS: 4,
    DOCUMENTS: 5
  }
};
