import { Router, type IRouter } from "express";
import {
  clearAdminSession,
  getAdminEmail,
  getAdminSessionEmail,
  setAdminSession,
  verifyAdminPassword,
} from "../lib/admin-auth";

const router: IRouter = Router();

router.post("/auth/admin/login", (req, res): void => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  if (
    email.toLowerCase() !== getAdminEmail().toLowerCase() ||
    !verifyAdminPassword(password)
  ) {
    res.status(401).json({ error: "Invalid admin credentials" });
    return;
  }

  setAdminSession(res, getAdminEmail());
  res.json({ authenticated: true, email: getAdminEmail() });
});

router.get("/auth/admin/session", (req, res): void => {
  const email = getAdminSessionEmail(req);
  if (!email) {
    res.status(401).json({ authenticated: false });
    return;
  }

  res.json({ authenticated: true, email });
});

router.post("/auth/admin/logout", (req, res): void => {
  clearAdminSession(res);
  res.json({ authenticated: false });
});

export default router;