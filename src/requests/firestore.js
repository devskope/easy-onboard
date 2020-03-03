import { fireAuth, fireStore } from "../config/firebase";

export const createUser = () => fireStore()
  .collection("users")
  .add({
    email: fireAuth().currentUser.email
  });

export const getCurrentUser = async () => {
  const { docs: [user] } = await fireStore()
    .collection("users")
    .where("email", "==", fireAuth().currentUser.email)
    .get();

  return user;
};

export const initializeProfile = async payload => {
  const user = await getCurrentUser();
  return user.ref.update({ profile: payload });
};