import React from 'react';
import {
  Container, Divider,
  Form, Grid,
  Header, Input,
  Segment, List,
  Message, Responsive,
  Modal
} from "semantic-ui-react";

import { fireAuth } from "../config/firebase";
import { validator } from '../utils/helpers';
import { getCurrentUser } from '../requests/firestore';

const { isEmail, minLength, notEmpty, validate } = validator;

const formState = {
  step: 1,
  stepError: false,
  completed: false,
  loading: true,
  fields: {
    email: "",
    firstName: "",
    lastName: "",
    admin: { input: "", list: [] },
    goals: ["", "", ""],
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "form": {
      return { ...state, [action.fieldName]: action.fieldValue };
    }
    case "formField": {
      const { fieldName, fieldValue, index, subField } = action;
      const fields = { ...state.fields };
      if (isFinite(index)) fields[fieldName][parseInt(index)] = fieldValue;
      else if (subField) fields[fieldName][subField] = fieldValue;
      else fields[fieldName] = fieldValue;

      return { ...state, fields };
    }
    default:
      break;
  }
};

/* Component */
const OnboardingForm = ({ loading, handleSubmit, completed }) => {
  const [state, formStateDispatch] = React.useReducer(reducer, formState);
  const { fields } = state;

  React.useEffect(() => {
    fireAuth().onAuthStateChanged(({ email }) => {
      updateFieldState("email", email);
      (async () => {
        const user = await getCurrentUser();
        updateFormState("completed", user.data().profile.completedOnboarding);
        updateFormState("loading", false);
      })();
    });
  }, []);

  React.useEffect(() => {
    updateFormState("loading", loading);
    updateFormState("completed", completed);
  }, [loading, completed]);

  const headerText = ["Hi there.", `Hi ${fields.firstName}`, "Way to go!"];

  const formButtons = {
    1: {
      fluid: true,
      size: "large",
      color: "violet",
      content: "Back",
      width: 8,
      onClick: () => handleStepChange.prev(),
      hidden: state.step === 1,
    },
    2: {
      content: state.step === 3 ? "Finish" : "Proceed",
      color: state.step === 3 ? "green" : "violet",
      fluid: true,
      size: "large",
      width: state.step === 1 ? 16 : 8,
      onClick: () => handleStepChange.next()
    }
  };

  const updateFormState = (fieldName, fieldValue) => {
    formStateDispatch({
      type: "form",
      fieldName,
      fieldValue
    });
  };

  const updateFieldState = (fieldName, fieldValue, { index, subField } = {}) => {
    formStateDispatch({
      type: "formField",
      fieldName,
      fieldValue,
      index,
      subField
    });
  };

  const addAdmin = () => {
    if (isEmail(fields.admin.input) && !fields.admin.list.includes(fields.admin.input)) {
      updateFieldState("admin", [fields.admin.input, ...fields.admin.list], { subField: "list" });
    }
    updateFieldState("admin", "", { subField: "input" });
  };

  const isValidStep = () => {
    if (state.step === 1) {
      return validate(
        minLength(fields.firstName.trim(), 2),
        minLength(fields.lastName.trim(), 2)
      );
    }
    if (state.step === 3) {
      return fields.admin.list.length > 0;
    }
    return true;
  };

  const handleStepChange = {
    prev() {
      updateFormState("step", state.step - 1);
    },
    next() {
      if (state.step !== 3 && isValidStep()) {
        updateFormState("step", state.step + 1);
      } else if (isValidStep()) {
        handleSubmit({
          firstName: fields.firstName,
          lastName: fields.lastName,
          admins: fields.admin.list,
          goals: fields.goals.filter(notEmpty)
        });
      } else {
        updateFormState("stepError", true);
      }
    }
  };


  return state.completed ? <Modal open basic size="fullscreen" content="You've have completed the initial set up." /> : (
    <>
      <Form as={Grid} stackable className="onboarding-grid" size="huge" columns={1} loading={state.loading}>
        <Grid.Column>
          <Container textAlign="center">
            <Header content={headerText[state.step - 1]} size="huge" />
          </Container>
          <Divider hidden />
          {state.step === 1 && (
            <Grid.Row >
              <Form.Group widths="equal">
                <Form.Field
                  control={Form.Input}
                  fluid
                  label="First name"
                  value={state.fields.firstName}
                  onChange={e =>
                    updateFieldState("firstName", e.target.value)
                  }
                />
                <Form.Field
                  control={Form.Input}
                  fluid
                  label="Last name"
                  value={state.fields.lastName}
                  onChange={e =>
                    updateFieldState("lastName", e.target.value)
                  }
                />
              </Form.Group>
              <Responsive as={Divider} minWidth={768} />
              <Form.Field
                readOnly
                control="input"
                label="Email"
                value={fields.email}
              />
              {!isValidStep() && (
                <Message size="small" negative>
                  {!minLength(fields.firstName.trim(), 2) && (
                    <Message.Item content="First name must be at least 2 characters" />
                  )}
                  {!minLength(fields.lastName.trim(), 2) && (
                    <Message.Item content="Last name must be at least 2 characters" />
                  )}
                </Message>
              )}
            </Grid.Row>
          )}
          {state.step === 2 && (
            <>
              <p>What are your main goals with Slayte?</p>
              {[...Array(3)].map((_, i) => (
                <Form.Field key={i}>
                  <Input
                    label={{ content: i + 1, color: "blue" }}
                    value={fields.goals[i]}
                    onChange={e =>
                      updateFieldState("goals", e.target.value, { index: i })
                    }
                  />
                </Form.Field>
              ))}
              <Message
                size="small"
                info content="You can add your goals now or add/update them at anytime later"
              />
            </>
          )}
          {state.step === 3 && (
            <>
              <p>Let us know who should be admins in your setup, and then you're on your way!</p>
              <Segment textAlign="center" padded basic>
                <Form.Field
                  control={Form.Input}
                  placeholder="Type email"
                  size="huge"
                  error={!fields.admin.list.length && !fields.admin.input.length && {
                    content: "Please enter at least one valid email",
                    pointing: "below"
                  }}
                  value={fields.admin.input}
                  onKeyDown={e => e.keyCode === 13 && addAdmin()}
                  onChange={e => {
                    updateFieldState("admin", e.target.value, { subField: "input" });
                  }}
                />

                <Form.Field
                  control={Form.Button}
                  size="large"
                  circular icon="add"
                  onClick={addAdmin}
                />
                <List
                  as={Segment}
                  style={{ overflowY: "auto", maxHeight: 110 }}
                  basic
                  bulleted
                  textAlign="left"
                  size="large"
                  items={fields.admin.list}
                />
              </Segment>
            </>
          )}
          <Form.Group
            className="button-group"
            children={
              Object.values(formButtons)
                .map((btnProps, i) => !btnProps.hidden && <Form.Button key={i} {...btnProps} />)
            }
          />

        </Grid.Column>
      </Form>
      <Modal
        basic
        closeOnEscape
        size="mini"
        content={`Please provide all required fields before ${state.step === 3 ? "Submitting" : "continuing"}`}
        open={state.stepError}
        onClose={() => updateFormState("stepError", false)}
      />
    </>
  );
};

export default OnboardingForm;
