import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './pages/home';
import Register from './pages/register';
import Profile from "./pages/profile";
import EditProfile from "./pages/edirProfile";


export default function Routes() {
  return ( 
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/profile/:email" exact component={Profile} />
      <Route path="/profile/edit/:id" exact component={EditProfile} />
    </Switch>
  );
}
