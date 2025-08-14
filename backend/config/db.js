require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: `postgresql://aziz:saY0tGLGjxK3beOhouZmNsbiIYM0k8jY@dpg-d2en4hvdiees7381s0sg-a.oregon-postgres.render.com/aziz_26my`,
  ssl: {
    rejectUnauthorized: false,
  },
}); 

module.exports = pool;
