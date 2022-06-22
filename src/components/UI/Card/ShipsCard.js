import "./ShipsCard.css";

function ShipsCard(props){

    const classes = "card " + props.className;
    return(
        //props.children extracts all the child code from wrapping block.
        <div className={classes}>{props.children}</div>
    );
}
export default ShipsCard;