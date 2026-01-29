import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders marketplace brand", () => {
  render(<App />);
  const brand = screen.getByText(/MultiVendor Marketplace/i);
  expect(brand).toBeInTheDocument();
});

