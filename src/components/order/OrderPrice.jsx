import { Row, Col, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

const OrderPrice = ({ isInCart }) => {

  const cart = useSelector((state) => state.cart);

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const displayPrice = isInCart ? cart.preTaxPrice : cart.totalPrice;

  return (
    <>

      <ListGroup.Item>

        <Row>

          <Col>
            Subtotal <br />({cart.itemsNumberText})
          </Col>

          <Col className="text-end">
            {formatPrice(cart.itemsPrice)}
          </Col>

        </Row>

      </ListGroup.Item>


      <ListGroup.Item>

        <Row>

          <Col>Shipping</Col>

          <Col className="text-end">
            {cart.shippingPrice > 0
              ? formatPrice(cart.shippingPrice)
              : "Free"}
          </Col>

        </Row>

      </ListGroup.Item>


      <ListGroup.Item>

        <Row>

          <Col>Tax</Col>

          <Col className="text-end">
            {isInCart ? (
              <span className="text-black-50">
                Calculated at checkout
              </span>
            ) : (
              formatPrice(cart.taxPrice)
            )}
          </Col>

        </Row>

      </ListGroup.Item>


      <ListGroup.Item>

        <Row className="fs-5 fw-bold">

          <Col>
            {isInCart ? "Estimated total" : "Total"}
          </Col>

          <Col className="text-end">
            {formatPrice(displayPrice)}
          </Col>

        </Row>

      </ListGroup.Item>

    </>
  );
};

export default OrderPrice;