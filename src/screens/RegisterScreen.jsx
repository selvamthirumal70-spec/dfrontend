import { useState, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
} from "react-bootstrap";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Loader from "../components/Loader";
import signUpImg from "../assets/sign-up.png";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { setCredentials } from "../slices/authSlice";
import { useRegisterMutation } from "../slices/usersApiSlice";

import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] =
    useRegisterMutation();

  const { userInfo } = useSelector(
    (state) => state.auth
  );

  const { search } = useLocation();

  const redirect =
    new URLSearchParams(search).get("redirect") || "/";

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // ==========================================
  // USER ALREADY LOGIN
  // ==========================================

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  // ==========================================
  // PASSWORD VALIDATION
  // ==========================================

  useEffect(() => {
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage("");
    }
  }, [form.password, form.confirmPassword]);

  // ==========================================
  // REGISTER SUBMIT
  // ==========================================

  const submitHandler = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const registerData = {
        name: form.name,
        email: form.email,
        password: form.password,
      };

      const res = await register(
        registerData
      ).unwrap();

      dispatch(
        setCredentials({
          ...res,
        })
      );

      toast.success("Registration successful");

      navigate(redirect);
    } catch (error) {
      console.log("REGISTER ERROR:", error);

      let message = "Registration failed";

      if (
        typeof error?.data?.message === "string"
      ) {
        message = error.data.message;
      } else if (
        typeof error?.data === "string"
      ) {
        message = error.data;
      } else if (
        typeof error?.error === "string"
      ) {
        message = error.error;
      } else if (
        typeof error?.message === "string"
      ) {
        message = error.message;
      }

      toast.error(message);
    }
  };

  // ==========================================
  // FORM VALIDATION
  // ==========================================

  const isFormInvalid =
    isLoading ||
    Boolean(errorMessage) ||
    !form.name ||
    !form.email ||
    !form.password ||
    !form.confirmPassword;

  return (
    <Container>
      <Row className="justify-content-md-center py-5 my-3">
        <Col
          xs={12}
          md={6}
          lg={5}
          xl={4}
        >
          <Card
            className="pt-3 pb-4 px-4 rounded shadow"
            border="light"
          >
            <PageTitle title="Sign Up" />

            <Form
              onSubmit={submitHandler}
              className="d-grid"
            >
              {/* USER NAME */}

              <Form.Group controlId="username">
                <Form.Label>
                  User name
                </Form.Label>

                <Form.Control
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </Form.Group>

              {/* EMAIL */}

              <Form.Group
                controlId="email"
                className="mt-3"
              >
                <Form.Label>Email</Form.Label>

                <Form.Control
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </Form.Group>

              {/* PASSWORD */}

              <Form.Group
                controlId="password"
                className="mt-3"
              >
                <Form.Label>
                  Password
                </Form.Label>

                <Form.Control
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </Form.Group>

              {/* CONFIRM PASSWORD */}

              <Form.Group
                controlId="confirm-password"
                className="mt-3"
              >
                <Form.Label>
                  Confirm Password
                </Form.Label>

                <Form.Control
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </Form.Group>

              {/* ERROR MESSAGE */}

              {errorMessage && (
                <p className="mt-3 mb-0 text-danger">
                  {errorMessage}
                </p>
              )}

              {/* SUBMIT BUTTON */}

              <Button
                type="submit"
                variant="primary"
                className="mt-4 rounded-pill px-4"
                disabled={isFormInvalid}
              >
                {isLoading ? (
                  <>
                    <Loader />

                    <span className="ms-2">
                      Signing Up...
                    </span>
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </Button>
            </Form>

            <Row className="py-3">
              <Col>
                Already have an account?{" "}

                <Link
                  to={`/login?redirect=${encodeURIComponent(
                    redirect
                  )}`}
                  className="text-primary"
                >
                  Sign in
                </Link>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col
          xs={12}
          md={6}
          lg={5}
          xl={4}
          className="pt-5 text-center"
        >
          <img
            src={signUpImg}
            alt="a dog says join us now"
            width={380}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterScreen;