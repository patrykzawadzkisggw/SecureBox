const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  getUserById,
  getUserByLoginAndPassword,
  createUser,
  updateUser,
  getUserByLogin,
} = require("../config/db/queries/users");
const {
  getLoginEntriesByUserId,
  createLoginEntry,
} = require("../config/db/queries/loginEntry");
const {
  getTrustedDevicesByUserId,
  upsertTrustedDevice,
  deleteTrustedDevice,
} = require("../config/db/queries/trustedDevice");
const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const fs = require("fs").promises;
const path = require("path");

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      first_name: firstName,
      last_name: lastName,
      login,
      password,
    } = req.body;
    const existingUser = await getUserByLogin(login);
    if (existingUser.length > 0)
      throw new CustomError("Login already exists", 400);
    const id = await createUser({ firstName, lastName, login, password });
    await fs.mkdir(path.join("files", id), { recursive: true });
    res.status(201).json({ id, firstName, lastName, login });
  })
);

router.patch(
  "/:user_id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id: userId } = req.params;

    if (userId !== req.user.id) throw new CustomError("Forbidden", 403);
    const {
      first_name: firstName,
      last_name: lastName,
      login,
      password,
    } = req.body;
    if (!firstName && !lastName && !login && !password)
      throw new CustomError("No fields to update", 400);
    await updateUser(userId, { firstName, lastName, login, password });
    const [user] = await getUserById(userId);
    if (!user) throw new CustomError("User not found", 404);
    res.json({
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      login: user.login,
    });
  })
);
router.get(
  "/:user_id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id: userId } = req.params;
    if (userId !== req.user.id) throw new CustomError("Forbidden", 403);
    const [user] = await getUserById(userId);
    if (!user) throw new CustomError("User not found", 404);
    res.json({
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      login: user.login,
    });
  })
);

router.get("/me/get", authenticateToken, (req, res) => {
  res.json(req.user);
});

router.get(
  "/:user_id/logins",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id: userId } = req.params;
    if (userId !== req.user.id) throw new CustomError("Forbidden", 403);
    const [user] = await getUserById(userId);
    if (!user) throw new CustomError("User not found", 404);
    const loginEntries = await getLoginEntriesByUserId(userId);
    res.json(loginEntries);
  })
);
// check if login is already created
router.post(
  "/:user_id/logins",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id: userId } = req.params;
    if (userId !== req.user.id) throw new CustomError("Forbidden", 403);
    const { login, page } = req.body;
    const result = await createLoginEntry({ userId, login, page });
    return res.status(201).json(result);
  })
);

router.get(
  "/:user_id/trusted-devices",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id: userId } = req.params;
    if (userId !== req.user.id) throw new CustomError("Forbidden", 403);
    const devices = await getTrustedDevicesByUserId(userId);
    res.json(devices.map((d) => ({ ...d, is_trusted: !!d.is_trusted })));
  })
);

router.patch(
  "/:user_id/trusted-devices",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id: userId } = req.params;
    const {
      device_id: deviceId,
      user_agent: userAgent,
      is_trusted: isTrusted,
    } = req.body;
    if (userId !== req.user.id) throw new CustomError("Forbidden", 403);
    await upsertTrustedDevice({ userId, deviceId, userAgent, isTrusted });
    res.json({ userId, deviceId, userAgent, isTrusted });
  })
);

router.delete(
  "/:user_id/trusted-devices/:device_id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id: userId, device_id: deviceId } = req.params;
    if (userId !== req.user.id) throw new CustomError("Forbidden", 403);
    const result = await deleteTrustedDevice({ userId, deviceId });
    if (!result) throw new CustomError("Device not found", 404);
    res.json({ message: `Device ${deviceId} removed from trusted devices` });
  })
);

module.exports = router;
