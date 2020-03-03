import { fireAuth } from '../config/firebase';

export const authenticateUser = formData => {
  const { authMode, payload: { email, password } } = formData;
  if (authMode === "signup") {
    return fireAuth().createUserWithEmailAndPassword(email, password);
  }

  return fireAuth().signInWithEmailAndPassword(email, password);
};