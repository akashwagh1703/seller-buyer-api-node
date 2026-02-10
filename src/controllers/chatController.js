const db = require('../config/database');

// Get chat data
exports.getChatData = async (req, res) => {
  try {
    const { farmer_id, user_id } = req.body;

    if (!farmer_id || !user_id) {
      return res.json({ success: 0, message: 'Missing parameters' });
    }

    const sql = `
      SELECT * FROM messages
      WHERE (outgoing_msg_id = $1 OR incoming_msg_id = $1)
        AND (outgoing_msg_id = $2 OR incoming_msg_id = $2)
      ORDER BY created_on ASC
    `;

    const result = await db.query(req.dbName, sql, [farmer_id, user_id]);

    res.json({
      success: result.rows.length > 0 ? 1 : 0,
      data: result.rows,
      message: result.rows.length > 0 ? 'Chat data listed' : 'No chat available'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Add chat message
exports.addChat = async (req, res) => {
  try {
    const { farmer_id, user_id, msg } = req.body;

    if (!farmer_id || !user_id || !msg) {
      return res.json({ success: 0, message: 'Missing parameters' });
    }

    const insertSql = `
      INSERT INTO messages (msg, incoming_msg_id, outgoing_msg_id, user_type, created_on)
      VALUES ($1, $2, $3, 'partner', NOW())
      RETURNING *
    `;

    const result = await db.query(req.dbName, insertSql, [msg, user_id, farmer_id]);

    res.json({
      success: 1,
      data: result.rows[0],
      message: 'Chat added successfully'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

// Get chat list
exports.getChatList = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.json({ success: 0, message: 'User ID required' });
    }

    const sql = `
      SELECT DISTINCT ON (
        CASE 
          WHEN incoming_msg_id = $1 THEN outgoing_msg_id 
          ELSE incoming_msg_id 
        END
      )
      m.*,
      c.first_name, c.last_name, c.profile_image
      FROM messages m
      LEFT JOIN client c ON c.id = CASE 
        WHEN m.incoming_msg_id = $1 THEN m.outgoing_msg_id 
        ELSE m.incoming_msg_id 
      END
      WHERE incoming_msg_id = $1 OR outgoing_msg_id = $1
      ORDER BY 
        CASE 
          WHEN incoming_msg_id = $1 THEN outgoing_msg_id 
          ELSE incoming_msg_id 
        END,
        created_on DESC
    `;

    const result = await db.query(req.dbName, sql, [user_id]);

    res.json({
      success: 1,
      data: result.rows,
      message: 'Chat list retrieved'
    });
  } catch (error) {
    res.json({ success: 0, message: error.message });
  }
};

module.exports = exports;
