import { Router } from "express";

import { notificationController } from "./controller.js";
import { authenticate } from "../../middlewares/auth.js";
 

const router = Router();

router.use(authenticate);

router.get("/", (req, res) =>
  notificationController.getNotifications(req, res),
);

router.get("/unread-count", (req, res) =>
  notificationController.getUnreadCount(req, res),
);

router.patch("/:notificationId/read", (req, res) =>
  notificationController.markAsRead(req, res),
);

router.patch("/read-all", (req, res) =>
  notificationController.markAllAsRead(req, res),
);

router.delete("/:notificationId", (req, res) =>
  notificationController.deleteNotification(req, res),
);

router.delete("/", (req, res) =>
  notificationController.deleteAllNotifications(req, res),
);

export default router;
