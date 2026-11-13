import { act, fireEvent, render, screen, within } from "@testing-library/react";
import axios from "axios";
import App from "./App";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
jest.mock("socket.io-client", () => ({
  io: () => ({ on: jest.fn(), disconnect: jest.fn() }),
}));

function tokenFor(role) {
  return "header." + btoa(JSON.stringify({ role, email: "qa@example.test" })) + ".signature";
}

function open(path, role) {
  window.history.replaceState({}, "", path);
  if (role) localStorage.setItem("token", tokenFor(role));
  render(<App />);
}

function navigation() {
  return within(screen.getAllByRole("navigation", { name: "التنقل الرئيسي" })[0]);
}

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  axios.get.mockImplementation((url) => Promise.resolve({
    data: url.endsWith("/balance") ? { balance: 20 } : [],
  }));
  window.matchMedia = jest.fn(() => ({ addEventListener: jest.fn(), removeEventListener: jest.fn() }));
  HTMLDialogElement.prototype.close = jest.fn();
});

test("redirects an anonymous visitor from a protected deep link to login", async () => {
  open("/allUser");
  expect(await screen.findByRole("button", { name: "تسجيل الدخول" })).toBeVisible();
  expect(window.location.pathname).toBe("/login");
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});

test.each([
  ["user", "/", "الخدمات"],
  ["user-point", "/HomePoint", "خدمات نقطة البيع"],
  ["admin", "/adminpending", "عمليات قيد الترحيل"],
])("logs in and routes %s to the correct home", async (role, path, title) => {
  axios.post.mockResolvedValueOnce({ data: { token: tokenFor(role), email: "qa@example.test" } });
  open("/login");
  await screen.findByRole("heading", { name: "PayNet" });
  fireEvent.change(screen.getByLabelText("اسم المستخدم"), { target: { value: "qa" } });
  fireEvent.change(screen.getByLabelText("كلمة المرور"), { target: { value: "password" } });
  fireEvent.click(screen.getByRole("button", { name: "تسجيل الدخول" }));
  expect(await screen.findByRole("heading", { level: 1, name: title })).toBeVisible();
  expect(window.location.pathname).toBe(path);
  expect(navigation().queryByRole("link", { name: "عرض المستخدمين" }) !== null).toBe(role === "admin");
});

test("rejects an admin deep link for an ordinary user", async () => {
  open("/allUser", "user");
  expect(await screen.findByRole("heading", { level: 1, name: "الخدمات" })).toBeVisible();
  expect(window.location.pathname).toBe("/");
  expect(navigation().queryByRole("link", { name: "عرض المستخدمين" })).not.toBeInTheDocument();
});

test("opens an admin deep link and highlights the current page", async () => {
  open("/allUser", "admin");
  expect(await screen.findByRole("heading", { name: "قائمة المستخدمين" })).toBeVisible();
  expect(navigation().getByRole("link", { name: "عرض المستخدمين" })).toHaveAttribute("aria-current", "page");
});

test("keeps the layout mounted while navigating and going back", async () => {
  open("/", "user");
  await screen.findByRole("heading", { level: 1, name: "الخدمات" });
  const header = screen.getByRole("banner");
  fireEvent.click(navigation().getByRole("link", { name: "البيان المالي" }));
  await screen.findByRole("heading", { level: 1, name: "البيان المالي" });
  expect(screen.getByRole("banner")).toBe(header);
  act(() => window.history.back());
  expect(await screen.findByRole("heading", { level: 1, name: "الخدمات" })).toBeVisible();
  expect(screen.getByRole("banner")).toBe(header);
});

test("shows an explicit missing page for an authenticated visitor", async () => {
  open("/missing-page", "user");
  expect(await screen.findByRole("heading", { name: "الصفحة غير موجودة" })).toBeVisible();
  expect(screen.getByRole("link", { name: "العودة إلى الرئيسية" })).toHaveAttribute("href", "/");
});

test("uses the existing payment catalog when a point selects landline service", async () => {
  open("/home-point", "user-point");
  expect(await screen.findByRole("heading", { name: "خدمات نقطة البيع" })).toBeVisible();
  expect(navigation().getByRole("link", { name: "الصفحة الرئيسية" })).toHaveAttribute("aria-current", "page");
  const service = screen.getByRole("heading", { name: "تسديد فواتير الارضي" }).closest(".service-card");
  expect(service).toHaveAttribute("href", "/internet");
  fireEvent.click(within(service).getByRole("heading"));
  expect(await screen.findByRole("link", { name: /تسديد فاتورة الارضي/ })).toHaveAttribute("href", "/payinternet");
});

test.each([true, false])("reports transfer results without duplicate requests (success: %s)", async (success) => {
  let finish;
  axios.post.mockReturnValueOnce(new Promise((resolve, reject) => {
    finish = () => success ? resolve({ data: {} }) : reject(new Error("offline"));
  }));

  open("/haram", "user");
  const submit = await screen.findByRole("button", { name: "تحويل" });
  const form = submit.closest("form");
  fireEvent.submit(form);
  fireEvent.submit(form);
  expect(submit).toBeDisabled();
  expect(submit).toHaveTextContent(/جاري التحويل/);
  expect(axios.post).toHaveBeenCalledTimes(1);

  await act(async () => finish());
  expect(await screen.findByText(success ? /تم تحويل الإشعار بنجاح/ : /تعذر تحويل الإشعار/)).toBeVisible();
  expect(submit).toBeEnabled();
});
