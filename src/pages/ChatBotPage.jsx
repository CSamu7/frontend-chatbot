import Layout from "../components/Layout";
import ChatsHistory from "../components/ChatsHistory";
import ActualChat from "../components/ActualChat";

export default function ChatBotPage() {
  return (
    <Layout>
      <ChatsHistory></ChatsHistory>
      <ActualChat></ActualChat>
    </Layout>
  );
}
