const ButtonState = ({
  onFunction,
  text,
  loading,
  classStyle,
  disable = false,
}) => {
  return (
    <button
      type="button"
      disabled={loading || disable}
      onClick={onFunction}
      className={classStyle}
    >
      {loading && (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
        </>
      )}
      {text}
    </button>
  );
};

export default ButtonState;
