import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import membershipPlansRouter from "./membership-plans";
import enrollmentsRouter from "./enrollments";
import bookingsRouter from "./bookings";
import blogPostsRouter from "./blog-posts";
import galleryRouter from "./gallery";
import contactRouter from "./contact";
import blogCommentsRouter from "./blog-comments";
import adminRouter from "./admin";
import paymentSettingsRouter from "./payment-settings";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(membershipPlansRouter);
router.use(enrollmentsRouter);
router.use(bookingsRouter);
router.use(blogPostsRouter);
router.use(blogCommentsRouter);
router.use(galleryRouter);
router.use(contactRouter);
  router.use("/admin", adminRouter);
router.use(paymentSettingsRouter);
router.use(storageRouter);

export default router;
