import React from "react";
import { render } from "@testing-library/react";
import FlickrSearch from "./FlickrSearch";

test("renders recent search link", () => {
  const { getByText } = render(<FlickrSearch />);
  const linkElement = getByText(/Recent searches/i);
  expect(linkElement).toBeInTheDocument();
});
