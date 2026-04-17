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