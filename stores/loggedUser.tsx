import { makeVar } from "@apollo/client";

export const applyMe = makeVar({ me: null });

export const setMe = (userData) => {
  applyMe({ me: userData });
};

export const applyIsMyRoom = makeVar(false);

export const setIsMyROom = (isMyRoom: boolean) => {
  applyIsMyRoom(isMyRoom)
}