export const isMobile = () =>
  typeof window !== "undefined"
    ? document.body.getBoundingClientRect().width < 768
    : false;
