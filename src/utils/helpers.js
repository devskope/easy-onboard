export const validator = {
  isEmail: string => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    string,
  ),
  notEmpty: string => string !== "",
  minLength: (data, length) => data.length >= length,
  passMatch: (a, b) => [a, b].every(validator.notEmpty) && a === b,
  validate: (...validators) => validators.every(Boolean),
};

export const formatAuthError = ({ code }) => {
  switch (code) {
    case "auth/user-not-found":
      return "No user with the provided email address exists";
    case "auth/wrong-password":
      return "The password provided for this user is invalid";
    case "auth/email-already-in-use":
      return "The provided email is already signed up, please log in";
    default:
      return "An error occured during authentication, please check your connection and try again";
  }
};