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

  return (
    <li>
      <ShipsCard className={classes.ship}>
        <ShipDate duration={props.duration} />
        <div className={classes.ship__description}>
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
