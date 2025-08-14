const pool = require("../../config/db");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Email topilmadi" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ message: "Parol noto‘g‘ri" });
        }
        
        res.json({ message: "Login muvaffaqiyatli"});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Serverda xatolik" });
    }
};
