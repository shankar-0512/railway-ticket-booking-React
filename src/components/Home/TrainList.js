import Train from "./Train";
import classes from "./TrainList.module.css"

function TrainList(props) {
  if (props.trains.length === 0) {
    return <h3 className={classes.train__fallback}>No Trains found!</h3>;
  }

  return (
    <ul className={classes.trainlist}>
      {props.trains.map(function (train) {
        return (
          <Train
            key={train.trainId}
            id={train.trainId}
            name={train.trainName}
            price={train.price}
            duration={train.duration}
            ticketsAvailable={train.ticketsAvailable}
          />
        );
      })}
    </ul>
  );
}
export default TrainList;
