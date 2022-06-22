import React, { useReducer, useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { loginActions } from "../../store/login-slice";
import Card from "../UI/Card/Card";
import Button from "../UI/Button/Button";
import Input from "../CommonInput/Input";
import styles from "../CommonInput/Input.module.css";
import classes from "./Login.module.css";
import useHttp from "../../hooks/use-http";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../UI/LoadingSpinner";
import Modal from "../UI/Modal";
import moment from "moment";

var currentPassword = "";

//************REDUCERS************//

function emailReducer(state, action) {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  if (action.type === "CLEAR") {
    return { value: "", isValid: null };
  }

  return { value: "", isValid: false };
}

function passwordReducer(state, action) {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  if (action.type === "CLEAR") {
    return { value: "", isValid: null };
  }

  return { value: "", isValid: false };
}

function nameReducer(state, action) {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length !== "" };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length !== "" };
  }
  if (action.type === "CLEAR") {
    return { value: "", isValid: null };
  }

  return { value: "", isValid: false };
}

function rePasswordReducer(state, action) {
  if (action.type === "USER_INPUT") {
    return {
      value: action.val,
      isValid: action.val.trim() === currentPassword.trim(),
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.trim() === currentPassword.trim(),
    };
  }
  if (action.type === "CLEAR") {
    return { value: "", isValid: null };
  }

  return { value: "", isValid: false };
}

function planetReducer(state, action) {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim() !== "" };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.trim() !== "",
    };
  }
  if (action.type === "CLEAR") {
    return { value: "", isValid: null };
  }
  return { value: "", isValid: false };
}

function dateReducer(state, action) {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim() !== "" };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.trim() !== "",
    };
  }
  if (action.type === "CLEAR") {
    return { value: "", isValid: null };
  }
  return { value: "", isValid: false };
}

function Login(props) {
  //************DECLARATIONS************//

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //STATES
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [nameState, dispatchName] = useReducer(nameReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const [rePasswordState, dispatchRePassword] = useReducer(rePasswordReducer, {
    value: "",
    isValid: null,
  });

  const [planetState, dispatchPlanet] = useReducer(planetReducer, {
    value: "",
    isValid: null,
  });

  const [dateState, dispatchDate] = useReducer(dateReducer, {
    value: "",
    isValid: null,
  });

  //REFS
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const rePasswordInputRef = useRef();
  const planetInputRef = useRef();
  const dateInputRef = useRef();

  const {
    isLoading,
    error,
    sendRequest: sendTaskRequest,
    response,
    resetError,
    resetResponse,
  } = useHttp();

  //checking for form validity every 500ms
  useEffect(
    function () {
      const identifier = setTimeout(() => {
        if (props.signUpFlag) {
          setFormIsValid(
            nameState.isValid &&
              emailState.isValid &&
              passwordState.isValid &&
              rePasswordState.isValid &&
              planetState.isValid &&
              dateState.isValid
          );
        } else {
          setFormIsValid(emailState.isValid && passwordState.isValid);
        }
      }, 200);

      return function clearTimer() {
        clearTimeout(identifier);
      };
    },
    //use effect dependencies - will re run every time below dependencies change.
    //Therefore useffect is guaranteed to use the latest state.
    [
      nameState.isValid,
      emailState.isValid,
      passwordState.isValid,
      rePasswordState.isValid,
      planetState.isValid,
      dateState.isValid,
      props.signUpFlag,
      formIsValid,
    ]
  );

  //************API CALLS************//

  //Request to backend for login and sign-up
  const SignUpRequestHandler = async (requestJson) => {
    sendTaskRequest({
      url: "http://localhost:8080/api/protected/loginAuth",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        name: requestJson.enteredName,
        email: requestJson.enteredEmail,
        password: requestJson.enteredPassword,
        rePassword: requestJson.enteredRePassword,
        basePlanet: requestJson.enteredPlanet,
        dob: requestJson.enteredDate,
        signUpF: requestJson.signUpFlag,
      },
      errorMsg: "Request failed!",
    });
  };

  //************STATE HANDLERS************//

  function nameChangeHandler(event) {
    dispatchName({ type: "USER_INPUT", val: event.target.value });
  }
  function validateNameHandler() {
    dispatchName({ type: "INPUT_BLUR" });
  }
  function emailChangeHandler(event) {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  }
  function validateEmailHandler() {
    dispatchEmail({ type: "INPUT_BLUR" });
  }
  function passwordChangeHandler(event) {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
    currentPassword = event.target.value;
  }
  function validatePasswordHandler() {
    dispatchPassword({ type: "INPUT_BLUR" });
  }
  function rePasswordChangeHandler(event) {
    dispatchRePassword({ type: "USER_INPUT", val: event.target.value });
  }
  function validateRePasswordHandler() {
    dispatchRePassword({ type: "INPUT_BLUR" });
  }
  function planetChangeHandler(event) {
    dispatchPlanet({ type: "USER_INPUT", val: event.target.value });
  }
  function validatePlanetHandler() {
    dispatchPlanet({ type: "INPUT_BLUR" });
  }
  function dateChangeHandler(event) {
    dispatchDate({ type: "USER_INPUT", val: event.target.value });
  }
  function validateDateHandler() {
    dispatchDate({ type: "INPUT_BLUR" });
  }

  //************ACTION HANDLERS************//

  function submitHandler(event) {
    event.preventDefault();

    if (props.signUpFlag) {
      const enteredName = nameState.value;
      const enteredEmail = emailState.value;
      const enteredPassword = passwordState.value;
      const enteredRePassword = rePasswordState.value;
      const enteredPlanet = planetState.value;
      const enteredDate = dateState.value;

      if (formIsValid) {
        const requestJson = {
          enteredName,
          enteredEmail,
          enteredPassword,
          enteredRePassword,
          enteredPlanet,
          enteredDate,
          signUpFlag: "Y",
        };

        SignUpRequestHandler(requestJson);
        setFormIsValid(false);
        props.postSignUp();
        dispatchName({ type: "CLEAR" });
        dispatchEmail({ type: "CLEAR" });
        dispatchPassword({ type: "CLEAR" });
        dispatchRePassword({ type: "CLEAR" });
        dispatchPlanet({ type: "CLEAR" });
        dispatchDate({ type: "CLEAR" });
      }
    } else {
      const enteredEmail = emailState.value;
      const enteredPassword = passwordState.value;

      if (formIsValid) {
        const requestJson = {
          enteredEmail,
          enteredPassword,
          signUpFlag: "N",
        };

        SignUpRequestHandler(requestJson);
        setFormIsValid(false);
        dispatchEmail({ type: "CLEAR" });
        dispatchPassword({ type: "CLEAR" });
      }
    }
  }
  function closeErrorModal() {
    resetError();
    resetResponse();
  }

  if (response.responseCode === 0) {
    dispatch(loginActions.LoginStateHandler());
    dispatch(loginActions.UpdateUserId(response.userId));
    localStorage.setItem("isLoggedIn", 1);
    localStorage.setItem("userId", response.userId);
    closeErrorModal();
  }

  useEffect(() => {
    if (props.loginF) {
      navigate("/login");
    }
  }, [props.loginF, navigate]);

  //************MODALS************//

  const modalActions = (
    <div className={classes.actions}>
      <Button className={classes.btn} onClick={closeErrorModal}>
        Close
      </Button>
    </div>
  );

  const loginModalContent = (
    <React.Fragment>
      <div className={classes.total}>
        <span>{response.responseMessage}</span>
      </div>
    </React.Fragment>
  );

  //************LOADING SPINNERS************//

  if (isLoading) {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Card className={classes.login}>
      {(error || response.responseCode !== undefined) && (
        <Modal onClose={props.onClose}>
          {loginModalContent}
          {modalActions}
        </Modal>
      )}
      <form onSubmit={submitHandler}>
        {props.signUpFlag && (
          <Input
            ref={nameInputRef}
            id="name"
            label="Name"
            type="text"
            isValid={nameState.isValid}
            value={nameState.value}
            onChange={nameChangeHandler}
            onBlur={validateNameHandler}
          />
        )}
        <Input
          ref={emailInputRef}
          id="email"
          label="E-Mail"
          type="email"
          isValid={emailState.isValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          id="password"
          label="Password"
          type="password"
          isValid={passwordState.isValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        {props.signUpFlag && (
          <Input
            ref={rePasswordInputRef}
            id="rePassword"
            label="Re-Password"
            type="password"
            isValid={rePasswordState.isValid}
            value={rePasswordState.value}
            onChange={rePasswordChangeHandler}
            onBlur={validateRePasswordHandler}
          />
        )}
        {props.signUpFlag && (
          <div className={styles.control}>
            <label>Base Planet</label>
            <select
              ref={planetInputRef}
              className={classes.select}
              name="planetList"
              id="planets"
              value={planetState.value}
              onChange={planetChangeHandler}
              onBlur={validatePlanetHandler}
            >
              <option value="" style={{ color: "grey" }}>
                Select an Option
              </option>
              <option value="Earth" style={{ color: "black" }}>
                Earth
              </option>
              <option value="Mars" style={{ color: "black" }}>
                Mars
              </option>
              <option value="Moon" style={{ color: "black" }}>
                Moon
              </option>
              <option value="Ceres" style={{ color: "black" }}>
                Ceres
              </option>
              <option value="Europa" style={{ color: "black" }}>
                Europa
              </option>
              <option value="Titan" style={{ color: "black" }}>
                Titan
              </option>
              <option value="EB-15" style={{ color: "black" }}>
                EB-15
              </option>
              <option value="ISS" style={{ color: "black" }}>
                ISS
              </option>
              <option value="Kepler-186F" style={{ color: "black" }}>
                Kepler-186F
              </option>
            </select>
          </div>
        )}
        {props.signUpFlag && (
          <div className={styles.control}>
            <label htmlFor="date">Date of Birth</label>
            <input
              ref={dateInputRef}
              id="date"
              label="Journey Date"
              type="date"
              isValid={dateState.isValid}
              value={dateState.value}
              onChange={dateChangeHandler}
              onBlur={validateDateHandler}
              max={moment().format("YYYY-MM-DD")}
            ></input>
          </div>
        )}
        {!props.signUpFlag && (
          <div className={classes.action}>
            <Button type="submit" className={classes.btn}>
              Sign in
            </Button>
            <Outlet />
          </div>
        )}
        {props.signUpFlag && (
          <div className={classes.action}>
            <Button type="submit" className={classes.btn}>
              Sign up
            </Button>
            <Outlet />
          </div>
        )}
      </form>
    </Card>
  );
}

export default Login;
