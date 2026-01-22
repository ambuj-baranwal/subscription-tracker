import { User } from "../config/prisma.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findMany();
  if (users.length === 0) {
    throw new ApiError("No users found.");
  }

  return res.status(200).json(new ApiResponse(200, users));
});

const createUser = asyncHandler(async (req, res) => {
  // const user = await
});

const getUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findUnique({
    where: { username: username },
    omit: { password: true },
  });
  // if (!user) {return res.status(404).json({error: "User not found"}) }
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user));
});

const updateUser = asyncHandler(async (req, res) => {
  let { username, email, fullName } = req.body;

  const user = await User.update({
    where: { id: req.user.id },
    data: {
      username: username,
      email: email,
      fullName: fullName,
    },
  });

  if (!user) {
    throw new ApiError(404, "Failed to update user");
  }

  return res.status(200).json(new ApiResponse(200, user));
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.delete({
    where: { id: req.user.id },
  });

  res.status(204).json(new ApiResponse(204, {}, "User Deleted Successfully"));
});

export { getUsers, getUser, createUser, deleteUser };
