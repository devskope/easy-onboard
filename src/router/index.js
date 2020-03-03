import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from '../pages/Home';
import Onboarding from '../pages/Onboarding';

const Routes = () => (
  <Switch>
    <Route path="/" component={Home} exact />
    <Route path="/onboarding" component={Onboarding} exact />
  </Switch>
);

export default Routes;