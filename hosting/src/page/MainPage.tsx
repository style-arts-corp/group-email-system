import EmailForm from '@/components/emailForm/EmailForm';
import Header from '@/components/header/Header';
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const MainPage = () => {
  const {user} = useAuth();

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
