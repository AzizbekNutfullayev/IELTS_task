const pool = require("../../config/db");

exports.updateQuestion = async (req, res) => {
  const client = await pool.connect();
  try {
    const { updateId } = req.params; // ROUTE PARAM moslashtirildi
    const { question_body, correct_answer, options } = req.body;

    if (!updateId) {
      return res.status(400).json({ message: "Question ID is required" });
    }

    await client.query("BEGIN");

    // Update question
    const questionResult = await client.query(
      `UPDATE questions 
       SET body = COALESCE($1, body), 
           correct_answer = COALESCE($2, correct_answer) 
       WHERE id = $3 RETURNING *`,
      [question_body || null, correct_answer || null, updateId]
    );

    if (questionResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Question not found" });
    }

    if (Array.isArray(options) && options.length > 0) {
      for (let opt of options) {
        await client.query(
          `UPDATE options 
           SET body = COALESCE($1, body), 
               is_correct = COALESCE($2, is_correct)
           WHERE id = $3 AND question_id = $4`,
          [opt.body || null, opt.is_correct, opt.id, updateId] 
        );
      }
    }

    await client.query("COMMIT");

    res.json({
      message: "Question and options updated successfully",
      updatedQuestion: questionResult.rows[0]
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};
