const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "drive";

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase configuration. Check your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("✅ Supabase configured successfully");

module.exports = {
  supabase,
  bucketName,
};
