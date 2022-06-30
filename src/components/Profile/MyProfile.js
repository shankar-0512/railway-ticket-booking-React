import React from "react";
import Layout from "../layout/Layout";
import classes from "./MyProfile.module.css";
import Button from "../UI/Button/Button";
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import styles from "../CommonInput/Input.module.css";
import Card from "../UI/Card/Card";
import useHttp from "../../hooks/use-http";
import Input from "../CommonInput/Input";
import loginStyles from "../Authentication/Login.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../UI/Modal";
import LoadingSpinner from "../UI/LoadingSpinner";

var pswCode = null;
var pswMessage = null;
function MyProfile() {
  //************DECLARATIONS************//

  const navigate = useNavigate();

  const {
    isLoading: fetchIsLoading,
    sendRequest: sendFetchRequest,
    response: fetchResponse,
  } = useHttp();

  const {
    isLoading: saveIsLoading,
    error: saveError,
    sendRequest: sendSaveRequest,
    response: saveResponse,
    resetError: saveResetError,
    resetResponse: saveResetResponse,
  } = useHttp();

  const {
    isLoading: pswIsLoading,
    error: pswError,
    sendRequest: sendPasswordRequest,
    response: pswResponse,
    resetError: resetPswError,
    resetResponse: resetPswResponse,
  } = useHttp();

  //STATES
  const [enableForm, setEnableForm] = useState(false);
  const [userName, setUserName] = useState(fetchResponse.userName);
  const [basePlanet, setBasePlanet] = useState(fetchResponse.basePlanet);
  const [dob, setDob] = useState(fetchResponse.dob);
  const [oldPsw, setOldPsw] = useState("");
  const [newPsw, setNewPsw] = useState("");
  const [confirmNewPsw, setConfirmNewPsw] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const userEmail = useSelector((state) => state.login.userId);

  //REFS
  const nameInputRef = useRef();
  const planetInputRef = useRef();
  const dateInputRef = useRef();
  const oldPswInputRef = useRef();
  const newPswInputRef = useRef();
  const confirmNewPswInputRef = useRef();

  //************API CALLS************//

  //Request to backend for profile data
  const FetchProfileHandler = async (requestJson) => {
    sendFetchRequest({
      url: "https://space-ticket-booking-java.herokuapp.com/api/protected/fetchProfileDetails",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email: requestJson.userEmail,
      },
      errorMsg: "Request failed!",
    });
  };

  //Request to backend for profile data
  const saveEditMode = async (requestJson) => {
    sendSaveRequest({
      url: "https://space-ticket-booking-java.herokuapp.com/api/protected/saveUserDetails",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email: requestJson.userEmail,
        name: requestJson.userName,
        basePlanet: requestJson.basePlanet,
        dob: requestJson.dob,
      },
      errorMsg: "Request failed!",
    });
  };

  //Request to backend for changing password
  const ChangePasswordHandler = async (requestJson) => {
    sendPasswordRequest({
      url: "https://space-ticket-booking-java.herokuapp.com/api/protected/changePassword",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        userEmail: requestJson.userEmail,
        oldPassword: requestJson.oldPsw,
        newPassword: requestJson.newPsw,
        confirmNewPassword: requestJson.confirmNewPsw,
      },
      errorMsg: "Request failed!",
    });
  };

  //************STATE HANDLERS************//

  function onEditHandler() {
    setEnableForm(true);
  }

  function disableFormHandler() {
    setEnableForm(false);
  }

  function nameChangeHandler(event) {
    setUserName(event.target.value);
  }

  function planetChangeHandler(event) {
    setBasePlanet(event.target.value);
  }

  function dateChangeHandler(event) {
    setDob(event.target.value);
  }

  function oldPswChangeHandler(event) {
    setOldPsw(event.target.value);
  }

  function newPswChangeHandler(event) {
    setNewPsw(event.target.value);
  }

  function confirmNewPswChangeHandler(event) {
    setConfirmNewPsw(event.target.value);
  }

  //************ACTION HANDLERS************//

  useEffect(() => {
    setUserName(fetchResponse.userName);
    setBasePlanet(fetchResponse.basePlanet);
    setDob(fetchResponse.dob);
  }, [fetchResponse.userName, fetchResponse.basePlanet, fetchResponse.dob]);

  useEffect(() => {
    const requestJson = { userEmail };
    FetchProfileHandler(requestJson);
  }, []);

  function EditModeSubmitHandler(event) {
    event.preventDefault();
    const requestJson = {
      userEmail,
      userName,
      basePlanet,
      dob,
    };

    saveEditMode(requestJson);
  }

  function navigateBack() {
    disableFormHandler();
    navigate("/home");
  }

  useEffect(() => {
    if (saveResponse.responseCode === 0) {
      disableFormHandler();
      navigate("/home/myProfile");
    }
  }, [saveResponse.responseMessage, navigate]);

  useEffect(() => {
    if (saveResponse.responseCode === 0) {
      const fetchRequest = { userEmail };
      FetchProfileHandler(fetchRequest);
    }
  }, [saveResponse.responseMessage]);

  function closeErrorModal() {
    saveResetError();
    saveResetResponse();
    if (saveResponse.responseMessage === undefined) {
      navigate("/home");
    }
  }

  function resetPasswordResponses() {
    resetPswError();
    resetPswResponse();
  }

  function closePswMsgModal() {
    if (pswCode === 1) {
      setChangePassword(true);
    } else if (pswCode === 0) {
      pswCode = null;
      pswMessage = null;
      navigate("/home");
    }
  }

  function changePasswordSubmitHandler() {
    setChangePassword(true);
  }

  function closeChangePswModal() {
    setChangePassword(false);
    resetPasswordResponses();
  }

  function onChangePassword(event) {
    event.preventDefault();

    const requestJson = {
      userEmail,
      oldPsw,
      newPsw,
      confirmNewPsw,
    };
    ChangePasswordHandler(requestJson);
  }

  if (pswResponse.responseCode !== undefined) {
    pswCode = pswResponse.responseCode;
    pswMessage = pswResponse.responseMessage;
    setChangePassword(false);
    resetPasswordResponses();
  }

  //************MODALS************//

  const modalActions = (
    <div className={classes.actions}>
      <Button className={classes.btn} onClick={closeErrorModal}>
        Close
      </Button>
    </div>
  );

  const saveModalContent = (
    <React.Fragment>
      <div className={classes.total}>
        <span>{saveResponse.responseMessage}</span>
      </div>
    </React.Fragment>
  );

  const passwordModalActions = (
    <div className={classes.actions}>
      <Button className={classes.btn} onClick={closePswMsgModal}>
        Okay
      </Button>
    </div>
  );

  const passwordModalContent = (
    <React.Fragment>
      <div className={classes.total}>
        <span>
          {pswResponse.responseMessage}
          {pswMessage}
        </span>
      </div>
    </React.Fragment>
  );

  const ChangePasswordModalContent = (
    <React.Fragment>
      <div className={classes.total}>
        <form onSubmit={onChangePassword}>
          <Input
            ref={oldPswInputRef}
            id="oldPsw"
            label="Old Password"
            type="password"
            value={oldPsw}
            onChange={oldPswChangeHandler}
          />
          <Input
            ref={newPswInputRef}
            id="newPsw"
            label="New Password"
            type="password"
            value={newPsw}
            onChange={newPswChangeHandler}
          />
          <Input
            ref={confirmNewPswInputRef}
            id="conNewPsw"
            label="Confirm New Password"
            type="password"
            value={confirmNewPsw}
            onChange={confirmNewPswChangeHandler}
          />
          <Button className={classes.button} type="submit">
            Submit
          </Button>
          <Button
            className={classes.button}
            type="button"
            onClick={closeChangePswModal}
          >
            Cancel
          </Button>
        </form>
      </div>
    </React.Fragment>
  );

  //************LOADING SPINNERS************//

  if (fetchIsLoading) {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (saveIsLoading) {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (pswIsLoading) {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Layout>
        {changePassword && <Modal>{ChangePasswordModalContent}</Modal>}
        {(pswError ||
          pswResponse.responseCode !== undefined ||
          pswCode === 0) && (
          <Modal>
            {passwordModalContent}
            {passwordModalActions}
          </Modal>
        )}
        {(saveError || saveResponse.responseCode !== undefined) && (
          <Modal>
            {saveModalContent}
            {modalActions}
          </Modal>
        )}
        {!enableForm && (
          <div>
            <h2 className={classes.h2Profile}>My Profile</h2>
            <div className={classes.control}>
              <label>Name : </label>
              <label>{fetchResponse.userName}</label>
            </div>
            <div className={classes.control}>
              <label>E-Mail : </label>
              <label>{fetchResponse.userEmail}</label>
            </div>
            <div className={classes.control}>
              <label>Password : </label>
              <label>{fetchResponse.userPassword}</label>
            </div>
            <div className={classes.control}>
              <label>Base Planet : </label>
              <label>{fetchResponse.basePlanet}</label>
            </div>
            <div className={classes.control}>
              <label>Date of Birth : </label>
              <label>{fetchResponse.dob}</label>
            </div>
            <div className={loginStyles.action}>
              <Button
                type="button"
                className={classes.button}
                onClick={onEditHandler}
              >
                Edit
              </Button>
              <Button
                type="button"
                className={classes.button}
                onClick={changePasswordSubmitHandler}
              >
                Change Password
              </Button>
              <Button
                type="button"
                className={classes.button}
                onClick={navigateBack}
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {enableForm && (
          <Card className={loginStyles.login}>
            <form onSubmit={EditModeSubmitHandler}>
              <Input
                ref={nameInputRef}
                id="name"
                label="Name"
                type="text"
                value={userName}
                onChange={nameChangeHandler}
              />
              <div className={styles.control}>
                <label>Base Planet</label>
                <select
                  ref={planetInputRef}
                  className={loginStyles.select}
                  name="planetList"
                  id="planets"
                  value={basePlanet}
                  onChange={planetChangeHandler}
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
              <div className={styles.control}>
                <label htmlFor="date">Date of Birth</label>
                <input
                  ref={dateInputRef}
                  id="date"
                  label="Date of Birth"
                  type="date"
                  value={dob}
                  onChange={dateChangeHandler}
                  max={moment().format("YYYY-MM-DD")}
                ></input>
              </div>
              <div className={loginStyles.action}>
                <Button type="submit" className={classes.button}>
                  Save
                </Button>
                <Button
                  type="button"
                  className={classes.button}
                  onClick={disableFormHandler}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}
      </Layout>
    </div>
  );
}
export default MyProfile;
