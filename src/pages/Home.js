import React from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'semantic-ui-react';

import AuthForm from '../components/AuthForm';
import { authenticateUser } from '../requests/auth';
import { createUser } from '../requests/firestore';
import { formatAuthError } from '../utils/helpers';


const Home = () => {
  const [loading, setLoading] = React.useState(false);
  const [authErrored, setAuthErrored] = React.useState(false);
  const [authError, setAuthError] = React.useState("");
  const [authSuccess, setAuthSuccess] = React.useState(false);

  const history = useHistory();

  const authenticate = async formData => {
    setLoading(true);
    try {
      await authenticateUser(formData);
      setAuthSuccess(true);
      if (formData.authMode === "signup") await createUser();
      setLoading(false);
      setTimeout(() => history.push("/onboarding"), 1000);
    } catch (error) {
      setAuthError(formatAuthError(error));
      setLoading(false);
      setAuthErrored(true);
    }
  };

  const closeAuthErrorModal = () => {
    setAuthErrored(false);
    setAuthError("");
  };

  return (
    <>
      <AuthForm authenticate={authenticate} authSuccess={authSuccess} loading={loading} />
      {authErrored &&
        <Modal
          open
          closeIcon
          size="tiny"
          centered={false}
          onClose={closeAuthErrorModal}
          content={authError}
        />}
    </>
  );
};

export default Home;
