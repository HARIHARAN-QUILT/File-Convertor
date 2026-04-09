const express = require('express');
const router = express.Router();

let Conversion;
try {
  Conversion = require('../models/Conversion');
} catch (e) {
  Conversion = null;
}

// GET /api/history - get recent conversions
router.get('/', async (req, res) => {
  if (!Conversion) return res.json([]);
  try {
    const history = await Conversion.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-__v');
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// DELETE /api/history/:id
router.delete('/:id', async (req, res) => {
  if (!Conversion) return res.json({ success: true });
  try {
    await Conversion.findOneAndDelete({ conversionId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

module.exports = router;
