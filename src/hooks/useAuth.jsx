import { setCsrfService } from "../services/csrfServices";

export default function useAuth() {
  const setCsrf = async () => {
    setCsrfService();
  };

  return { setCsrf };
}
