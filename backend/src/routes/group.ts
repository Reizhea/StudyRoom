import express from "express";
import {
  createGroup,
  deleteGroup,
  inviteUser,
  acceptInvite,
  removeMember,
  addResource,
  removeResource,
} from "../controllers/groupController";
import { authenticateToken } from "../middlewares/authenticateToken"; // Add authentication if required

const router = express.Router();

// Group Management Routes
router.post("/", authenticateToken, createGroup); // Create a new group
router.delete("/:groupId", authenticateToken, deleteGroup); // Delete a group

// Membership Management Routes
router.post("/:groupId/invite", authenticateToken, inviteUser); // Invite a user to a group
router.post("/:groupId/accept-invite", authenticateToken, acceptInvite); // Accept an invitation
router.delete("/:groupId/members/:memberId", authenticateToken, removeMember); // Remove a member from a group

// Resource Management Routes
router.post("/:groupId/resources", authenticateToken, addResource); // Add a resource to a group
router.delete("/:groupId/resources/:resourceId", authenticateToken, removeResource); // Remove a resource from a group

export default router;
