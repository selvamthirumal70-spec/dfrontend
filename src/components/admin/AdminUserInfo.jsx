import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useDeleteUserMutation } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

const AdminUserInfo = ({ user }) => {
  const navigate = useNavigate();

  const shippingAddress = user?.shippingAddress;

  const [deleteUser] = useDeleteUserMutation();

  // ==========================================
  // GET SAFE ERROR MESSAGE
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

    return "Failed to delete user";
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = async () => {
    if (!user?._id) {
      toast.error("User ID not found");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await deleteUser(user._id).unwrap();

      toast.success("User deleted successfully");

      navigate("/admin/users");
    } catch (error) {
      console.error("DELETE USER ERROR:", error);

      toast.error(getErrorMessage(error));
    }
  };

  // ==========================================
  // USER NOT FOUND
  // ==========================================

  if (!user) {
    return (
      <Card className="user-info p-4">
        <p className="text-danger mb-0">
          User information not found
        </p>
      </Card>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <Card className="user-info p-4">
      <div className="user-avatar">
        <FaUserCircle
          size={96}
          className="user-icon"
        />

        {user?.isAdmin && (
          <div className="admin-label">
            Admin
          </div>
        )}
      </div>

      <label>User name</label>

      <p>{user?.name || "N/A"}</p>

      <label>Email</label>

      <p>{user?.email || "N/A"}</p>

      <label>User ID</label>

      <p>{user?._id || "N/A"}</p>

      {shippingAddress && (
        <>
          <label>Shipping Address</label>

          <p>
            {shippingAddress?.firstName || ""}{" "}
            {shippingAddress?.lastName || ""}

            <br />

            {shippingAddress?.address || ""}

            {shippingAddress?.city &&
              `, ${shippingAddress.city}`}

            {shippingAddress?.postalCode &&
              `, ${shippingAddress.postalCode}`}

            {shippingAddress?.country &&
              `, ${shippingAddress.country}`}
          </p>
        </>
      )}

      {!user?.isAdmin && (
        <Button
          variant="outline-danger"
          className="rounded-pill mt-2"
          size="sm"
          onClick={handleDeleteUser}
        >
          Delete User
        </Button>
      )}
    </Card>
  );
};

export default AdminUserInfo;