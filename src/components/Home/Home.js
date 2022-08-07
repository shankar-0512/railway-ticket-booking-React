import Layout from "../layout/Layout";
import { useRef, useState } from "react";
import classes from "../Home/Home.module.css";
import styles from "../CommonInput/Input.module.css";
import Button from "../UI/Button/Button";
import useHttp from "../../hooks/use-http";
import ShipList from "./ShipList";
import LoadingSpinner from "../UI/LoadingSpinner";
import moment from "moment";
import { useDispatch } from "react-redux";
import { userInputActions } from "../../store/userInputsSlice"
import phoenix from "../../Logos/phoenix-logo.png"

function Home() {

  //************DECLARATIONS************//

  const dispatch = useDispatch();

  //STATES
  const [formInputsValidity, setFormInputsValidity] = useState({
    from: true,
    to: true,
    toNotMatching: true,
    class: true,
    date: true,
  });

  //REFS
  const fromInputRef = useRef();
  const toInputRef = useRef();
  const classInputRef = useRef();
  const dateInputRef = useRef();

  const {
    isLoading,
    sendRequest: sendTaskRequest,
    response,
  } = useHttp();

  //************API CALLS************//

  //Request to backend for login and sign-up
  const SearchShipsHandler = async (requestJson) => {
    sendTaskRequest({
      url: "http://localhost:8080/api/protected/searchShips",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        from: requestJson.enteredFrom,
        to: requestJson.enteredTo,
        shipClass: requestJson.enteredClass,
        journeyDate: new Date(requestJson.enteredDate),
      },
      errorMsg: "Request failed!",
    });
  };

  //************ACTION HANDLERS************//

  function submitHandler(event) {
    event.preventDefault();

    const enteredFrom = fromInputRef.current.value;
    const enteredTo = toInputRef.current.value;
    const enteredClass = classInputRef.current.value;
    const enteredDate = dateInputRef.current.value;

    const enteredFromIsValid = enteredFrom.trim() !== "none";
    const enteredToIsValid = enteredTo.trim() !== "";
    const enteredToIsNotMatching = enteredTo.trim() !== enteredFrom.trim();
    const enteredClassIsValid = enteredClass.trim() !== "";
    const enteredDateIsValid = enteredDate.trim() !== "";

    setFormInputsValidity({
      from: enteredFromIsValid,
      to: enteredToIsValid,
      toNotMatching: enteredToIsNotMatching,
      class: enteredClassIsValid,
      date: enteredDateIsValid,
    });

    const formIsValid =
      enteredFromIsValid &&
      enteredToIsValid &&
      enteredClassIsValid &&
      enteredToIsNotMatching &&
      enteredDateIsValid;

    if (formIsValid) {
      const requestJson = {
        enteredFrom,
        enteredTo,
        enteredClass,
        enteredDate,
      };

      dispatch(userInputActions.UpdateUserInputs({
        from : enteredFrom,
        to : enteredTo,
        class : enteredClass,
        journeyDate : enteredDate,
      }));

      setFormInputsValidity({
        from: true,
        to: true,
        toNotMatching: true,
        class: true,
        date: true,
      });
      SearchShipsHandler(requestJson);
      fromInputRef.current.value = "none";
      toInputRef.current.value = "";
      classInputRef.current.value = "";
      dateInputRef.current.value = "";
    }
  }

  const fromControlClasses = `${styles.control} ${
    formInputsValidity.from === true ? "" : styles.invalid
  }`;
  const toControlClasses = `${styles.control} ${
    formInputsValidity.to === true ? "" : styles.invalid
  }`;
  const classControlClasses = `${styles.control} ${
    formInputsValidity.class === true ? "" : styles.invalid
  }`;
  const dateControlClasses = `${styles.control} ${
    formInputsValidity.date === true ? "" : styles.invalid
  }`;

  //************LOADING SPINNERS************//

  if (isLoading) {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Layout>
        <section className={classes.summary}>
          <img src={phoenix} alt="" />
          <h3 className={classes.heading}>Book a Ship</h3>
          <form onSubmit={submitHandler}>
            {!formInputsValidity.from && (
              <p className={classes.error}>Please select an Origin!</p>
            )}
            <div className={fromControlClasses}>
              <label>From</label>
              <select
                ref={fromInputRef}
                className={classes.select}
                name="fromList"
                id="from"
              >
                <option value="none" style={{ color: "grey" }}>
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
                <option value="Kepler-186F" style={{ color: "black" }}>
                  Kepler-186F
                </option>
              </select>
            </div>
            {!formInputsValidity.to && (
              <p className={classes.error}>Please select a Destination!</p>
            )}
            {!formInputsValidity.toNotMatching && (
              <p className={classes.error}>
                Destination cannot be the same as From!
              </p>
            )}
            <div className={toControlClasses}>
              <label>To</label>
              <select
                ref={toInputRef}
                className={classes.select}
                name="toList"
                id="to"
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
                <option value="Kepler-186F" style={{ color: "black" }}>
                  Kepler-186F
                </option>
              </select>
            </div>
            {!formInputsValidity.class && (
              <p className={classes.error}>Please select a Class!</p>
            )}
            <div className={classControlClasses}>
              <label>Class</label>
              <select
                ref={classInputRef}
                className={classes.select}
                name="classList"
                id="class"
              >
                <option value="" style={{ color: "grey" }}>
                  Select an Option
                </option>
                <option value="Economy" style={{ color: "black" }}>
                  Economy
                </option>
                <option value="Premium" style={{ color: "black" }}>
                  Premium
                </option>
                <option value="Executive" style={{ color: "black" }}>
                  Executive
                </option>
              </select>
            </div>
            {!formInputsValidity.date && (
              <p className={classes.error}>Please select the Journey Date!</p>
            )}
            <div className={dateControlClasses}>
              <label htmlFor="date">Journey Date</label>
              <input
                ref={dateInputRef}
                id="date"
                label="Journey Date"
                type="date"
                min={moment().format("YYYY-MM-DD")}
              ></input>
            </div>
            <div className={classes.action}>
              <Button type="submit" className={classes.actions} >
                Search Ships
              </Button>
            </div>
          </form>
        </section>
      </Layout>
      <section className={classes.ships}>
        <div>
          <ShipList ships={response} />
        </div>
      </section>
    </div>
  );
}
export default Home;
