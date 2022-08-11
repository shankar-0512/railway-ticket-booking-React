import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import classes from "../Profile/MyProfile.module.css";
import loginStyles from "../Authentication/Login.module.css";
import Input from "../CommonInput/Input";
import Button from "../UI/Button/Button";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import styles from "../Home/Home.module.css";
import useHttp from "../../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";
import Modal from "../UI/Modal";
import { useSelector } from "react-redux";

//************GLOBAL VARIABLES************//

var formIsValid = false;
var otpRetries = 3;

function Booking() {
  //************DECLARATIONS************//

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const params = useParams();
  const { shipId } = params;

  const boardingStation = useSelector((state) => state.user.from);
  const arrivalStation = useSelector((state) => state.user.to);
  const shipClass = useSelector((state) => state.user.class);
  const journeyDate = useSelector((state) => state.user.journeyDate);

  const {
    isLoading: verifyIsLoading,
    error: verifyError,
    sendRequest: sendVerifyRequest,
    response: verifyResponse,
    resetError: resetVerifyError,
    resetResponse: resetVerifyResponse,
  } = useHttp();

  const {
    isLoading: otpIsLoading,
    error: otpError,
    sendRequest: sendOtpRequest,
    response: otpResponse,
    resetError: resetOtpError,
    resetResponse: resetOtpResponse,
  } = useHttp();

  const {
    isLoading: ticketIsLoading,
    error: ticketError,
    sendRequest: sendGenerateRequest,
    response: ticketResponse,
    resetResponse: resetTicketResponse,
  } = useHttp();

  //REFS
  const nameInputRef = useRef();
  const ageInputRef = useRef();
  const emailInputRef = useRef();
  const phoneInputRef = useRef();
  const otpInputRef = useRef();

  //STATES
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [formInputsValidity, setFormInputsValidity] = useState({
    userNameIsValid: true,
    ageIsValid: true,
    emailIsValid: true,
    phoneNumberIsValid: true,
  });

  //STATE HANDLERS
  function nameChangeHandler(event) {
    setUserName(event.target.value);
  }
  function ageChangeHandler(event) {
    setAge(event.target.value);
  }
  function emailChangeHandler(event) {
    setEmail(event.target.value);
  }
  function phoneNumberChangeHandler(event) {
    setPhoneNumber(event.target.value);
  }
  function otpChangeHandler(event) {
    setOtp(event.target.value);
  }

  //************API CALLS************//

  //Request to backend for verification email
  const EmailVerification = async (requestJson) => {
    sendVerifyRequest({
      url: "https://space-ticket-booking-java.herokuapp.com/api/protected/verifyUser",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        userEmail: requestJson.email,
      },
      errorMsg: "Request failed!",
    });
  };

  //Request to backend for checking OTP
  const OTPVerification = async (requestJson) => {
    sendOtpRequest({
      url: "https://space-ticket-booking-java.herokuapp.com/api/protected/verifyOtp",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        otp: requestJson.otp,
        userEmail: requestJson.email,
        deleteFlag: requestJson.deleteFlag,
      },
      errorMsg: "Request failed!",
    });
  };

  //Request to backend for generating E-Ticket
  const generateETicket = async (requestJson) => {
    sendGenerateRequest({
      url: "https://space-ticket-booking-java.herokuapp.com/api/protected/generateEticket",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        userName: requestJson.userName,
        userEmail: requestJson.email,
        userAge: requestJson.age,
        shipId: requestJson.shipId,
        shipClass: requestJson.shipClass,
        boardingStation: requestJson.boardingStation,
        arrivalStation: requestJson.arrivalStation,
        journeyDate: requestJson.journeyDate,
        userId: requestJson.userId,
      },
      errorMsg: "Request failed!",
    });
  };

  //************ACTION HANDLERS************//

  function onClickCancelHandler() {
    navigate("/home");
  }

  function bookingSubmitHandler(event) {
    event.preventDefault();

    const userNameValidity = userName.trim() !== "";
    const ageValidity = age.trim() > 0;
    const emailValidity = email.trim().includes("@");
    const phoneValidity = phoneNumber.trim() !== "";

    setFormInputsValidity({
      userNameIsValid: userNameValidity,
      ageIsValid: ageValidity,
      emailIsValid: emailValidity,
      phoneNumberIsValid: phoneValidity,
    });

    formIsValid =
      userNameValidity && ageValidity && emailValidity && phoneValidity;

    if (formIsValid) {
      setFormInputsValidity({
        userNameIsValid: true,
        ageIsValid: true,
        emailIsValid: true,
        phoneNumberIsValid: true,
      });

      const requestJson = { email };
      EmailVerification(requestJson);
    }
  }

  function otpSubmitHandler(event) {
    event.preventDefault();

    const requestJson = { otp, email };
    OTPVerification(requestJson);
    otpRetries = otpRetries - 1;
  }

  function closeTicketErrorModal() {
    resetTicketResponse();
    navigate("/home");
  }

  function resetOtp() {
    resetOtpError();
    resetOtpResponse();
  }

  function retryOtpErrorModal() {
    resetOtp();
  }

  function closeOtpErrorModal() {
    resetOtp();
    otpRetries = 3;
    closeTicketErrorModal();
    const requestJson = {
      email,
      deleteFlag: "Y",
    };
    OTPVerification(requestJson);
  }

  if (otpResponse.responseCode === 0) {
    const requestJson = {
      userName,
      email,
      age,
      shipId,
      shipClass,
      boardingStation,
      arrivalStation,
      journeyDate,
      userId,
    };

    generateETicket(requestJson);
    resetOtpResponse();
    resetVerifyError();
    resetVerifyResponse();
  }

  const ticketModalActions = (
    <div className={classes.actions}>
      <Button className={classes.btn} onClick={closeTicketErrorModal}>
        Okay
      </Button>
    </div>
  );

  const otpModalActions = (
    <div className={classes.actions}>
      {otpRetries !== 0 && (
        <Button className={classes.btn} onClick={retryOtpErrorModal}>
          Retry({otpRetries})
        </Button>
      )}
      {otpRetries === 0 && (
        <Button className={classes.btn} onClick={closeOtpErrorModal}>
          Close
        </Button>
      )}
    </div>
  );

  //************MODALS************//

  const ticketModalContent = (
    <React.Fragment>
      <div className={classes.total}>
        <span>{ticketResponse.responseMessage}</span>
      </div>
    </React.Fragment>
  );

  const otpFailureModalContent = (
    <React.Fragment>
      <div className={classes.total}>
        <span>{otpResponse.responseMessage}</span>
      </div>
    </React.Fragment>
  );

  const BookingModalContent = (
    <React.Fragment>
      <div className={classes.total}>
        <form onSubmit={otpSubmitHandler}>
          <Input
            ref={otpInputRef}
            id="otp"
            label="Please enter your OTP :"
            type="number"
            value={otp}
            onChange={otpChangeHandler}
          />
          <Button className={classes.btn} type="submit">
            Submit
          </Button>
        </form>
      </div>
    </React.Fragment>
  );

  //************LOADING SPINNERS************//

  if (verifyIsLoading) {
    return (
      <div className="centered">
        <h2 className={styles.h2}>Please wait, Sending verification mail...</h2>
        <LoadingSpinner />
      </div>
    );
  }

  if (otpIsLoading) {
    return (
      <div className="centered">
        <h2 className={styles.h2}>Verifying...</h2>
        <LoadingSpinner />
      </div>
    );
  }

  if (ticketIsLoading) {
    return (
      <div className="centered">
        <h2 className={styles.h2}>Making your Reservation, please do not leave this page...</h2>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Layout>
      {(verifyError ||
        (verifyResponse.responseCode === 0 &&
          otpResponse.responseCode !== 1)) && (
          <Modal onClose={null}>{BookingModalContent}</Modal>
        )}
      {(ticketError || ticketResponse.responseCode === 0) && (
        <Modal onClose={null}>
          {ticketModalContent}
          {ticketModalActions}
        </Modal>
      )}
      {(otpError || otpResponse.responseCode === 1) && (
        <Modal onClose={null}>
          {otpFailureModalContent}
          {otpModalActions}
        </Modal>
      )}
      <section className={styles.summary}>
        <form onSubmit={bookingSubmitHandler}>
          <h3 className={classes.h2}>Passenger 1 - Details</h3>
          {!formInputsValidity.userNameIsValid && (
            <p className={styles.error}>Please enter your Name.</p>
          )}
          <Input
            ref={nameInputRef}
            id="name1"
            label="Name"
            type="text"
            value={userName}
            onChange={nameChangeHandler}
          />
          {!formInputsValidity.ageIsValid && (
            <p className={styles.error}>Please enter your Age.</p>
          )}
          <Input
            ref={ageInputRef}
            id="age1"
            label="Age"
            type="number"
            value={age}
            onChange={ageChangeHandler}
          />
          {!formInputsValidity.emailIsValid && (
            <p className={styles.error}>Please enter your Email.</p>
          )}
          <Input
            ref={emailInputRef}
            id="email"
            label="Email"
            type="text"
            value={email}
            onChange={emailChangeHandler}
          />
          {!formInputsValidity.phoneNumberIsValid && (
            <p className={styles.error}>Please enter your Mobile Number.</p>
          )}
          <Input
            ref={phoneInputRef}
            id="phoneNumber"
            label="Mobile"
            type="number"
            value={phoneNumber}
            onChange={phoneNumberChangeHandler}
          />
          <div className={loginStyles.action}>
            <Button type="submit" className={classes.btn}>
              Book
            </Button>
            <Button
              type="button"
              className={classes.btn}
              onClick={onClickCancelHandler}
            >
              Cancel
            </Button>
          </div>
        </form>
      </section>
    </Layout>
  );
}
export default Booking;
