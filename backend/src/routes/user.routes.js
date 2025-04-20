import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken, changeCurrentPassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { requireAuth, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();
router.route("/register").post(
    registerUser
  );
  

 router.route("/login").post(loginUser)
 //secured routes
// Example: Only admin can logout others
router.route("/logout").post(requireAuth, authorizeRoles("admin", "manager", "staff"), logoutUser);

// Example: Only staff and above can change password
router.route("/change-password").post(requireAuth, authorizeRoles("staff", "manager", "admin"), changeCurrentPassword);

 router.route("/refresh-token").post(refreshAccessToken)
    


export default router;