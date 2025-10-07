import { Link, Route, Router, Switch } from "wouter";
import "./App.css";
import ChatBotPage from "./pages/ChatBotPage";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Switch>
      <Route path="/home" component={ChatBotPage} nest></Route>
      <Route path="/signup" component={SignUp}></Route>
    </Switch>
  );
}

export default App;
