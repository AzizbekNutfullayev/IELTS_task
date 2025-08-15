const pool = require("../../config/db");


exports.delate = async (req, res) => {
  try {
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const result = await pool.query(
      "DELETE FROM questions WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted", deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
