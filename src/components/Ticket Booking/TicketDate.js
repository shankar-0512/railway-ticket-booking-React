import classes from "./TicketDate.module.css";

function TicketDate(props) {
  const month = props.journeyDate.toLocaleString("en-US", { month: "long" });
  const day = props.journeyDate.toLocaleString("en-US", { day: "2-digit" });
  const year = props.journeyDate.getFullYear();

  return (
    <div className={classes.ticketDate}>
      <div className={classes.ticketDate__month}>{month}</div>
      <div className={classes.ticketDate__year}>{year}</div>
      <div className={classes.ticketDate__day}>{day}</div>
    </div>
  );
}
export default TicketDate;
