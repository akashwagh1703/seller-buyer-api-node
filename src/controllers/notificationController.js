const db = require('../config/database');

exports.getNotificationCount = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ status: 0, message: 'Missing Parameter' });

    const [rows] = await db.query(
      `SELECT COUNT(unt.id) AS count FROM user_notifications_table unt 
       INNER JOIN notifications_table nt ON nt.id = unt.notification_id 
       WHERE nt.map_key != 'chat_notification' AND nt.reference_id = 'client' 
       AND unt.is_read = 0 AND unt.is_notify = 0 AND unt.user_id = ?`,
      [user_id]
    );

    res.json({
      success: rows.length > 0 ? 1 : 0,
      unread_count: rows,
      message: rows.length > 0 ? 'Listed Successfully!' : 'No Record Found!'
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

exports.getNotificationData = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ status: 0, message: 'Missing Parameter' });

    const [rows] = await db.query(
      `SELECT unt.user_id, unt.notification_id, unt.is_read, nt.title, nt.message, 
       nt.created_on, nt.other_details FROM user_notifications_table unt 
       INNER JOIN notifications_table nt ON nt.id = unt.notification_id 
       WHERE nt.map_key != 'chat_notification' AND nt.reference_id = 'client' 
       AND unt.user_id = ? ORDER BY nt.created_on DESC`,
      [user_id]
    );

    const notification_data = rows.map(row => ({
      ...row,
      other_details: row.other_details ? JSON.parse(row.other_details) : null
    }));

    res.json({
      success: notification_data.length > 0 ? 1 : 0,
      notification_data,
      message: notification_data.length > 0 ? 'Listed Successfully!' : 'No Record Found!'
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
};

exports.readNotification = async (req, res) => {
  try {
    const { user_id, notification_id } = req.body;
    if (!user_id || !notification_id) {
      return res.status(400).json({ status: 0, data: [], message: 'Missing Parameter' });
    }

    const [result] = await db.query(
      'UPDATE user_notifications_table SET is_read = 1 WHERE user_id = ? AND notification_id = ?',
      [user_id, notification_id]
    );

    res.json({ success: 1, data: result, message: 'Updated Successfully' });
  } catch (error) {
    res.status(500).json({ status: 0, data: [], message: error.message });
  }
};

exports.notifyUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ status: 0, data: [], message: 'Missing Parameter' });

    const [result] = await db.query(
      'UPDATE user_notifications_table SET is_notify = 1 WHERE user_id = ? AND is_notify = 0',
      [user_id]
    );

    res.json({
      success: 1,
      data: result,
      update_count: result.affectedRows,
      message: 'Updated Successfully'
    });
  } catch (error) {
    res.status(500).json({ status: 0, data: [], message: error.message });
  }
};
