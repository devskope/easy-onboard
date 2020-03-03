import React from "react";

import OnboardingForm from "../components/OnboardingForm";
import { initializeProfile } from "../requests/firestore";

const Onboarding = () => {
  const [loading, setLoading] = React.useState(true);
  const [onboardingDone, setOnboardingDone] = React.useState(false);

  const handleSubmit = async payload => {
    setLoading(true);
    try {
      await initializeProfile({
        ...payload, completedOnboarding: true
      });
      setOnboardingDone(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <OnboardingForm loading={loading} handleSubmit={handleSubmit} completed={onboardingDone} />
  );
};



export default Onboarding;
