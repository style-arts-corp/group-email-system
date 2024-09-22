import Header from "../components/header/Header";
import EmailForm from "../components/emailForm/EmailForm";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const MainPage = () => {
  const {user, error} = useAuth();

  return (
  <>
    {user?
      <>
        <Header />
        <EmailForm/>
      </>:
      <Navigate to={"/login"} />
    }
  </>
  );
}

export default MainPage;