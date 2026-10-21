const recommendationService = require("./recommendation.service");
const asyncHandler = require("../../shared/utils/asyncHandler");

exports.getRecommendations = asyncHandler(async (req, res) => {
  const { title, brand, category } = req.body;

  const result = await recommendationService.getRecommendations({ title, brand, category });

  res.json({
    success: true,
    data: result,
  });
});
