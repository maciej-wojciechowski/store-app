export const capitalizeKeys = (string: string) => {
  return string
    .split("_")
    .map((word) => {
      const firstLetter = word[0];
      if (!firstLetter) {
        return;
      }
      word.toLowerCase();
      return firstLetter.toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const camelCaseToLabels = (string: string) => {
  const firstLetter = string[0];
  if (!firstLetter) {
    return "";
  }
  const capitalized = string.replace(/([a-z])([A-Z])/g, "$1 $2");
  return firstLetter.toUpperCase() + capitalized.slice(1);
};
