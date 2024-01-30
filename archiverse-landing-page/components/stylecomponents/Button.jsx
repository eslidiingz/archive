/** @format */

import styled from "styled-components";

// import { propTypes } from "react-bootstrap/esm/Image";
// import styled from "styled-components";

const handleColorType = (color) => {
  switch (color) {
    case "primary":
      return "color: #fff; background: var(--color-gradient-blue)";
    case "secondary":
      return "color: #fff; background: var(--color-gradient-gray)";
    case "dark":
      return "color: #fff; background: var(--color-gradient-purpleblue)";
    case "success":
      return "color: #fff; background: var(--color-gradient-green)";
    case "danger":
      return "color: #fff; background: var(--color-gradient-red)";
    case "info":
      return "color: #fff; background: var(--color-gradient-purplegary)";
    case "light":
      return "color: #fff; background: var(--color-gradient-purple)";
  }
};

const handleColorTypehover = (color) => {
  switch (color) {
    case "primary":
      return "color: #fff; background: var(--color-gradient-blue-hover)";
    case "secondary":
      return "color: #fff; background: var(--color-gradient-gray-hover)";
    case "dark":
      return "color: #fff; background: var(--color-gradient-purpleblue-hover)";
    case "success":
      return "color: #fff; background: var(--color-gradient-green-hover)";
    case "danger":
      return "color: #fff; background: var(--color-gradient-red-hover)";
    case "info":
      return "color: #fff; background: var(--color-gradient-purplegary-hover)";
    case "light":
      return "color: #fff; background: var(--color-gradient-purple-hover)";
  }
};

const handleSizeType = (size) => {
  switch (size) {
    case "size_180":
      return " width: var(--size-button-full)";
    case "size_220":
      return " width: var(--size-button-full-220)";
    case "size_140":
      return " width: var(--size-button-secondary)";
  }
};

export const ButtonComponents = styled("button")`
  border-radius: 10px;
  box-shadow: var(--boxshadow-btn);
  ${({ color }) => handleColorType(color)};
  border: ${(props) =>
    props.border ? "3px solid #54a3ec" : "3px solid transparent"};
  height: 45px;
  transition: all 0.2s ease-in-out;
  padding: 0;
  ${({ size }) => handleSizeType(size)};
  &:hover,
  &:active,
  &:focus {
    color: #fff;
    ${({ color }) => handleColorTypehover(color)}
  }
`;

// export default ButtonComponents;
