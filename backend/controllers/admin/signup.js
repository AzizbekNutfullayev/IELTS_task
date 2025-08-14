const pool = require("../../config/db");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  try {
    const { full_name, email, password_hash, role } = req.body;

    if (!full_name || !email || !password_hash || !role) {
        return res.status(400).json({ message: "Hamma maydonni to‘liq to‘ldiring" });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Bu email allaqachon mavjud" });
    }

    const hash = await bcrypt.hash(password_hash, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
           VALUES ($1, $2, $3, $4)
           RETURNING id, full_name, email, role`,
      [full_name, email, hash, role]
    );

    res
      .status(201)
      .json({ message: `${role} yaratildi`, user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Serverda xatolik" });
  }
};
