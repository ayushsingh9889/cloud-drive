const { query } = require('../config/database');
const asyncHandler = require('../utils/asyncHandler');

const searchItems = asyncHandler(async (req, res) => {
    const { q } = req.query;
    const userId = req.user.id;

    if (!q || q.trim() === '') {
        return res.json({
            success: true,
            data: { files: [], folders: [] }
        });
    }

    const searchTerm = '%' + q.trim() + '%';

    const folders = await query(
        'SELECT * FROM folders WHERE owner_id =  AND is_deleted = false AND name ILIKE  ORDER BY created_at DESC LIMIT 20',
        [userId, searchTerm]
    );

    const files = await query(
        'SELECT * FROM files WHERE owner_id =  AND is_deleted = false AND name ILIKE  ORDER BY created_at DESC LIMIT 20',
        [userId, searchTerm]
    );

    res.json({
        success: true,
        data: {
            files: files.rows,
            folders: folders.rows
        }
    });
});

module.exports = { searchItems };
