import { useState } from "react";
import { Formik, Field } from "formik";
import { PaymentInputsWrapper, usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";
import axios from "axios";
import { useMutation } from "react-query";

import React from 'react'


export const Main = () => {
  const {
    meta,
    getCardImageProps,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    wrapperProps,
  } = usePaymentInputs();

  const [message, setMessage] = useState({ text: "", status: 0 });

  function validateUsername(value) {
    let error;
    if (!value) {
      error = "Card Holder name is required";
    }
    return error;
  }

  const creditCardMutation = useMutation(
    async (data) =>
      axios.post(
        `https://run.mocky.io/v3/0b14a8da-5fc7-4443-8511-53d687399bc9`,
        {
          cardNo: data.cardNumber,
          cvv: data.cvc,
          expiryMonth: data.expiryDate.split("/")[0].trim(),
          expiryYear: data.expiryDate.split("/")[1].trim(),
          name: data.cardHolder,
        }
      ),
    {
      onSuccess: (response) => {
        setMessage({
          text: "Card details submitted successfully",
          status: response.status,
        });
      },
      onError: (error) => {
        setMessage({ text: "Error submitting card details", status: error.status });
      },
    }
  );

  return (
    <Formik
      initialValues={{
        cardHolder: "",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
      }}
      onSubmit={(data) => creditCardMutation.mutate(data)}
      validate={() => {
        let errors = {};
        if (meta.erroredInputs.cardNumber) {
          errors.cardNumber = meta.erroredInputs.cardNumber;
        }
        if (meta.erroredInputs.expiryDate) {
          errors.expiryDate = meta.erroredInputs.expiryDate;
        }
        if (meta.erroredInputs.cvc) {
          errors.cvc = meta.erroredInputs.cvc;
        }
        return errors;
      }}
    >
      {({ handleSubmit, errors, touched }) => (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <div className="flex justify-center items-center flex-col">
              <label data-testid="Name Label" className="text-xl font-bold mt-8">
                Credit Holder Name
              </label>
              <Field
                name="cardHolder"
                placeholder="John Smith"
                type="text"
                data-testid="Name Input"
                className="w-1/4 border-2 border-gray-400 rounded-md outline-white"
                validate={validateUsername}
              />
              {errors.cardHolder && touched.cardHolder && (
                <div className="text-red-700 text-xs flex-none">
                  {errors.cardHolder}
                </div>
              )}
              <label data-testid="Card Label" className="text-xl font-bold mt-8">
                Credit Card Details
              </label>
              <PaymentInputsWrapper
                className="w-1/4 justify-center flex items-center"
                {...wrapperProps}
              >
                <svg {...getCardImageProps({ images })} />
                <Field name="cardNumber">
                  {({ field }) => (
                    <input
                    data-testid="CardNumber Input"
                      {...getCardNumberProps({
                        onBlur: field.onBlur,
                        onChange: field.onChange,
                      })}
                    />
                  )}
                </Field>
                <Field name="expiryDate">
                  {({ field }) => (
                    <input
                    data-testid="ExpiryDate Input"
                      {...getExpiryDateProps({
                        onBlur: field.onBlur,
                        onChange: field.onChange,
                      })}
                    />
                  )}
                </Field>
                <Field name="cvc">
                  {({ field }) => (
                    <input
                    data-testid="CVC Input"
                      {...getCVCProps({
                        onBlur: field.onBlur,
                        onChange: field.onChange,
                      })}
                    />
                  )}
                </Field>
              </PaymentInputsWrapper>
              <button
                data-testid="Submit Button"
                className="w-1/6 py-2 border rounded-lg text-white bg-blue-500 mt-8 hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500"
                type="submit"
              >
                Submit
              </button>

              {message.status !== 0 &&
                (message.status === 200 ? (
                  <div className="text-blue-500 mt-6">{message.text}</div>
                ) : (
                  <div className="text-red-700 mt-6">{message.text}</div>
                ))}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
}

export default Main;
