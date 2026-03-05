import { Link, Route, Router, Switch } from "wouter";
import "./App.css";
import ChatBotPage from "./pages/ChatBotPage";
import SignUp from "./pages/SignUp";
import ErrorDetailsProvider from "./context/ErrorContextProvider";

function App() {
  return (
    <Switch>
      <ErrorDetailsProvider>
        <Route path="/" component={ChatBotPage} nest></Route>
        <Route path="/signup" component={SignUp}></Route>
      </ErrorDetailsProvider>
    </Switch>
  );
}

export default App;
