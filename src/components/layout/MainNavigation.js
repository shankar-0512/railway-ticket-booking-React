import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginActions } from "../../store/login-slice";
import classes from "./MainNavigation.module.css";
import homeLogo2 from "../../Logos/homeLogo2.png";

const MainNavigation = (props) => {
  const dispatch = useDispatch();

  function logoutHandler() {
    dispatch(loginActions.LoginStateHandler());
    localStorage.clear();
  }

  return (
    <header className={classes.header}>
      <div className={classes.logo}>Continental Line</div>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink
              to="/home"
              className={(navData) => (navData.isActive ? classes.active : "")}
            >
              <img src={homeLogo2} alt="" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/myBookings"
              className={(navData) => (navData.isActive ? classes.active : "")}
            >
              Bookings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/myProfile"
              className={(navData) => (navData.isActive ? classes.active : "")}
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              className={(navData) => (navData.isActive ? classes.active : "")}
              onClick={logoutHandler}
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
