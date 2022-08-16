import React, { Suspense } from "react";
import { Route, Routes, Navigate, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { loginActions } from "./store/login-slice";
import { useDispatch } from "react-redux";
import Login from "./components/Authentication/Login";
import { useState, useEffect } from "react";
import LoadingSpinner from "./components/UI/LoadingSpinner";

const Home = React.lazy(() => import("./components/Home/Home"));
const MyProfile = React.lazy(() => import("./components/Profile/MyProfile"));
const MyBookings = React.lazy(() =>
  import("./components/Ticket Booking/MyBookings")
);
const Booking = React.lazy(() => import("./components/Ticket Booking/Booking"));

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signUpFlag, setSignUpFlag] = useState(true);
  const [navigateLoginF, setNavigateLoginF] = useState(true);

  const [sessionTimeout, setSessionTimeout] = useState(false);

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
      localStorage.setItem("setupTime", now);
      setSessionTimeout(false);
      navigate("/home");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    var hours = 6; // to clear the localStorage after 1 hour
    // (if someone want to clear after 8hrs simply change hours=8)
    var now = new Date().getTime();
    var setupTime = localStorage.getItem("setupTime");
    if (setupTime == null) {
      localStorage.setItem("setupTime", now);
    } else {
      if (now - setupTime > hours * 60 * 60 * 1000) {
        dispatch(loginActions.LoginStateHandler());
        setSessionTimeout(true);
        localStorage.clear();
      }
    }
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("userId");
    if (loggedInUser) {
      dispatch(loginActions.LoginStateHandler());
      dispatch(loginActions.UpdateUserId(userId));
    }
  }, []);

  return (
    <Suspense
      fallback={
        <div className="centered">
          <LoadingSpinner />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route
          path="/login"
          element={<Login sessionTimeout={sessionTimeout} />}
        >
          <Route
            path=""
            element={
              <Link
                style={{ textDecoration: "none" }}
                className={null}
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
                className={null}
                to={"/login"}
                onClick={postSignUpHandler}
              >
                Already have an account?
              </Link>
            }
          />
        </Route>
        <Route path="/home" element={<Home />} />
        <Route path="/home/myProfile" element={<MyProfile />} />
        <Route path="/home/booking/:shipId" element={<Booking />} />
        <Route path="/home/myBookings" element={<MyBookings />} />
      </Routes>
    </Suspense>
  );
}

export default App;
