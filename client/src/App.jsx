import RegisterPage from './pages/auth/register.jsx';
import LoginPage from './pages/auth/login.jsx';
import Navbar from './components/navbar.jsx';
import Home from './pages/home.jsx';
import './App.css';
import {Route, Routes , useLocation, Navigate} from "react-router-dom";
import { UserContextProvider } from './contexts/userContext.jsx';
import ForgotPassword from './pages/auth/forgotPassword.jsx';
import ResetPassword from './pages/auth/resetPassword.jsx';
import VerifyAccount from './pages/auth/verifyAccount.jsx';
import IsNotAuth from './guards/IsNotAuth.jsx';
import IsAuth from './guards/IsAuth.jsx';
import PageNotFound from './pages/pageNotFound.jsx';
import AddApartment from './pages/appartments/AddApartment.jsx';
import Apartments from './pages/appartments/Apartments.jsx';
import UpdateApartment from './pages/appartments/UpdateApartment.jsx';
import Payments from './pages/payments/Payments.jsx';
import UpdatePayment from './pages/payments/UpdatePayments.jsx';
import Clients from './pages/clients/Clients.jsx';

function App() {

  const location = useLocation();

  const shouldRenderNavbar = location.pathname !== '/register'
                            || location.pathname !== '/login'
                            || location.pathname !== '/forgot'
                            || location.pathname !== "/verify"
                            || location.pathname.startsWith('/reset/');


  

  return (
    <UserContextProvider>
      {shouldRenderNavbar && <Navbar/>}
      <Routes>
        <Route path="/" element={<IsNotAuth component={Home} />}/>
        <Route path="/home" element={<IsNotAuth component={Home} />}/>
        <Route path='/register' element={<IsAuth component={RegisterPage}/>}></Route>
        <Route path='/login' element={<IsAuth component={LoginPage}/>}></Route>
        <Route path="/forgot" element={<IsAuth component={ForgotPassword}/>}></Route>
        <Route path='/reset/:token' element={<IsAuth component={ResetPassword}/>}></Route>
        <Route path='/verify' element={<IsAuth component={VerifyAccount}/>}></Route>
        <Route path = '/add_apartment' element={<IsNotAuth component={AddApartment}/>}/>
        <Route path = '/apartments' element={<IsNotAuth component={Apartments}/>}/>
        <Route path = '/apartments/:id' element={<IsNotAuth component={UpdateApartment}/>}/>
        <Route path = '/payments' element={<IsNotAuth component={Payments}/>}/>
        <Route path = '/payments/:id' element={<IsNotAuth component={UpdatePayment}/>}/>
        <Route path = '/clients' element={<IsNotAuth component={Clients}/>}/>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
