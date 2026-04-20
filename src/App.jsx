import { Link, Route, Router, Switch } from "wouter";
import "./App.css";
import ChatBotPage from "./pages/ChatBotPage";
import SignUp from "./pages/SignUp";
import ErrorDetailsProvider from "./context/ErrorContextProvider";
import { useUserContext } from "./context/UserContext";

function App() {
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Switch>
      <Route path="/" component={ChatBotPage} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
}

export default App;
