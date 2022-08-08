import ShipsCard from "../UI/Card/ShipsCard";
import classes from "./Tickets.module.css";
import ticketClasses from "../UI/Button/Button.module.css";
import TicketDate from "./TicketDate";
import Button from "../UI/Button/Button";

function Tickets(props) {
  function onTicketCancelHandler(event) {
    props.cancellationHandler(event.target.id);
  }

  const status = props.bookingStatus === "CNF" ? "Confirmed" : "Waitlisted";
  const statusClasses = props.bookingStatus === "CNF" ? classes.ticket__cnfStatus : classes.ticket__wlStatus;

  return (
    <li>
      <ShipsCard className={classes.ticket}>
        <TicketDate journeyDate={props.journeyDate} />
        <div className={classes.ticket__description}>
          <p className={statusClasses}>{status}</p>
          <h2>{props.duration} hrs</h2>
          <h2>
            {props.boarding} ------- {props.arrival}
          </h2>
          <h1>{props.name}</h1>
        </div>
        <div className={classes.ticket__price}>${props.price}</div>
        <Button
          id={props.id}
          type="button"
          className={ticketClasses.ticket_button}
          onClick={onTicketCancelHandler}
        >
          Cancel
        </Button>
      </ShipsCard>
    </li>
  );
}
export default Tickets;
