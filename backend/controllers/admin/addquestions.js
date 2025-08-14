const pool = require("../../config/db");

exports.addquestions = async (req, res) => {
  try {
    const { body, admin_id, options } = req.body;

    if (!body || !admin_id || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ message: "Hamma maydonni to‘ldiring" });
    }

    const questionResult = await pool.query(
      `INSERT INTO questions (body, created_by) VALUES ($1, $2) RETURNING *`,
      [body, admin_id]
    );

    const question = questionResult.rows[0];

    for (let opt of options) {
      if (!opt.label || !opt.body) {
        return res.status(400).json({ message: "Barcha optionlarda label va body bo‘lishi kerak" });
      }

      await pool.query(
        `INSERT INTO options (question_id, label, body, is_correct) VALUES ($1, $2, $3, $4)`,
        [question.id, opt.label, opt.body, opt.is_correct || false]
      );
    }

    res.status(201).json({
      message: "Savol va variantlar muvaffaqiyatli qo‘shildi",
      question_id: question.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Serverda xatolik" });
  }
};
