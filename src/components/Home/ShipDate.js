import classes from "./ShipDate.module.css";

function ShipDate(props) {

  return (
    <div className={classes.shipdate}>
      <div className={classes.shipDate__month}>{props.duration} hrs</div>
    </div>
  );
}
export default ShipDate;
