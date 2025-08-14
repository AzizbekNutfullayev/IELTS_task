const pool = require('../../config/db')

exports.viewquestions = async (req, res) => {
    try {
        const questions = await pool.query(`
          SELECT q.id AS question_id, q.body AS question_body,
                 json_agg(json_build_object('id', o.id, 'label', o.label, 'body', o.body)) AS options
          FROM questions q
          LEFT JOIN options o ON o.question_id = q.id
          GROUP BY q.id
        `);
    
        res.json(questions.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
}