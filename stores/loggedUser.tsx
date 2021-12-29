import { makeVar } from "@apollo/client";

export const applyMe = makeVar({ me: null });

export const setMe = (userData) => {
  applyMe({ me: userData });
};
