import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Input from "../Input";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../../slices/cartSlice";

const OrderShipping = () => {

  const cart = useSelector((state) => state.cart);
  const { shippingAddress = {} } = cart;

  const userInfo = useSelector((state) => state.auth?.userInfo) || {};
  const defaultAddress = userInfo.shippingAddress || {};

  const [enteredValues, setEnteredValues] = useState({
    firstName: shippingAddress?.firstName || defaultAddress?.firstName || "",
    lastName: shippingAddress?.lastName || defaultAddress?.lastName || "",
    address: shippingAddress?.address || defaultAddress?.address || "",
    city: shippingAddress?.city || defaultAddress?.city || "",
    postalCode: shippingAddress?.postalCode || defaultAddress?.postalCode || "",
    country: shippingAddress?.country || defaultAddress?.country || "India",
  });

  const [isSaved, setIsSaved] = useState(shippingAddress?.isSaved || false);

  const dispatch = useDispatch();

  // Label formatter
  const getLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const inputChangeHandler = (key, value) => {
    setEnteredValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ ...enteredValues, isSaved: true }));
    setIsSaved(true);
  };

  const editHandler = () => {
    dispatch(saveShippingAddress({ ...shippingAddress, isSaved: false }));
    setIsSaved(false);
  };

  const isFormInvalid = Object.values(enteredValues).some((val) => val === "");

  return (
    <>
      {isSaved ? (
        <>
          <Row>
            {Object.keys(enteredValues).map((key) => (
              <Col md={6} key={`entered${key}`} className="mb-2">
                <span className="fw-bold text-black-50">
                  {getLabel(key) + ": "}
                </span>
                {enteredValues[key]}
              </Col>
            ))}
          </Row>

          <div className="ms-auto d-flex">
            <Button
              variant="outline-primary"
              size="sm"
              className="rounded-pill px-4 ms-auto"
              onClick={editHandler}
            >
              Edit
            </Button>
          </div>
        </>
      ) : (
        <Form onSubmit={submitHandler}>

          <Row>
            {Object.keys(enteredValues).map((key) => (
              <Col md={6} key={key}>
                <Input
                  as={Col}
                  label={getLabel(key)}
                  controlId={key}
                  type="text"
                  value={enteredValues[key]}
                  onChange={(event) =>
                    inputChangeHandler(key, event.target.value)
                  }
                  required
                  error="required"
                />
              </Col>
            ))}
          </Row>

          <div className="ms-auto d-flex">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="rounded-pill px-4 ms-auto"
              disabled={isFormInvalid}
            >
              Save
            </Button>
          </div>

        </Form>
      )}
    </>
  );
};

export default OrderShipping;