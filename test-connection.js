import mysql from "mysql2/promise";

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: "mysql-198f52f6-maria-687f.b.aivencloud.com",
      user: "maria_compat",
      password: "AVNS_OhayJfBtjN_r1PIaMFZ",
      database: "defaultdb",
      port: 28405,
      ssl: { rejectUnauthorized: false } // SSL do Aiven
    });
    console.log("✅ Conectado com sucesso ao banco Aiven!");
    await connection.end();
  } catch (err) {
    console.error("❌ Erro ao conectar:", err);
  }
}

testConnection();
