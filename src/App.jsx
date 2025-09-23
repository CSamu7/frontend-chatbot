import { Link, Route, Router, Switch } from "wouter";
import "./App.css";
import ChatBotPage from "./pages/ChatBotPage";

function App() {
  return (
    <Switch>
      <Route path="/home" component={ChatBotPage} nest></Route>
    </Switch>
  );
}

export default App;
