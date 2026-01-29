import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders marketplace brand and auth actions", () => {
  render(<App />);
  const brand = screen.getByText(/MultiVendor Marketplace/i);
  expect(brand).toBeInTheDocument();

  // As a guest, we should see login/register actions in the top nav.
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
});

