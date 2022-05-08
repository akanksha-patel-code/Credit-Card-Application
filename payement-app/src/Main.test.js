import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import { Main } from "./Main";

const queryClient = new QueryClient();

const server = setupServer(
  rest.post(
    `https://run.mocky.io/v3/0b14a8da-5fc7-4443-8511-53d687399bc9`,
    (req, res, ctx) =>
      res(
        ctx.json([
          {
            success: true,
            data: {
              requestId: 38608,
              name: "Test",
              requestDate: 1522938824338,
            },
          },
        ])
      )
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it("should render card detail page on init correctly", () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
  expect(screen.getByTestId("Name Label")).toHaveTextContent(
    "Credit Holder Name"
  );
  expect(screen.getByTestId("Card Label")).toHaveTextContent(
    "Credit Card Details"
  );
  expect(screen.getByTestId("Submit Button")).toHaveTextContent("Submit");
});

it("should render card detail page with input values correctly", async () => {
	const { container } = render(
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
  userEvent.type(screen.getByTestId("Name Input"), "Akanksha Patel");
  userEvent.type(screen.getByTestId("CardNumber Input"), "4182 1000 0266 2104");
  userEvent.type(screen.getByTestId("ExpiryDate Input"), "02 / 23");
  userEvent.type(screen.getByTestId("CVC Input"), "027");
  userEvent.click(screen.getByTestId("Submit Button"));

  await waitFor(() => {
    expect(screen.getByTestId("Name Input")).toHaveValue("Akanksha Patel");
  });
  await waitFor(() => {
    expect(screen.getByTestId("CardNumber Input")).toHaveValue(
      "4182 1000 0266 2104"
    );
  });

  await waitFor(() => {
    expect(screen.getByTestId("ExpiryDate Input")).toHaveValue("02 / 23");
  });

  await waitFor(() => {
    expect(screen.getByTestId("CVC Input")).toHaveValue("027");
  });

  const message = screen.getByText(/Card details submitted successfully/i);
	expect(message).toBeInTheDocument();
});
