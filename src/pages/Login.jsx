import { PAYNET_BASE_URL } from "../api";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Custom/Input";
import { Button } from "../components/Custom/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `${PAYNET_BASE_URL}/api/login`,
        {
          email,
          password,
        },
      );
      setError("");

      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("email", res.data.email); // فقط إن كنت تستخدمه في أماكن أخرى

      const payload = parseJwt(token);

      if (payload?.role === "admin") {
        navigate("/adminpending");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <form
        onSubmit={handleSubmit}
        className="bg-card px-5 py-8 border border-border rounded-xl shadow-xl w-full max-w-md space-y-4"
      >
        <h1 className="text-4xl font-bold text-center text-violet-700 mb-8 tracking-wide">
          PayNet
        </h1>

        {error && <p role="alert" className="text-red-500 text-sm text-center">{error}</p>}
        <Input
          label={"اسم المستخدم"}
          id="login-email"
          autoComplete="username"
          dir="ltr"
          type="text"
          placeholder="Daher.Net"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-border text-left"
          required
          error={error}
        />

        <Input
          label={"كلمة المرور"}
          id="login-password"
          autoComplete="current-password"
          dir="ltr"
          type="password"
          placeholder="Daher.Net"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-border text-left"
          required
          error={error}
        />

        <Button type="submit" className="w-full mt-8">
          {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>
      </form>
  );
}
