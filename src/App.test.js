import { render, screen } from "@testing-library/react";
import EmptyState from "./components/Custom/EmptyState";

test("renders shared empty state", () => {
  render(<EmptyState title="لا توجد بيانات" description="اختبار حالة فارغة" />);
  expect(screen.getByText("لا توجد بيانات")).toBeInTheDocument();
  expect(screen.getByText("اختبار حالة فارغة")).toBeInTheDocument();
});
