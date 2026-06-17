import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ScreenWrapper from "../components/ScreenWrapper";
import { Input } from "../components/Custom/Input";
import { Button } from "../components/Custom/Button";
import Alert from "../components/Custom/Alert";

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
      const res = await axios.post("https://paynet-1.onrender.com/api/payment/save-number/api/login", {
        email,
        password,
      });
      console.log(res.data);
      setError("");

      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("email", res.data.email);

      const payload = parseJwt(token);

      if (payload?.role === "admin") {
        navigate("/adminpending");
      } else {
        navigate("/");
      }
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper withNav={false}>
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4 rounded-lg border border-slate-200 bg-white px-5 py-8 shadow-lg transition-shadow duration-200"
          aria-busy={isSubmitting}
        >
          <h1 className="mb-8 text-center text-4xl font-bold tracking-wide text-violet-700">
            PayNet
          </h1>

          {error && <Alert type="error">{error}</Alert>}

          <Input
            id="login-email"
            name="email"
            label="اسم المستخدم"
            type="text"
            placeholder="Daher.Net"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-left"
            autoComplete="username"
            required
          />

          <Input
            id="login-password"
            name="password"
            label="كلمة المرور"
            type="password"
            placeholder="Daher.Net"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-left"
            autoComplete="current-password"
            required
          />

          <Button type="submit" className="mt-8 w-full" loading={isSubmitting}>
            {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </ScreenWrapper>
  );
}
