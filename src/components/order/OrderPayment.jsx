import { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { savePaymentMethod } from "../../slices/cartSlice";

const OrderPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isSaved, setIsSaved] = useState(false);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    setIsSaved(true);
  };

  return (
    <>
      {isSaved ? (
        <div>
          <p>
            <span className="fw-bold text-black-50">Saved Method: </span>
            {paymentMethod}
          </p>

          <div className="d-flex">
            <Button
              variant="outline-primary"
              size="sm"
              className="rounded-pill px-4 ms-auto"
              onClick={() => setIsSaved(false)}
            >
              Edit
            </Button>
          </div>
        </div>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group>

            <Col>
              <Form.Check
                className="my-2"
                type="radio"
                label="UPI"
                id="UPI"
                name="paymentMethod"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Col>

            <Col>
              <Form.Check
                className="my-2"
                type="radio"
                label="Debit / Credit Card"
                id="Card"
                name="paymentMethod"
                value="Card"
                checked={paymentMethod === "Card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Col>

            <Col>
              <Form.Check
                className="my-2"
                type="radio"
                label="Cash on Delivery"
                id="COD"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Col>

          </Form.Group>

          <div className="d-flex">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="rounded-pill px-4 ms-auto"
            >
              Save
            </Button>
          </div>
        </Form>
      )}
    </>
  );
};

export default OrderPayment;