import { Router, Route, Switch } from "wouter";
import "./App.css";
import ChatBotPage from "./pages/ChatBotPage";
import SignUp from "./pages/SignUp";
import ErrorDetailsProvider from "./context/ErrorContextProvider";
import { useUserContext } from "./context/UserContext";

function App() {
  const { isLoading } = useUserContext();

  if (isLoading) {
    return <div style={{ color: 'white', padding: '2rem' }}>Cargando...</div>;
  }

  return (
    <Router>
      <ErrorDetailsProvider>
        <Switch>
          <Route path="/" component={ChatBotPage} />
          <Route path="/signup" component={SignUp} />
          <Route path="/chats/:id" component={ChatBotPage} />
        </Switch>
      </ErrorDetailsProvider>
    </Router>
  );
}

export default App;