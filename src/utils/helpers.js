import { getUserById } from "../services/user.service.js";

export function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const sanitizeData = (data, allowedFields) => {
  return Object.fromEntries( // make into object
    Object.entries(data).filter( // .entries make into entries [ [name: Ting] , etc. ]
      ([key, value]) => allowedFields.includes(key) && value !== undefined
    )
  );
};

export async function validateAndFetchUser(userId) {
    const user = await getUserById(userId);
    if (!user) throw createError(404, "Invalid user");
    return user;
}