import { Navigate } from "react-router-dom";

function IsAuth({ component: Component }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.hasOwnProperty('name')) {
    return <Navigate to="/home" />;
  } else {
    return <Component />;
  }
}

export default IsAuth;