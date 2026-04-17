import prisma from "../lib/prismaClient.js";
import createError from "http-errors";

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
  if (!address) throw createError(404, "Address not exist");
  if (address.userId !== userId)
    throw createError(404, "Cannot edit other user's address");

  const updateBody = sanitizeData(data, ADDRESS_FIELDS);

  const result = await updateAddressBy(addressId, updateBody);

  return result;
}

const sanitizeData = (data, allowedFields) => {
  return Object.fromEntries( // make into object
    Object.entries(data).filter( // make into entries [ [name: Ting] , etc. ]
      ([key, value]) => allowedFields.includes(key) && value !== undefined
    )
  );
};
