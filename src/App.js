import { Route, Routes, Navigate, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { loginActions } from "./store/login-slice";
import { useDispatch } from "react-redux";
import Login from "./components/Authentication/Login";
import classes from "./components/UI/Button/Button.module.css";
import { useState, useEffect } from "react";
import Home from "./components/Home/Home";
import MyProfile from "./components/Profile/MyProfile";
import Booking from "./components/Ticket Booking/Booking";
import MyBookings from "./components/Ticket Booking/MyBookings";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signUpFlag, setSignUpFlag] = useState(true);
  const [navigateLoginF, setNavigateLoginF] = useState(true);

  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  function postSignUpHandler() {
    setSignUpFlag(true);
    setNavigateLoginF(true);
  }

  function resetNavigateLoginF() {
    setNavigateLoginF(false);
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("userId");
    if (loggedInUser) {
      dispatch(loginActions.LoginStateHandler());
      dispatch(loginActions.UpdateUserId(userId));
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<Login />}>
        <Route
          path=""
          element={
            <Link
              style={{ textDecoration: "none" }}
              className={classes.button}
              to={"/signUp"}
              onClick={resetNavigateLoginF}
            >
              New User?
            </Link>
          }
        />
      </Route>
      <Route
        path="/signUp"
        element={
          <Login
            signUpFlag={signUpFlag}
            postSignUp={postSignUpHandler}
            loginF={navigateLoginF}
          />
        }
      >
        <Route
          path=""
          element={
            <Link
              style={{ textDecoration: "none" }}
              className={classes.button}
              to={"/login"}
              onClick={postSignUpHandler}
            >
              Back
            </Link>
          }
        />
      </Route>
      <Route path="/home" element={<Home />} />
      <Route path="/home/myProfile" element={<MyProfile />} />
      <Route path="/home/booking/:shipId" element={<Booking />} />
      <Route path="/home/myBookings" element={<MyBookings />} />
    </Routes>
  );
}

export default App;
