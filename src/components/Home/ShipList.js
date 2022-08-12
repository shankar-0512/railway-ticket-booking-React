import Ship from "./Ship";
import classes from "./ShipList.module.css"

function ShipList(props) {
  if (props.ships.length === 0) {
    return <h3 className={classes.ship__fallback}>No Ships found!</h3>;
  }

  return (
    <ul className={classes.shiplist}>
      {props.ships.map(function (ship) {
        return (
          <Ship
            key={ship.shipId}
            id={ship.shipId}
            name={ship.shipName}
            price={ship.price}
            duration={ship.duration}
            ticketsAvailable={ship.ticketsAvailable}
          />
        );
      })}
    </ul>
  );
}
export default ShipList;
