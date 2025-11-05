const { query } = require('../config/database');

const createFarm = async (dbName, farmData) => {
  const { farmer_id, survey_no, soil_type, topology, farm_type, farm_size, unit, irrigation_source, irrigation_facility, farm_name, farm_name_mr, farm_image, doc_7_12 } = farmData;
  
  const sql = `INSERT INTO master_land_details (farmer_id, survey_no, soil_type, topology, farm_type, farm_size, unit, irrigation_source, irrigation_facility, farm_name, farm_name_mr, farm_image, doc_7_12, created_on) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW()) 
               RETURNING *`;
  
  const result = await query(dbName, sql, [farmer_id, survey_no, soil_type, topology, farm_type, farm_size, unit, irrigation_source, irrigation_facility, farm_name, farm_name_mr, farm_image, doc_7_12]);
  return result.rows[0];
};

const updateFarm = async (dbName, landId, farmData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(farmData).forEach(key => {
    if (farmData[key] !== undefined && farmData[key] !== null) {
      fields.push(`${key} = $${paramCount}`);
      values.push(farmData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) return null;

  values.push(landId);
  const sql = `UPDATE master_land_details SET ${fields.join(', ')}, created_on = NOW() WHERE land_id = $${paramCount} RETURNING *`;
  const result = await query(dbName, sql, values);
  return result.rows[0];
};

const getFarmsByFarmer = async (dbName, farmerId) => {
  const sql = 'SELECT * FROM master_land_details WHERE farmer_id = $1 AND is_deleted = false ORDER BY land_id DESC';
  const result = await query(dbName, sql, [farmerId]);
  return result.rows;
};

const getFarmById = async (dbName, landId) => {
  const sql = 'SELECT * FROM master_land_details WHERE land_id = $1 AND is_deleted = false';
  const result = await query(dbName, sql, [landId]);
  return result.rows[0];
};

const deleteFarm = async (dbName, landId) => {
  const sql = 'UPDATE master_land_details SET is_deleted = true WHERE land_id = $1 RETURNING *';
  const result = await query(dbName, sql, [landId]);
  return result.rows[0];
};

module.exports = { createFarm, updateFarm, getFarmsByFarmer, getFarmById, deleteFarm };
