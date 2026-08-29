

export const asyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (err) {
    console.error(err);

    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

  
// Har controller mein baar-baar try/catch likhna padta.