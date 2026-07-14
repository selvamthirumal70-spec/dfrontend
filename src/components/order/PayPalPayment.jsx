 
import { Button, ListGroup } from "react-bootstrap";
import { toast } from "react-toastify";

const RazorpayPayment = ({ order, onPaid }) => {

  const loadRazorpay = () => {

    const options = {
      key: "rzp_live_S2AKXydeqCgpQh",
      amount: order.totalPrice * 100,
      currency: "INR",
      name: "PetShop",
      description: "Order Payment",
      handler: function (response) {
        toast.success("Payment Successful");
        console.log(response);
        onPaid(); // mark order paid
      },
      prefill: {
        name: order.user?.name,
        email: order.user?.email,
      },
      theme: {
        color: "#ff6a00",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <ListGroup>
      <ListGroup.Item className="pt-3">
        <Button
          variant="success"
          className="btn-block rounded-pill px-4"
          onClick={loadRazorpay}
        >
          Pay with Razorpay
        </Button>
      </ListGroup.Item>

      <ListGroup.Item>
        <div>
          <small>TEST ONLY: Mark order as paid without Razorpay.</small>
        </div>
        <Button
          variant="outline-secondary"
          className="btn-block rounded-pill px-4 my-2"
          onClick={onPaid}
          size="sm"
        >
          Mark Order as Paid
        </Button>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default RazorpayPayment;
 
