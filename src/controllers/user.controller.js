import { createAddress, deleteUserById, getAllUsers, getUserById, updateUserAddress, updateUserById } from "../services/user.service.js";

export async function getUserController(req, res, next) {
    const id = Number(req.params.id);
  try {
    const responses = await getUserById(id);
    res.status(201).json({
      message: "User retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserController(req, res, next) {
    const id = Number(req.params.id);
  try {
    const responses = await deleteUserById(id);
    res.status(201).json({
      message: "Deleted user successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsersController(req, res, next) {

  try {
    const responses = await getAllUsers();
    res.status(201).json({
      message: "All users retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserController(req, res, next) {
    const id = Number(req.params.id);
    // const authenticatedId = req.user.id;
    
  try {
    const responses = await updateUserById(id, 81, req.body);
    res.status(201).json({
      message: "User data updated successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAddressController(req, res, next) {
    const id = Number(req.params.id);
    const addressId = Number(req.params.addressId);
    
  try {
    const responses = await updateUserAddress(id, addressId, req.body);
    res.status(201).json({
      message: "User address updated successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function createAddressController(req, res, next) {
    const userId = Number(req.params.id);
    
  try {
    const responses = await createAddress(userId, req.body);
    res.status(201).json({
      message: "User address created successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}
