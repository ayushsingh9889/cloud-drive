require("dotenv").config();
const app = require("./src/app");
const { pool } = require("./src/config/database");

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    // Test database connection
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();
    console.log("✅ Database connection verified");

    // Start server
    app.listen(PORT, () => {
      console.log("───────────────────────────────────────");
      console.log("🚀 Cloud Drive Backend Server");
      console.log("───────────────────────────────────────");
      console.log(`✅ Server running on: http://localhost:${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/health`);
      console.log(`✅ API base: http://localhost:${PORT}/api`);
      console.log("───────────────────────────────────────");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🔄 Closing server...");
  await pool.end();
  process.exit(0);
});

startServer();
