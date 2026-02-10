const db = require('../config/database');
const crypto = require('crypto');

// Start call meeting
exports.startCallMeeting = async (req, res) => {
  try {
    const { user_id, farmer_id, lead_id } = req.body;

    if (!user_id || !farmer_id) {
      return res.json({ success: 0, message: 'Missing parameters' });
    }

    const today = new Date().toISOString().split('T')[0];
    const checkSql = `
      SELECT * FROM emeeting
      WHERE partner_id = $1 AND farmer_id = $2
        AND (meeting_status_id = 1 OR meeting_status_id = 2)
        AND DATE(created_on) = $3
      ORDER BY id ASC LIMIT 1
    `;

    const existing = await db.query(req.dbName, checkSql, [user_id, farmer_id, today]);

    let meeting_link;
    if (existing.rows.length > 0) {
      meeting_link = existing.rows[0].meeting_link_id;
    } else {
      meeting_link = crypto.createHash('md5').update(`${Date.now()}${farmer_id}${user_id}`).digest('hex');

      const insertSql = `
        INSERT INTO emeeting (farmer_id, partner_id, meeting_status_id, meeting_started_from, meeting_link_id, lead_id, is_active, created_on)
        VALUES ($1, $2, 1, 2, $3, $4, true, NOW())
      `;
      await db.query(req.dbName, insertSql, [farmer_id, user_id, meeting_link, lead_id]);
    }

    res.json({
      success: 1,
      data: { meeting_link, farmer_id, partner_id: user_id },
      message: 'Call initiated'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Disconnect call
exports.disconnectCall = async (req, res) => {
  try {
    const { partner_id, farmer_id, meeting_link, call_status_flag = 4 } = req.body;

    if (!meeting_link) {
      return res.json({ success: 0, message: 'Meeting link required' });
    }

    const meetingSql = `SELECT created_on FROM emeeting WHERE meeting_link_id = $1 ORDER BY id DESC LIMIT 1`;
    const meeting = await db.query(req.dbName, meetingSql, [meeting_link]);

    let call_duration = '0 mins';
    let call_duration_sec = 0;

    if (meeting.rows.length > 0) {
      const start = new Date(meeting.rows[0].created_on);
      const end = new Date();
      call_duration_sec = Math.floor((end - start) / 1000);
      const mins = Math.floor(call_duration_sec / 60);
      const secs = call_duration_sec % 60;
      call_duration = `${mins} mins ${secs} sec`;
    }

    const updateSql = `
      UPDATE emeeting
      SET meeting_status_id = $1, meeting_end_from = 2, updated_on = NOW(),
          call_duration = $2, call_duration_sec = $3
      WHERE farmer_id = $4 AND partner_id = $5 AND meeting_link_id = $6
    `;

    await db.query(req.dbName, updateSql, [
      call_status_flag, call_duration, call_duration_sec, farmer_id, partner_id, meeting_link
    ]);

    res.json({
      success: 1,
      message: 'Call disconnected'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Accept call
exports.acceptCall = async (req, res) => {
  try {
    const { partner_id, farmer_id, meeting_link } = req.body;

    if (!meeting_link) {
      return res.json({ success: 0, message: 'Meeting link required' });
    }

    const updateSql = `
      UPDATE emeeting
      SET meeting_status_id = 2, accept_call_time = NOW()
      WHERE farmer_id = $1 AND partner_id = $2 AND meeting_link_id = $3
    `;

    await db.query(req.dbName, updateSql, [farmer_id, partner_id, meeting_link]);

    res.json({
      success: 1,
      message: 'Call accepted'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Get booked slots
exports.getBookedSlots = async (req, res) => {
  try {
    const { partner_id, crop_id, schedule_call_status } = req.body;

    if (!partner_id) {
      return res.json({ status: 0, message: 'Partner ID required' });
    }

    let sql = `
      SELECT pl.id, pl.client_id, pl.partner_id, pl.call_schedule_date, pl.call_schedule_time,
             pl.schedule_call_status, pl.crop_id, pl.created_on,
             c.first_name, c.last_name, c.phone, c.is_online, c.profile_image,
             cr.name, cr.name_mr
      FROM product_leads pl
      JOIN client c ON c.id = pl.client_id
      LEFT JOIN crop cr ON cr.crop_id = pl.crop_id
      WHERE pl.is_deleted = false AND pl.product_type = 'video_call_schedule'
        AND pl.partner_id = $1
    `;

    const params = [partner_id];
    if (crop_id) {
      sql += ` AND pl.crop_id = $2`;
      params.push(crop_id);
    }

    sql += ` ORDER BY pl.id DESC`;

    const result = await db.query(req.dbName, sql, params);

    res.json({
      status: 1,
      data: result.rows,
      message: result.rows.length > 0 ? 'Booked time slots' : 'No slots available'
    });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

// Get call history
exports.getCallHistory = async (req, res) => {
  try {
    const { partner_id } = req.params;

    if (!partner_id) {
      return res.json({ success: 0, message: 'Partner ID required' });
    }

    const sql = `
      SELECT e.*, c.first_name, c.last_name, c.phone
      FROM emeeting e
      LEFT JOIN client c ON c.id = e.farmer_id
      WHERE e.partner_id = $1 AND e.meeting_status_id = 4
      ORDER BY e.created_on DESC
      LIMIT 50
    `;

    const result = await db.query(req.dbName, sql, [partner_id]);

    res.json({
      success: 1,
      data: result.rows,
      message: 'Call history retrieved'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

module.exports = exports;
