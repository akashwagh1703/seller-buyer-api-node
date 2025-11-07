const { query } = require('../config/database');

const createCrop = async (dbName, cropData) => {
  const { client_id, land_id, crop, crop_type, duration_from, duration_to, area_under_cultivation, crop_name, crop_name_mr, unit, crop_image } = cropData;
  
  const sql = `INSERT INTO master_crop_details (client_id, land_id, crop, crop_type, duration_from, duration_to, area_under_cultivation, crop_name, crop_name_mr, unit, crop_image, created_on) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) 
               RETURNING *`;
  
  const result = await query(dbName, sql, [client_id, land_id, crop, crop_type, duration_from, duration_to, area_under_cultivation, crop_name, crop_name_mr, unit, crop_image]);
  return result.rows[0];
};

const updateCrop = async (dbName, cropId, cropData) => {
  const validFields = ['client_id', 'land_id', 'crop', 'crop_type', 'duration_from', 'duration_to', 'area_under_cultivation', 'crop_name', 'crop_name_mr', 'unit', 'crop_image'];
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(cropData).forEach(key => {
    if (validFields.includes(key) && cropData[key] !== undefined && cropData[key] !== null) {
      fields.push(`${key} = $${paramCount}`);
      values.push(cropData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) return null;

  values.push(cropId);
  const sql = `UPDATE master_crop_details SET ${fields.join(', ')}, created_on = NOW() WHERE id = $${paramCount} RETURNING *`;
  const result = await query(dbName, sql, values);
  return result.rows[0];
};

const getCropsByFarmer = async (dbName, clientId) => {
  const sql = 'SELECT * FROM master_crop_details WHERE client_id = $1 AND is_deleted = false ORDER BY id DESC';
  const result = await query(dbName, sql, [clientId]);
  return result.rows;
};

const getCropById = async (dbName, cropId) => {
  const sql = 'SELECT * FROM master_crop_details WHERE id = $1 AND is_deleted = false';
  const result = await query(dbName, sql, [cropId]);
  return result.rows[0];
};

const deleteCrop = async (dbName, cropId) => {
  const sql = 'UPDATE master_crop_details SET is_deleted = true WHERE id = $1 RETURNING *';
  const result = await query(dbName, sql, [cropId]);
  return result.rows[0];
};

module.exports = { createCrop, updateCrop, getCropsByFarmer, getCropById, deleteCrop };
