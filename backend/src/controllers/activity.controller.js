const { query } = require("../config/database");
const asyncHandler = require("../utils/asyncHandler");

const logActivity = async (
  actorId,
  action,
  resourceType,
  resourceId,
  context,
) => {
  try {
    await query(
      "INSERT INTO activities (actor_id, action, resource_type, resource_id, context) VALUES ($1, $2, $3, $4, $5)",
      [
        actorId,
        action,
        resourceType,
        resourceId,
        context ? JSON.stringify(context) : null,
      ],
    );
  } catch (error) {
    console.error("Activity log error:", error.message);
  }
};

const getActivities = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const limit = parseInt(req.query.limit) || 50;

  const result = await query(
    "SELECT * FROM activities WHERE actor_id = $1 ORDER BY created_at DESC LIMIT $2",
    [userId, limit],
  );

  res.json({
    success: true,
    data: {
      activities: result.rows,
    },
  });
});

module.exports = { logActivity, getActivities };
