import classes from "./TrainDate.module.css";

function TrainDate(props) {

  return (
    <div className={classes.traindate}>
      <div className={classes.trainDate__month}>{props.duration} hrs</div>
    </div>
  );
}
export default TrainDate;
