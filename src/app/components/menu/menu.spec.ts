import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Menu from "./menu";

test("renders a message", () => {
  const { asFragment, getByText } = render(() => Menu);
});
