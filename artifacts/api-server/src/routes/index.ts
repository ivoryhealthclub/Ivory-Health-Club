import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import membershipPlansRouter from "./membership-plans";
import enrollmentsRouter from "./enrollments";
import bookingsRouter from "./bookings";
import blogPostsRouter from "./blog-posts";
import galleryRouter from "./gallery";
import contactRouter from "./contact";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(membershipPlansRouter);
router.use(enrollmentsRouter);
router.use(bookingsRouter);
router.use(blogPostsRouter);
router.use(galleryRouter);
router.use(contactRouter);
router.use(adminRouter);

export default router;
