const db = require('../config/database');
const crypto = require('crypto');

exports.getCropList = async (req, res) => {
  try {
    const lang = req.headers.lang || 'en';
    const [varieties] = await db.query(
      'SELECT DISTINCT crop_id FROM crop_variety_master WHERE is_deleted = false AND is_active = true'
    );
    const cropIds = varieties.map(v => v.crop_id);
    
    if (cropIds.length === 0) {
      return res.json({ success: 1, data: [], error: 0, status: 1 });
    }

    const [crops] = await db.query(
      `SELECT crop_id, lang_json->>'${lang}' as name FROM crop 
       WHERE is_deleted = false AND is_active = true AND crop_id IN (?)`,
      [cropIds]
    );
    res.json({ success: 1, data: crops, error: 0, status: 1 });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 0, message: error.message });
  }
};

exports.getCropVariety = async (req, res) => {
  try {
    const { crop_id } = req.params;
    const lang = req.headers.lang || 'en';
    const [rows] = await db.query(
      `SELECT crop_variety_id, variety_lang_json->>'${lang}' as name, name_mr, crop_id 
       FROM crop_variety_master WHERE is_deleted = false AND is_active = true AND crop_id = ?`,
      [crop_id]
    );
    res.json({ success: 1, data: rows, error: 0, status: 1 });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 0, message: error.message });
  }
};

exports.getCropVarietyPrice = async (req, res) => {
  try {
    const { crop_id, crop_variety_id } = req.body;
    if (!crop_id || !crop_variety_id) {
      return res.json({ success: 0, data: req.body, msg: 'params missing', error: 1, status: 0 });
    }

    const [rows] = await db.query(
      `SELECT market_date, crop_variety_id, product_price, unit, crop_id 
       FROM crop_price_master WHERE is_deleted = false AND is_active = true 
       AND crop_variety_id = ? AND crop_id = ? ORDER BY crop_price_id DESC LIMIT 1`,
      [crop_variety_id, crop_id]
    );
    res.json({ success: 1, data: rows, error: 0, status: 1 });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 0, message: error.message });
  }
};

exports.addCropProduct = async (req, res) => {
  try {
    const { crop_id, crop_variety_id, farmer_id, prod_desc, market_id } = req.body;
    
    const insert = {
      crop_id, crop_variety_id, farmer_id, prod_desc, market_id,
      product_status: 0,
      product_add_date: new Date(),
      created_on: new Date()
    };

    if (req.files?.crop_img1) {
      const ext = req.files.crop_img1.name.split('.').pop();
      insert.crop_img1 = `crop_prod_image_one${Date.now()}.${ext}`;
    }
    if (req.files?.crop_img2) {
      const ext = req.files.crop_img2.name.split('.').pop();
      insert.crop_img2 = `crop_prod_image_two${Date.now()}.${ext}`;
    }

    const [result] = await db.query('INSERT INTO crop_product SET ?', insert);
    res.json({ success: 1, error: 0, status: 1, data: result, message: 'Product added Successfully' });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 1, message: error.message });
  }
};

exports.getFarmerProducts = async (req, res) => {
  try {
    const { farmer_id } = req.params;
    const [rows] = await db.query(
      `SELECT p.*, c.crop_id, c.name, c.name_mr, c.logo as mob_icon, 
       ct.name_en as crop_variety_name, ct.name_mr as crop_variety_name_mr,
       m.name as market_name, m.name_mr as market_name_mr 
       FROM crop_product p 
       LEFT JOIN crop c ON c.crop_id = p.crop_id 
       LEFT JOIN crop_variety_master ct ON ct.crop_variety_id = p.crop_variety_id 
       LEFT JOIN market_master m ON m.market_id = p.market_id 
       WHERE p.is_deleted = false AND p.farmer_id = ? AND c.is_deleted = false 
       ORDER BY p.id DESC`,
      [farmer_id]
    );
    res.json({ success: 1, error: 0, status: 1, data: rows, message: 'Farmer Products listing' });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 1, message: error.message });
  }
};

exports.getFarmerProductDetail = async (req, res) => {
  try {
    const { crop_product_id } = req.params;
    const [rows] = await db.query(
      `SELECT p.*, c.crop_id, c.name, c.name_mr, c.logo as mob_icon,
       ct.name_en as crop_variety_name, ct.name_mr as crop_variety_name_mr,
       m.name as market_name, m.name_mr as market_name_mr 
       FROM crop_product p 
       LEFT JOIN crop c ON c.crop_id = p.crop_id 
       LEFT JOIN crop_variety_master ct ON ct.crop_variety_id = p.crop_variety_id 
       LEFT JOIN market_master m ON m.market_id = p.market_id 
       WHERE p.is_deleted = false AND p.id = ? AND c.is_deleted = false`,
      [crop_product_id]
    );
    res.json({ success: 1, error: 0, status: 1, data: rows[0] || {}, message: 'Farmer Product detail' });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 1, message: error.message });
  }
};

exports.updateCropProductStatus = async (req, res) => {
  try {
    const { id, product_status } = req.body;
    if (!id || product_status === undefined) {
      return res.json({ success: 0, error: 1, status: 1, message: 'Missing parameters' });
    }

    await db.query('UPDATE crop_product SET product_status = ? WHERE id = ?', [product_status, id]);
    res.json({ success: 1, error: 0, status: 1, message: 'Product Status Updated Successfully' });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 1, message: error.message });
  }
};

exports.getFarmerProductInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT p.*, c.crop_id, c.name, c.name_mr, c.logo as mob_icon,
       ct.name_en as crop_variety_name, ct.name_mr as crop_variety_name_mr,
       m.name as market_name, m.name_mr as market_name_mr 
       FROM crop_product p 
       LEFT JOIN crop c ON c.crop_id = p.crop_id 
       LEFT JOIN crop_variety_master ct ON ct.crop_variety_id = p.crop_variety_id 
       LEFT JOIN market_master m ON m.market_id = p.market_id 
       WHERE p.is_deleted = false AND p.id = ? AND c.is_deleted = false`,
      [id]
    );
    res.json({ success: 1, error: 0, status: 1, data: rows, message: 'Farmer Product invoice' });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 1, message: error.message });
  }
};

exports.getProductInvoiceList = async (req, res) => {
  try {
    const { farmer_id } = req.params;
    const [rows] = await db.query(
      `SELECT p.*, c.crop_id, c.name, c.name_mr, c.logo as mob_icon,
       ct.name_en as crop_variety_name, ct.name_mr as crop_variety_name_mr,
       m.name as market_name, m.name_mr as market_name_mr 
       FROM crop_product p 
       LEFT JOIN crop c ON c.crop_id = p.crop_id 
       LEFT JOIN crop_variety_master ct ON ct.crop_variety_id = p.crop_variety_id 
       LEFT JOIN market_master m ON m.market_id = p.market_id 
       WHERE p.is_deleted = false AND p.invoice_number != '' AND p.invoice_file != '' 
       AND p.farmer_id = ? AND c.is_deleted = false`,
      [farmer_id]
    );
    res.json({ success: 1, error: 0, status: 1, data: rows, message: 'Farmer Invoice Products listing' });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 1, message: error.message });
  }
};

exports.getFarmerDashboard = async (req, res) => {
  try {
    const { farmer_id } = req.params;
    
    const [total] = await db.query(
      'SELECT SUM(CAST(total_amount AS DECIMAL(10,2))) as total_payment FROM crop_product WHERE is_deleted = false AND farmer_id = ?',
      [farmer_id]
    );
    const [online] = await db.query(
      "SELECT SUM(CAST(total_amount AS DECIMAL(10,2))) as total_pay_online FROM crop_product WHERE is_deleted = false AND payment_type = 'Online' AND farmer_id = ?",
      [farmer_id]
    );
    const [cash] = await db.query(
      "SELECT SUM(CAST(total_amount AS DECIMAL(10,2))) as total_pay_cod FROM crop_product WHERE is_deleted = false AND payment_type = 'Cash' AND farmer_id = ?",
      [farmer_id]
    );
    const [paid] = await db.query(
      'SELECT SUM(CAST(payed_amount AS DECIMAL(10,2))) as payed_amount FROM crop_product WHERE is_deleted = false AND farmer_id = ?',
      [farmer_id]
    );

    const dashboard = {
      total_amount: total[0]?.total_payment || 0,
      total_due_amount: 0,
      total_paid_amount: total[0]?.total_payment || 0,
      total_paid_cash: cash[0]?.total_pay_cod || 0,
      total_paid_online: online[0]?.total_pay_online || 0
    };

    res.json({ success: 1, error: 0, status: 1, data: [dashboard], message: 'Get farmer dashboard' });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 1, message: error.message });
  }
};

exports.getMarkets = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM market_master WHERE is_active = true AND is_deleted = false'
    );
    res.json({ success: 1, error: 0, status: 1, data: rows, message: 'market data' });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 0, message: error.message });
  }
};

exports.getAboutUs = async (req, res) => {
  try {
    const result = {
      phone1: '+91 9923534591',
      phone2: '+91 9923534591',
      email: 'office@gfreshagrotech.com',
      address: '2039 A Pandit Mohalla, Garhi Village, Alipur North West Delhi India',
      about_us: 'GFresh Agrotech is the biggest marketplace for onions all over India...',
      about_us_mr: 'GFresh Agrotech ही संपूर्ण भारतातील कांद्याची सर्वात मोठी बाजारपेठ आहे...'
    };
    res.json({ success: 1, data: result, msg: 'About us', error: 0, status: 1 });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 0, message: error.message });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const { crop_product_id } = req.params;
    if (!crop_product_id) {
      return res.json({ success: 0, error: 1, status: 0, data: [], message: 'Invoice Not Generated!' });
    }
    const data = `${process.env.BASE_PATH || ''}/GeneratePdfController/index/${crop_product_id}`;
    res.json({ success: 1, error: 0, status: 1, data, message: 'Invoice Generated Successfully!' });
  } catch (error) {
    res.status(500).json({ success: 0, error: 1, status: 0, message: error.message });
  }
};
