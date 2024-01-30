import Link from "next/link";
import { Container, Row, Col, Dropdown } from "react-bootstrap";

function DropdownStyleComponents(props) {
  const directions = ["140", "180", "220"];
  const variant = ["primary", "secondary", "info", "light", "dark"];

  const { direction, items, bgvariant } = props;
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          // variant="darkdropdown"
          variant={`${variant?.includes(bgvariant) ? bgvariant : "primary"}`}
          className={`dropdown-size-${
            directions?.includes(direction) ? direction : "180"
          }`}
          id="dropdown-basic"
        >
          <span className="fw-semibold">{props.title}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {items &&
            items.map((item, id) => (
              <Dropdown.Item key={id}>
                {item?.clickable ? (
                  <>
                    <button onClick={item.function}>{item.text}</button>
                  </>
                ) : item?.link ? (
                  <>
                    <Link href={item.link}>
                      <p className="fw-semibold">{item.text}</p>
                    </Link>
                  </>
                ) : (
                  <>{item.text}</>
                )}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default DropdownStyleComponents;
