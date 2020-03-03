import React from "react";
import { Button, Container, Divider, Form, Grid, Message, Icon, } from "semantic-ui-react";

import { validator } from '../utils/helpers';


const AuthForm = ({ authenticate, authSuccess, loading }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [authMode, setAuthMode] = React.useState("login");
  const [erroredFields, setErroredFields] = React.useState({});

  const handleSubmit = e => {
    const { isValid, fieldErrors } = validateForm();

    e.preventDefault();

    if (isValid) {
      setErroredFields({});
      authenticate({ authMode, payload: { email, password } });
    } else {
      setErroredFields(fieldErrors);
    }

    setPassword("");
    authMode === "signup" && setPassword2("");
  };

  const validateForm = () => {
    const { minLength, isEmail, passMatch } = validator;

    const validatedFields = {
      email: {
        isValid: isEmail(email),
        errorMessage: "Please provide a valid email"
      },
      password: {
        isValid: minLength(password.trim(), 8),
        errorMessage: "Password must be at least 8 characters"
      },
      ...authMode === "signup" && {
        password2: {
          isValid: passMatch(password, password2),
          errorMessage: "Passwords must match"
        }
      }
    };

    const isValid = Object.keys(validatedFields)
      .map(field => validatedFields[field].isValid)
      .every(Boolean);

    const fieldErrors = Object.entries(validatedFields)
      .reduce((errors, [fieldName, fieldValidation]) => {
        if (fieldValidation.isValid) return errors;

        return { ...errors, ...{ [fieldName]: fieldValidation.errorMessage } };
      }, {});

    return { isValid, fieldErrors };
  };

  const handleModeSwitch = mode => {
    setAuthMode(mode);

    if (authMode === "signup") setPassword2("");
    setPassword("");
    setErroredFields({});
  };


  return (
    <Grid textAlign="left">
      <Form
        className="twelve wide six wide computer column centered"
        onSubmit={handleSubmit}
        error={!!Object.keys(erroredFields).length}
        success={authSuccess}
        loading={loading}
        size="large"
      >
        <Container textAlign="center">
          <Button.Group size="large">
            <Button
              toggle
              as='a'
              content="Log In"
              active={authMode === "login"}
              onClick={() => handleModeSwitch("login")}
            />
            <Button.Or />
            <Button
              toggle
              as='a'
              content="Sign Up"
              active={authMode === "signup"}
              onClick={() => handleModeSwitch("signup")}
            />
          </Button.Group>
        </Container>
        <Divider hidden />
        <Form.Field
          control={Form.Input}
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={!!erroredFields.email}
        />
        <Form.Field
          control={Form.Input}
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={!!erroredFields.password}
        />
        {authMode === "signup" && <Form.Field
          control={Form.Input}
          label="Confirm Password"
          type="password"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
          error={!!erroredFields.password2}
        />}
        <Form.Field
          control={Form.Button}
          content={authMode === "login" ? "Log In" : "Sign Up"}
          type="submit"
        />
        <Message
          error
          header="Error"
          list={Object.values(erroredFields)}
        />
        <Message
          success
          header="Success"
          icon={<Icon name="circle notched" loading />}
          content={`${authMode} Success!`}
        />
      </Form>
    </Grid>
  );
};

export default AuthForm;
