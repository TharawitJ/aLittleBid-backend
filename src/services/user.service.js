import prisma from "../lib/prismaClient.js";
import createError from "http-errors";
import { sanitizeData } from "../utils/helpers.js";

const USER_DATA_FIELDS = [
  "username",
  "email",  
  "firstname", 
  "lastname", 
  "phone"    
];

export async function getAllUsers() {
  const result = await prisma.user.findMany();

  return result;
}

export async function getUserById(id) {
  const result = await prisma.user.findUnique({
    where: { id },
    include: { addresses: true },
  });

  return result;
}

export async function deleteUserById(id) {
  const result = await prisma.user.delete({
    where: { id },
  });

  return result;
}

export async function updateUserById(id, authenticatedId, data) {
  const user = await getUserById(id);
  if (!user) throw createError(404, "Invalid user");

  if (id !== authenticatedId) {
    throw createError(403, "Forbidden: You cannot edit other users.");
  }

  const updatedUserData = sanitizeData(data, USER_DATA_FIELDS);

   if (Object.keys(updatedUserData).length === 0) {
      throw createError(400, "No valid update fields provided");
    }

  const result = await prisma.user.update({
    where: { id: id },
    data: updatedUserData,
  });

  return result;
}

////////////////////////////////////////////////////
// ADDRESS SERVICE BELOW

const ADDRESS_FIELDS = [
  "label", "street", "city", "state", "postalCode", "country", "isDefault"
];

export async function getAddressById(id) {
  const result = await prisma.address.findUnique({
    where: { id },
  });

  return result;
}

export async function updateAddressBy(id, data) {
  const result = await prisma.address.update({
    where: { id },
    data: data,
  });

  return result;
}

export async function createAddress(userId, data) {
   // check if user exist
  const user = await getUserById(userId);
  if (!user) throw createError(404, "Invalid user");

  const newAddressData = sanitizeData(data, ADDRESS_FIELDS);
  console.log(newAddressData);
  newAddressData.userId = userId;

  const result = prisma.address.create({
    data: newAddressData,
  });

  return result;
}

export async function updateUserAddress(userId, addressId, data) {
  // check if user exist
  const user = await getUserById(userId);
  if (!user) throw createError(404, "Invalid user");

  // get address
  const address = await getAddressById(addressId);
  if (!address) throw createError(404, "Invalid address");
  if (address.userId !== userId)
    throw createError(404, "Cannot edit other user's address");

  const updateBody = sanitizeData(data, ADDRESS_FIELDS);

  const result = await updateAddressBy(addressId, updateBody);

  return result;
}


