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
