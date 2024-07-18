const parseType = (contactType) =>
  typeof contactType === 'string' &&
  ['work', 'home', 'personal'].includes(contactType) &&
  contactType;

const parseIsFavourite = (isFavourite) =>
  typeof isFavourite === 'boolean' && isFavourite;

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  const parsedType = parseType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
