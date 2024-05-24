import "./Spinner.css";

const Spinner = ({ scrollDirection }) => {
  let spinnerClass = scrollDirection
    ? `spinner-container ${scrollDirection}`
    : "spinner-container";
  return (
    <div className={spinnerClass}>
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
