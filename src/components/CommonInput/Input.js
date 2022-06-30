import React, { useRef, useImperativeHandle } from "react";
import classes from "./Input.module.css";

const Input = React.forwardRef((props, ref) => {
  const inputRef = useRef();

  function activateFocus() {
    inputRef.current.focus();
  }

  useImperativeHandle(ref, function () {
    return {
      focus: activateFocus,
    };
  });

  return (
    <div
      className={`${classes.control} ${
        props.isvalid === false ? classes.invalid : ""
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        list={props.list}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
});
export default Input;
