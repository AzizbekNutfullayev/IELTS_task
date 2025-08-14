const pool = require("../../config/db"); 

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params; 
    const { body, correct_answer } = req.body; 

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    if (!body && !correct_answer) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const result = await pool.query(
      `UPDATE questions 
       SET body = COALESCE($1, body), 
           correct_answer = COALESCE($2, correct_answer) 
       WHERE id = $3 RETURNING *`,
      [body || null, correct_answer || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question updated", updated: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
