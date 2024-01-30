function Select(props) {
  return (
    <>
      <div className={props.className}>
        <select
          className="form-select input-search-set "
          aria-label="Default select example"
          name={props.name}
          value={props.filter[props.name]}
          onChange={(e) => {
            props.handleFilterChange(e);
          }}
        >
          <option value="">{props.placeholder}</option>
          {props.options.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default Select;
