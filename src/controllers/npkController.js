const { query } = require('../config/database');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

const getCropNPK = async (req, res) => {
  try {
    const { crop_id = 1, n = 120, p = 100, k = 120, size = 1, unit = 'hectare' } = req.params;
    
    // Get crop details
    const cropSql = `
      SELECT name, name_mr, nitrogen, phosphorus, potassium 
      FROM crop 
      WHERE crop_id = $1 
      LIMIT 1
    `;
    
    const cropResult = await query(req.dbName, cropSql, [crop_id]);
    
    if (cropResult.rows.length === 0) {
      return sendError(res, 'Crop_Not_Found', 404);
    }

    const cropData = cropResult.rows[0];
    
    // Price array for fertilizers
    const priceArray = {
      dap: 1200,
      urea: 276,
      mop: 980,
      ssp: 420,
      bensulf: 1250
    };

    // Conversion factors
    const ureaFactor = 2.17;
    const dapNFactor = 0.18;
    const dapPFactor = 2.2;
    const mopFactor = 1.66;
    const sspFactor = 6.25;

    // Required NPK values
    let requiredN = parseInt(n) || 120;
    let requiredP = parseInt(p) || 100;
    let requiredK = parseInt(k) || 120;
    const requiredS = 30;

    // Use crop-specific values if defaults are used
    if (n == 120 && p == 100 && k == 120 && cropData.nitrogen) {
      requiredN = cropData.nitrogen;
      requiredP = cropData.phosphorus;
      requiredK = cropData.potassium;
    }

    // Convert area to hectares
    let hectares = parseFloat(size);
    if (unit.toLowerCase() === 'acre') {
      hectares = 0.404686 * parseFloat(size);
    }

    // Calculate fertilizer requirements
    const calculations = [];

    // Combination 1: Urea + DAP + MOP
    const estimatedDAP = requiredP * dapPFactor;
    const nInDAP = estimatedDAP * dapNFactor;
    const remainingN = requiredN - nInDAP;
    const estimatedUrea = remainingN * ureaFactor * hectares;
    const estimatedMOP = requiredK * mopFactor * hectares;
    const estimatedBensulf = requiredS * hectares;

    const udmCost = calculateFertilizerCost({
      urea: Math.round(estimatedUrea),
      dap: Math.round(estimatedDAP),
      mop: Math.round(estimatedMOP),
      bensulf: Math.round(estimatedBensulf)
    }, priceArray);

    calculations.push({
      combination: 'Urea + DAP + MOP',
      fertilizers: {
        urea: `${Math.round(estimatedUrea)} Kg`,
        dap: `${Math.round(estimatedDAP)} Kg`,
        mop: `${Math.round(estimatedMOP)} Kg`,
        bensulf: `${Math.round(estimatedBensulf)} Kg`
      },
      cost: udmCost,
      total: `₹ ${udmCost.total.toLocaleString()}`
    });

    // Combination 2: Urea + SSP + MOP
    const estimatedUrea2 = requiredN * ureaFactor * hectares;
    const estimatedSSP = requiredP * sspFactor * hectares;
    const estimatedMOP2 = requiredK * mopFactor * hectares;

    const usmCost = calculateFertilizerCost({
      urea: Math.round(estimatedUrea2),
      ssp: Math.round(estimatedSSP),
      mop: Math.round(estimatedMOP2),
      bensulf: Math.round(estimatedBensulf)
    }, priceArray);

    calculations.push({
      combination: 'Urea + SSP + MOP',
      fertilizers: {
        urea: `${Math.round(estimatedUrea2)} Kg`,
        ssp: `${Math.round(estimatedSSP)} Kg`,
        mop: `${Math.round(estimatedMOP2)} Kg`,
        bensulf: `${Math.round(estimatedBensulf)} Kg`
      },
      cost: usmCost,
      total: `₹ ${usmCost.total.toLocaleString()}`
    });

    // Add complex fertilizer combinations
    const complexFertilizers = [
      { n: 15, p: 15, k: 15 },
      { n: 16, p: 16, k: 16 },
      { n: 17, p: 17, k: 17 },
      { n: 10, p: 26, k: 26 },
      { n: 20, p: 20, k: 0 }
    ];

    complexFertilizers.forEach(complex => {
      const complexCalc = calculateComplexFertilizer(complex, {
        n: requiredN,
        p: requiredP,
        k: requiredK
      }, hectares, priceArray);
      calculations.push(complexCalc);
    });

    const response = {
      crop_data: cropData,
      required_npk: `${requiredN}:${requiredP}:${requiredK}`,
      unit_size: `For ${size} ${unit}`,
      npk_values: calculations
    };

    sendSuccess(res, 'NPK_Calculated_Successfully', response);
  } catch (error) {
    logger.error('Get crop NPK error', { error: error.message });
    sendError(res, 'Error_Calculating_NPK', 500);
  }
};

const getCropNPKDetails = async (req, res) => {
  try {
    const { crop_id, n, p, k, s, size, unit, season } = req.body;
    
    // Get crop details
    const cropSql = `
      SELECT name, name_mr, nitrogen, phosphorus, potassium 
      FROM crop 
      WHERE crop_id = $1 
      LIMIT 1
    `;
    
    const cropResult = await query(req.dbName, cropSql, [crop_id]);
    
    if (cropResult.rows.length === 0) {
      return sendError(res, 'Crop_Not_Found', 404);
    }

    const cropData = cropResult.rows[0];
    
    // Convert area to hectares
    let hectares = parseFloat(size) || 1;
    if (unit && unit.toLowerCase() === 'acre') {
      hectares = 0.404686 * parseFloat(size);
    }

    const requiredN = (parseInt(n) || 100) * hectares;
    const requiredP = (parseInt(p) || 50) * hectares;
    const requiredK = (parseInt(k) || 50) * hectares;
    const requiredS = (parseInt(s) || 30) * hectares;

    // Execute NPK calculations using helper function
    const calculations = executeNPKCalculations({
      n: requiredN,
      p: requiredP,
      k: requiredK,
      s: requiredS,
      crop_name: cropData.name,
      crop_id,
      season: season || 'Kharif',
      size: size || 1,
      unit: unit || 'hectare',
      lang: req.headers.lang || 'en'
    });

    const requiredNPK = crop_id == 2 ? 
      `NPKS List: ${requiredN}:${requiredP}:${requiredK}:${requiredS}` :
      `NPK List: ${requiredN}:${requiredP}:${requiredK}`;

    const response = {
      crop_data: cropData,
      required_npk: requiredNPK,
      unit_size: `For ${hectares} ${unit}`,
      npk_values: calculations
    };

    sendSuccess(res, 'NPK_Details_Retrieved', response);
  } catch (error) {
    logger.error('Get crop NPK details error', { error: error.message });
    sendError(res, 'Error_Retrieving_NPK_Details', 500);
  }
};

// Helper function to calculate fertilizer cost
function calculateFertilizerCost(fertilizers, priceArray) {
  const bagSize = 50; // kg per bag
  let totalCost = 0;
  const details = {};

  Object.keys(fertilizers).forEach(fertilizer => {
    const quantity = fertilizers[fertilizer];
    const bags = Math.ceil(quantity / bagSize);
    const pricePerBag = priceArray[fertilizer] || 0;
    const cost = bags * pricePerBag;
    
    details[fertilizer] = {
      quantity: `${quantity} Kg`,
      bags,
      price_per_bag: pricePerBag,
      total_cost: cost
    };
    
    totalCost += cost;
  });

  return { ...details, total: totalCost };
}

// Helper function to calculate complex fertilizer requirements
function calculateComplexFertilizer(complex, required, hectares, priceArray) {
  const { n: complexN, p: complexP, k: complexK } = complex;
  const { n: reqN, p: reqP, k: reqK } = required;
  
  // Calculate complex fertilizer requirement based on limiting nutrient
  const nRatio = reqN / complexN;
  const pRatio = reqP / complexP;
  const kRatio = complexK > 0 ? reqK / complexK : 0;
  
  const complexRequired = Math.max(nRatio, pRatio, kRatio) * hectares;
  const complexName = `${complexN}:${complexP}:${complexK}`;
  
  const cost = calculateFertilizerCost({
    [`complex_${complexName}`]: Math.round(complexRequired)
  }, { [`complex_${complexName}`]: 1000 }); // Default price

  return {
    combination: `Complex ${complexName}`,
    fertilizers: {
      [`complex_${complexName}`]: `${Math.round(complexRequired)} Kg`
    },
    cost,
    total: `₹ ${cost.total.toLocaleString()}`
  };
}

// Helper function for NPK calculations (simplified version)
function executeNPKCalculations(data) {
  // This would contain the complex NPK calculation logic
  // For now, returning a simplified structure
  return [
    {
      fertilizer_type: 'Simple Fertilizers',
      combinations: [
        { name: 'Urea + DAP + MOP', cost: '₹ 5,000' },
        { name: 'Urea + SSP + MOP', cost: '₹ 4,500' }
      ]
    },
    {
      fertilizer_type: 'Complex Fertilizers',
      combinations: [
        { name: '15:15:15', cost: '₹ 6,000' },
        { name: '16:16:16', cost: '₹ 6,200' }
      ]
    }
  ];
}

module.exports = {
  getCropNPK,
  getCropNPKDetails
};