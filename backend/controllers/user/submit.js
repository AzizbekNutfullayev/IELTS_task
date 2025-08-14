const pool = require("../../config/db");


exports.submit = async (req, res) => {
    const client = await pool.connect();
    try {
        const { session_id, answers } = req.body;

        await client.query("BEGIN");

        let score = 0;

        for (let ans of answers) {
            await client.query(
                `INSERT INTO responses (session_id, question_id, option_id)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (session_id, question_id) 
                 DO UPDATE SET option_id = EXCLUDED.option_id, answered_at = NOW()`,
                [session_id, ans.question_id, ans.option_id]
            );

            const correctCheck = await client.query(
                `SELECT is_correct FROM options WHERE id = $1`,
                [ans.option_id]
            );

            if (correctCheck.rows[0]?.is_correct) {
                score++;
            }
        }

        await client.query("COMMIT");

        res.json({
            message: "Javoblar saqlandi",
            score
        });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ error: "Javoblarni saqlashda xatolik" });
    } finally {
        client.release();
    }
};