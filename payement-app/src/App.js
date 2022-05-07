import "./App.css";
import { Formik, Field } from "formik";
import { PaymentInputsWrapper, usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";

function App() {
  const {
    meta,
    getCardImageProps,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    wrapperProps,
  } = usePaymentInputs();

  return (
    <Formik
      initialValues={{
        cardHolder: "",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
      }}
      onSubmit={(data) => console.log(data)}
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
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col h-full w-1/2">
            <label className="text-xl font-bold mt-8">Credit Holder Name</label>
            <Field
              name="cardHolder"
              placeholder="John Smith"
              type="text"
              className="w-1/2 border-2 border-gray-400 rounded-md outline-white"
            />
            <label className="text-xl font-bold mt-8">
              Credit Card Details
            </label>
            <PaymentInputsWrapper className="w-1/2" {...wrapperProps}>
              <svg {...getCardImageProps({ images })} />
              <Field name="cardNumber">
                {({ field }) => (
                  <input
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
                    {...getCVCProps({
                      onBlur: field.onBlur,
                      onChange: field.onChange,
                    })}
                  />
                )}
              </Field>
            </PaymentInputsWrapper>
            <button
              className="w-1/2 border rounded-lg text-white bg-blue-500 mt-8 hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}

export default App;
