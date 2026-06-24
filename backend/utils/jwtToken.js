export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
      expires: new Date(
        Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
      ),
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};