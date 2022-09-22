import Tickets from "./Tickets";
import classes from "./MyBooking.module.css";

function TicketList(props) {
  if (props.bookingList.length === 0) {
    return <h3 className={classes.train__fallback}>No bookings available!</h3>;
  }
  return (
    <ul className={classes.trainlist}>
      {props.bookingList.map(function (ticket) {
        return (
          <Tickets
            key={ticket.bookingId}
            id={ticket.bookingId}
            name={ticket.trainName}
            boarding={ticket.boarding}
            arrival={ticket.arrival}
            journeyDate={new Date(ticket.journeyDate)}
            duration={ticket.duration}
            price={ticket.price}
            bookingStatus={ticket.bookingStatus}
            cancellationHandler={props.cancellationHandler}
          />
        );
      })}
    </ul>
  );
}
export default TicketList;
