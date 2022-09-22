import TrainDate from "./TrainDate";
import classes from "./Train.module.css";
import trainClass from "../UI/Button/Button.module.css";
import Button from "../UI/Button/Button";
import TrainsCard from "../UI/Card/TrainsCard";
import { useNavigate } from "react-router-dom";

function Train(props) {
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

  const statusClasses = status === "Available" ? classes.train__statusConfirmed : classes.train__statusWaitlisted;

  return (
    <li>
      <TrainsCard className={classes.train}>
        <TrainDate duration={props.duration} />
        <div className={classes.train__description}>
          <p className={statusClasses}>{status} : {tickets}</p>
          <h2>{props.name}</h2>
        </div>
        <div className={classes.train__price}>${props.price}</div>
        <Button
          id={props.id}
          type="submit"
          className={trainClass.train_button}
          onClick={onBookHandler}
        >
          Book
        </Button>
      </TrainsCard>
    </li>
  );
}
export default Train;
