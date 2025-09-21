import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RoleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role === "admin") {
      navigate("/adminpending");
    } else {
      navigate("/");
    }
  }, [navigate]);

  return null;
};

export default RoleRedirect;
