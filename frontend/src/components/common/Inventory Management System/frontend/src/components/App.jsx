import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Hero from "./common/Hero";
import ViewReport from "./common/ViewReport";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Hero} />
        <Route path="/view-report" component={ViewReport} />
      </Switch>
    </Router>
  );
}

export default App;