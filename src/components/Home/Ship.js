import ShipDate from "./ShipDate";
import classes from "./Ship.module.css";
import shipClass from "../UI/Button/Button.module.css";
import Button from "../UI/Button/Button";
import ShipsCard from "../UI/Card/ShipsCard";
import { useNavigate } from "react-router-dom";

function Ship(props) {
  const navigate = useNavigate();

  function onBookHandler(event) {
    navigate(`/home/booking/${event.target.id}`)
  }

  var status = "Available";
  var tickets = props.ticketsAvailable;
  if (tickets <= 0) {
    status = "Waiting List";

    tickets = tickets - tickets * 2;
  }

  const statusClasses = status === "Available" ? classes.ship__statusConfirmed : classes.ship__statusWaitlisted;

  return (
    <li>
      <ShipsCard className={classes.ship}>
        <ShipDate duration={props.duration} />
        <div className={classes.ship__description}>
          <p className={statusClasses}>{status} : {tickets}</p>
          <h2>{props.name}</h2>
        </div>
        <div className={classes.ship__price}>${props.price}</div>
        <Button
          id={props.id}
          type="submit"
          className={shipClass.ship_button}
          onClick={onBookHandler}
        >
          Book
        </Button>
      </ShipsCard>
    </li>
  );
}
export default Ship;
