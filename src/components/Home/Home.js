import Layout from "../layout/Layout";
import { useRef, useState } from "react";
import classes from "../Home/Home.module.css";
import styles from "../CommonInput/Input.module.css";
import Button from "../UI/Button/Button";
import useHttp from "../../hooks/use-http";
import TrainList from "./TrainList";
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
  const SearchTrainsHandler = async (requestJson) => {
    sendTaskRequest({
      url: "https://space-ticket-booking-java.herokuapp.com/api/protected/searchTrains",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        from: requestJson.enteredFrom,
        to: requestJson.enteredTo,
        trainClass: requestJson.enteredClass,
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
        from: enteredFrom,
        to: enteredTo,
        class: enteredClass,
        journeyDate: enteredDate,
      }));

      setFormInputsValidity({
        from: true,
        to: true,
        toNotMatching: true,
        class: true,
        date: true,
      });
      SearchTrainsHandler(requestJson);
      fromInputRef.current.value = "none";
      toInputRef.current.value = "";
      classInputRef.current.value = "";
      dateInputRef.current.value = "";
    }
  }

  const fromControlClasses = `${styles.control} ${formInputsValidity.from === true ? "" : styles.invalid
    }`;
  const toControlClasses = `${styles.control} ${formInputsValidity.to === true ? "" : styles.invalid
    }`;
  const classControlClasses = `${styles.control} ${formInputsValidity.class === true ? "" : styles.invalid
    }`;
  const dateControlClasses = `${styles.control} ${formInputsValidity.date === true ? "" : styles.invalid
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
          <h3 className={classes.heading}>Book a Train</h3>
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
                <option value="London" style={{ color: "black" }}>
                  London
                </option>
                <option value="Paris" style={{ color: "black" }}>
                  Paris
                </option>
                <option value="Berlin" style={{ color: "black" }}>
                  Berlin
                </option>
                <option value="Manchester" style={{ color: "black" }}>
                  Manchester
                </option>
                <option value="Liverpool" style={{ color: "black" }}>
                  Liverpool
                </option>
                <option value="Turin" style={{ color: "black" }}>
                  Turin
                </option>
                <option value="Rome" style={{ color: "black" }}>
                  Rome
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
                <option value="London" style={{ color: "black" }}>
                  London
                </option>
                <option value="Paris" style={{ color: "black" }}>
                  Paris
                </option>
                <option value="Berlin" style={{ color: "black" }}>
                  Berlin
                </option>
                <option value="Manchester" style={{ color: "black" }}>
                  Manchester
                </option>
                <option value="Liverpool" style={{ color: "black" }}>
                  Liverpool
                </option>
                <option value="Turin" style={{ color: "black" }}>
                  Turin
                </option>
                <option value="Rome" style={{ color: "black" }}>
                  Rome
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
                Search Trains
              </Button>
            </div>
          </form>
        </section>
      </Layout>
      <section className={classes.trains}>
        <div>
          <TrainList trains={response} />
        </div>
      </section>
    </div>
  );
}
export default Home;
