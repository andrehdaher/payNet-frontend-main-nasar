import { render, screen } from "@testing-library/react";
import InquiryResult from "./InquiryResult";

describe("InquiryResult", () => {
  test("renders CUSTOMER_NOT_FOUND as a not-found result instead of the initial empty state", () => {
    render(
      <InquiryResult
        data={{ status: "CUSTOMER_NOT_FOUND" }}
        isWaiting={false}
        selectedCompany="ليما"
        landline="4737667"
        onNewInquiry={jest.fn()}
        onPay={jest.fn()}
      />,
    );

    expect(
      screen.getByText("لم يتم العثور على المشترك، يرجى التأكد من الرقم والمحاولة مجددًا."),
    ).toBeInTheDocument();
    expect(screen.getByText("4737667")).toBeInTheDocument();
    expect(screen.queryByText("جاهز للاستعلام")).not.toBeInTheDocument();
    expect(screen.queryByText("تعذر تنفيذ الاستعلام")).not.toBeInTheDocument();
  });
});
