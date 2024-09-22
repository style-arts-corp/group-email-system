import { Navigate } from "react-router-dom";
import Header from "../components/header/Header";
import LoginForm from "../components/loginForm/loginForm";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const {user, error} = useAuth();
  return (
    <>
      {user?
        <Navigate to={"/"} />:
        <>
          <Header />
          <LoginForm/>
        </>
      }
    </>
  );
}

export default LoginPage;