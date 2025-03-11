import mongoose from "mongoose";
import { Request, Response } from "express";
import Group from "../models/Group";

// Helper function to get the error message safely
const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "An unknown error occurred";

// Create a new group
export const createGroup = async (req: Request, res: Response): Promise<void> => {
  const { name, description, adminId } = req.body;

  try {
    const newGroup = await Group.create({
      name,
      description,
      admin: new mongoose.Types.ObjectId(adminId),
      members: [new mongoose.Types.ObjectId(adminId)],
    });

    res.status(201).json({
      message: "Group created successfully",
      group: newGroup,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create group",
      error: getErrorMessage(error),
    });
  }
};

// Delete a group
export const deleteGroup = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({
        message: "Group not found",
      });
      return;
    }

    await Group.findByIdAndDelete(groupId);

    res.status(200).json({
      message: "Group deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete group",
      error: getErrorMessage(error),
    });
  }
};

// Invite a user to the group
export const inviteUser = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({
        message: "Group not found",
      });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (group.pendingInvites.some((id) => id.equals(userObjectId))) {
      res.status(400).json({
        message: "User is already invited",
      });
      return;
    }

    group.pendingInvites.push(userObjectId);
    await group.save();

    res.status(200).json({
      message: "User invited successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to invite user",
      error: getErrorMessage(error),
    });
  }
};

// Accept a group invitation
export const acceptInvite = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({
        message: "Group not found",
      });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const inviteIndex = group.pendingInvites.findIndex((id) => id.equals(userObjectId));
    if (inviteIndex === -1) {
      res.status(400).json({
        message: "No pending invite for this user",
      });
      return;
    }

    group.pendingInvites.splice(inviteIndex, 1);
    group.members.push(userObjectId);
    await group.save();

    res.status(200).json({
      message: "User added to the group successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to accept invitation",
      error: getErrorMessage(error),
    });
  }
};

// Remove a user from the group
export const removeMember = async (req: Request, res: Response): Promise<void> => {
  const { groupId, memberId } = req.params;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({
        message: "Group not found",
      });
      return;
    }

    const memberObjectId = new mongoose.Types.ObjectId(memberId);

    if (!group.members.some((id) => id.equals(memberObjectId))) {
      res.status(400).json({
        message: "User is not a member of this group",
      });
      return;
    }

    group.members = group.members.filter((id) => !id.equals(memberObjectId));
    if (group.admin.equals(memberObjectId)) {
      group.admin = group.members[0] || null; // Assign the next member as admin or null if no members left
    }
    await group.save();

    res.status(200).json({
      message: "Member removed successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove member",
      error: getErrorMessage(error),
    });
  }
};

// Add a resource to the group
export const addResource = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;
  const { title, url, addedBy } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({
        message: "Group not found",
      });
      return;
    }

    const newResource = {
      _id: new mongoose.Types.ObjectId(),
      title,
      url,
      addedBy: new mongoose.Types.ObjectId(addedBy),
    };

    group.resources.push(newResource);
    await group.save();

    res.status(201).json({
      message: "Resource added successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add resource",
      error: getErrorMessage(error),
    });
  }
};

// Remove a resource from the group
export const removeResource = async (req: Request, res: Response): Promise<void> => {
  const { groupId, resourceId } = req.params;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({
        message: "Group not found",
      });
      return;
    }

    const resourceObjectId = new mongoose.Types.ObjectId(resourceId);

    const resourceIndex = group.resources.findIndex((resource) => resource._id.equals(resourceObjectId));

    if (resourceIndex === -1) {
      res.status(404).json({
        message: "Resource not found",
      });
      return;
    }

    group.resources.splice(resourceIndex, 1);
    await group.save();

    res.status(200).json({
      message: "Resource removed successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove resource",
      error: getErrorMessage(error),
    });
  }
};
