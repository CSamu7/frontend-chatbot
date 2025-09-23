import styles from "./ChatSelected.module.css";
import ChatContent from "./ChatContent";
import InputMessage from "./InputMessage";
import NoChatSelected from "./NoChatSelected";
import { Route, Switch } from "wouter";

export default function ChatSelected() {
  return (
    <div className={styles.chatContainer}>
      <Switch>
        <Route path="/" component={NoChatSelected}></Route>
        <Route path="/chats/:id" component={ChatContent}></Route>
      </Switch>

      <InputMessage></InputMessage>
    </div>
  );
}
