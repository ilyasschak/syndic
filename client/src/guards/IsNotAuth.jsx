import { Navigate } from "react-router-dom";

function IsNotAuth({ component: Component }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.hasOwnProperty('name')) {
    return <Component/>;
  } else {
    return <Navigate to="/login" />;
  }
}

export default IsNotAuth;
