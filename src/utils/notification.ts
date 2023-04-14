import { notification } from "antd";

export const myNotification = (() => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  notification.config({
    duration: 3,
    placement: "bottomRight",
  });
  return notification;
})();
