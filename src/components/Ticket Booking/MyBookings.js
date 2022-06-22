import React from "react";
import classes from "./MyBooking.module.css";
import Layout from "../layout/Layout";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import TicketList from "./TicketList";
import Modal from "../UI/Modal";
import Button from "../UI/Button/Button";
import ticketClasses from "../UI/Button/Button.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";

var ticketId = null;
function MyBookings() {

  //************DECLARATIONS************//

  const userEmail = useSelector((state) => state.login.userId);

  const {
    isLoading: bookingIsLoading,
    error: bookingError,
    sendRequest: sendBookingRequest,
    response: bookingResponse,
    resetError: resetBookingResponse,
    resetResponse: resetBookingError,
  } = useHttp();

  const {
    isLoading: cancelIsLoading,
    error: cancelError,
    sendRequest: sendCancelRequest,
    response: cancelResponse,
    resetError: resetCancelError,
    resetResponse: resetCancelResponse,
  } = useHttp();

  const [showCancellationPrompt, setShowCancellationPrompt] = useState(false);

  //************API CALLS************//

  //Request to backend for bookings data
  const fetchBookingDetails = async (requestJson) => {
    sendBookingRequest({
      url: "http://localhost:8080/api/protected/fetchBookingDetails",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        userEmail: requestJson.userEmail,
      },
      errorMsg: "Request failed!",
    });
  };

  //Request to backend for cancelling ticket
  const cancelTicket = async (requestJson) => {
    sendCancelRequest({
      url: "http://localhost:8080/api/protected/cancelTicket",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        bookingId: requestJson.ticketId,
      },
      errorMsg: "Request failed!",
    });
  };

  //************ACTION HANDLERS************//

  useEffect(() => {
    const requestJson = { userEmail };
    fetchBookingDetails(requestJson);
  }, []);

  function onTicketCancelHandler(id) {
    ticketId = id;
    setShowCancellationPrompt(true);
  }

  function cancellationHandler() {
    const requestJson = {
      ticketId,
    };
    cancelTicket(requestJson);
    setShowCancellationPrompt(false);
  }

  function closeTicketCancelModal() {
    setShowCancellationPrompt(false);
    ticketId = null;
  }

  function recallFetchBooking() {
    const requestJson = {
      userEmail,
    };
    fetchBookingDetails(requestJson);
    resetCancelResponse();
    resetCancelError();
  }

  //************MODALS************//

  const ticketCancelModalActions = (
    <div className={classes.actions}>
      <Button className={ticketClasses.button} onClick={cancellationHandler}>
        Yes
      </Button>
      <Button className={ticketClasses.button} onClick={closeTicketCancelModal}>
        No
      </Button>
    </div>
  );

  const ticketCancelModalContent = (
    <React.Fragment>
      <div className={classes.total}>
        <span>ARE YOU SURE? REFUNDS CAN TAKE UP TO 5-7 DAYS.</span>
      </div>
    </React.Fragment>
  );

  const cancellationMessageActions = (
    <div className={classes.actions}>
      <Button className={ticketClasses.button} onClick={recallFetchBooking}>
        Close
      </Button>
    </div>
  );

  const cancellationMessageContent = (
    <React.Fragment>
      <div className={classes.total}>
        <span>{cancelResponse.responseMessage}</span>
      </div>
    </React.Fragment>
  );

  //************LOADING SPINNERS************//

  if (bookingIsLoading) {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (cancelIsLoading) {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Layout>
      {showCancellationPrompt && (
        <Modal>
          {ticketCancelModalContent}
          {ticketCancelModalActions}
        </Modal>
      )}
      {cancelResponse.responseCode === 0 && (
        <Modal>
          {cancellationMessageContent}
          {cancellationMessageActions}
        </Modal>
      )}
      <TicketList
        bookingList={bookingResponse}
        cancellationHandler={onTicketCancelHandler}
      />
    </Layout>
  );
}
export default MyBookings;
