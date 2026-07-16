import { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

import Input from "../Input";
import ImageContainer from "../ImageContainer";

import {
  useCreateProductMutation,
  useUploadProductImageMutation,
  useUpdateProductMutation,
} from "../../slices/productsApiSlice";

import {
  DEFAULT_IMAGE,
  CATEGORY_TYPES,
} from "../../constants";

import { toast } from "react-toastify";

const ProductModal = ({
  show,
  isCreate,
  onHide,
  product,
}) => {
  const [image, setImage] = useState(DEFAULT_IMAGE);

  const [enteredValues, setEnteredValues] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
    countInStock: 0,
    image: DEFAULT_IMAGE,
    isPublished: false,
    isOnSale: false,
    salePrice: 0,
    isPopular: false,
  });

  const [validated, setValidated] = useState(false);

  // ==========================================
  // ERROR MESSAGE HELPER
  // ==========================================

  const getErrorMessage = (error) => {
    if (!error) {
      return "Something went wrong";
    }

    if (typeof error === "string") {
      return error;
    }

    if (typeof error?.data?.message === "string") {
      return error.data.message;
    }

    if (typeof error?.data?.error === "string") {
      return error.data.error;
    }

    if (typeof error?.data === "string") {
      return error.data;
    }

    if (typeof error?.error === "string") {
      return error.error;
    }

    if (typeof error?.message === "string") {
      return error.message;
    }

    return "Something went wrong";
  };

  // ==========================================
  // PRODUCT DATA
  // ==========================================

  useEffect(() => {
    if (product && !isCreate) {
      setEnteredValues({
        name: product?.name || "",
        price: product?.price || 0,
        category: product?.category || "",
        description: product?.description || "",
        countInStock: product?.countInStock || 0,
        image: product?.image || DEFAULT_IMAGE,
        isPublished: Boolean(product?.isPublished),
        isOnSale: Boolean(product?.isOnSale),
        salePrice: product?.salePrice || 0,
        isPopular: Boolean(product?.isPopular),
      });

      setImage(product?.image || DEFAULT_IMAGE);
    }
  }, [product, isCreate]);

  // ==========================================
  // API MUTATIONS
  // ==========================================

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [
    uploadProductImage,
    { isLoading: loadingUpload },
  ] = useUploadProductImageMutation();

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleInputChange = (identifier, value) => {
    setEnteredValues((prevValues) => ({
      ...prevValues,
      [identifier]: value,
    }));
  };

  // ==========================================
  // FILE UPLOAD
  // ==========================================

  const fileUploadHandler = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const fileURL = URL.createObjectURL(file);

    setImage(fileURL);

    const formData = new FormData();

    formData.append("image", file);

    try {
      const res = await uploadProductImage(
        formData
      ).unwrap();

      const successMessage =
        typeof res?.message === "string"
          ? res.message
          : "Image uploaded successfully";

      toast.success(successMessage);

      // IMPORTANT:
      // backend returns `image: /uploads/<filename>` (server path)
      // Ensure we store that exact backend path, so the preview and later list render correctly.
      if (typeof res?.image === "string" && res.image.trim().length > 0) {
        handleInputChange("image", res.image);
        setImage(res.image);
      }

    } catch (error) {
      console.error("IMAGE UPLOAD ERROR:", error);

      toast.error(getErrorMessage(error));
    } finally {
      URL.revokeObjectURL(fileURL);
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const submitHandler = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();

      setValidated(true);

      return;
    }

    setValidated(true);

    if (isCreate) {
      createProductHandler();
    } else {
      editProductHandler();
    }
  };

  // ==========================================
  // UPDATE PRODUCT
  // ==========================================

  const editProductHandler = async () => {
    if (!product?._id) {
      toast.error("Product ID not found");

      return;
    }

    try {
      const productData = {
        ...enteredValues,

        price: Number(enteredValues.price),

        countInStock: Number(
          enteredValues.countInStock
        ),

        salePrice: Number(
          enteredValues.salePrice
        ),

        productId: product._id,
      };

      const res = await updateProduct(
        productData
      ).unwrap();

      const successMessage =
        typeof res?.message === "string"
          ? res.message
          : "Product updated successfully";

      toast.success(successMessage);

      onHide();

      clearForm();
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      toast.error(getErrorMessage(error));
    }
  };

  // ==========================================
  // CREATE PRODUCT
  // ==========================================

  const createProductHandler = async () => {
    try {
      const productData = {
        ...enteredValues,

        price: Number(enteredValues.price),

        countInStock: Number(
          enteredValues.countInStock
        ),

        salePrice: Number(
          enteredValues.salePrice
        ),
      };

      const res = await createProduct(
        productData
      ).unwrap();

      const successMessage =
        typeof res?.message === "string"
          ? res.message
          : "Product created successfully";

      toast.success(successMessage);

      onHide();

      clearForm();
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      toast.error(getErrorMessage(error));
    }
  };

  // ==========================================
  // CLEAR FORM
  // ==========================================

  const clearForm = () => {
    setEnteredValues({
      name: "",
      price: 0,
      category: "",
      description: "",
      countInStock: 0,
      image: DEFAULT_IMAGE,
      isPublished: false,
      isOnSale: false,
      salePrice: 0,
      isPopular: false,
    });

    setImage(DEFAULT_IMAGE);

    setValidated(false);
  };

  // ==========================================
  // DISABLE BUTTON
  // ==========================================

  const isDisabledBtn =
    loadingCreate ||
    loadingUpdate ||
    loadingUpload ||
    enteredValues.name.trim() === "" ||
    Number(enteredValues.price) <= 0 ||
    enteredValues.description.trim() === "" ||
    enteredValues.category === "";

  // ==========================================
  // UI
  // ==========================================

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isCreate
            ? "Create Product"
            : "Edit Product"}
        </Modal.Title>
      </Modal.Header>

      <Form
        noValidate
        validated={validated}
        onSubmit={submitHandler}
      >
        <Modal.Body>
          {!isCreate && (
            <p className="text-secondary fs-6 mb-4">
              ID: {product?._id || "N/A"}
            </p>
          )}

          <Row>
            <Col>
              <Input
                label="Name *"
                controlId="name"
                type="text"
                onChange={(event) =>
                  handleInputChange(
                    "name",
                    event.target.value
                  )
                }
                value={enteredValues.name}
                required
              />

              <Input
                label="Price *"
                controlId="price"
                type="number"
                placeholder="0.00"
                onChange={(event) =>
                  handleInputChange(
                    "price",
                    event.target.value
                  )
                }
                value={enteredValues.price}
                required
              />
            </Col>

            <Col>
              <Form.Check
                type="switch"
                id="isPublished"
                label="is Published"
                checked={enteredValues.isPublished}
                className="mb-2 published-switch"
                onChange={(event) =>
                  handleInputChange(
                    "isPublished",
                    event.target.checked
                  )
                }
              />

              <Form.Check
                type="switch"
                id="isPopular"
                label="is Popular"
                className="popular-switch"
                checked={enteredValues.isPopular}
                onChange={(event) =>
                  handleInputChange(
                    "isPopular",
                    event.target.checked
                  )
                }
              />

              <Form.Check
                type="switch"
                id="isOnSale"
                label="is On Sale"
                checked={enteredValues.isOnSale}
                onChange={(event) =>
                  handleInputChange(
                    "isOnSale",
                    event.target.checked
                  )
                }
              />

              <Input
                label="Sale price"
                controlId="salePrice"
                type="number"
                placeholder="0.00"
                disabled={!enteredValues.isOnSale}
                onChange={(event) =>
                  handleInputChange(
                    "salePrice",
                    event.target.value
                  )
                }
                value={enteredValues.salePrice}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Input
                label="Count in Stock *"
                controlId="countInStock"
                type="number"
                onChange={(event) =>
                  handleInputChange(
                    "countInStock",
                    event.target.value
                  )
                }
                value={enteredValues.countInStock}
                required
              />
            </Col>

            <Col>
              <Form.Label>
                <small className="text-black-50 fw-bold">
                  Category *
                </small>
              </Form.Label>

              <div key="inline-radio">
                {CATEGORY_TYPES.map((category) => (
                  <Form.Check
                    inline
                    key={category}
                    label={category}
                    name="category"
                    type="radio"
                    className="text-capitalize"
                    id={category}
                    value={category}
                    checked={
                      enteredValues.category ===
                      category
                    }
                    onChange={(event) =>
                      handleInputChange(
                        "category",
                        event.target.value
                      )
                    }
                  />
                ))}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <Input
                label="Image"
                controlId="image"
                type="file"
                onChange={fileUploadHandler}
                accept="image/*"
                disabled={loadingUpload}
              />

              <ImageContainer
                src={image || DEFAULT_IMAGE}
                size="200px"
                alt="upload image"
                borderRadius="4px"
              />
            </Col>

            <Col>
              <Input
                label="Description *"
                controlId="description"
                type="text"
                inputAs="textarea"
                className="form-textarea"
                onChange={(event) =>
                  handleInputChange(
                    "description",
                    event.target.value
                  )
                }
                value={enteredValues.description}
                required
              />
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="submit"
            className="ms-auto px-5 rounded-pill"
            disabled={isDisabledBtn}
          >
            {loadingCreate ||
            loadingUpdate ||
            loadingUpload
              ? "Please wait..."
              : isCreate
              ? "Create"
              : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProductModal;