import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ScreenWrapper from "../components/ScreenWrapper";
import { Card, CardContent, CardHeader } from "../components/Custom/Card";
import { Input } from "../components/Custom/Input";
import { Button } from "../components/Custom/Button";
import { useLocation } from "react-router-dom";
import { internetDetails } from "../components/payInternet/internetDetails";

export default function PayInternet() {
  const vantaRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [landline, setLandline] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSpeed, setSelectedSpeed] = useState("");
  const [amountToPay, setAmountToPay] = useState("");
  const [paymentType, setPaymentType] = useState("cash"); // Ø§Ù„Ù‚ÙŠÙ…Ø© Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠØ© Ù†Ù‚Ø¯Ø§Ù‹
  const location = useLocation()
  const formType = location.state
  const config = internetDetails[formType] || {};



  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));

    } catch (e) {
      return null;
    }
  }

  const multiplier = config.multiplier;
  const calculatedAmount = amountToPay ? (amountToPay * multiplier).toFixed(2) : "";


  const inputs = [
    {
      id: "landline",
      label: config.label,
      type: "number",
      value: landline,
      onChange: setLandline,
    },
    {
      id: '1'
    },
    {
      id: "2"
    },
    {
      id: "amountToPay",
      label: ['Ø´Ø­Ù† ÙŠØ¯ÙˆÙŠ jawaker'].includes(config.title) ? "Ø§Ø¯Ø®Ù„ Ø§Ù„ÙƒÙ…ÙŠØ© Ø§Ù„ØªÙŠ ØªØ±ÙŠØ¯ Ø´Ø­Ù†Ù‡Ø§" : "Ø§Ù„Ù…Ø¨Ù„Øº Ø§Ù„Ù…Ø±Ø§Ø¯ ØªØ³Ø¯ÙŠØ¯Ù‡",
      type: "number",
      value: amountToPay,
      onChange: setAmountToPay,
      min: config.min
    },
    {
      id: "calculatedAmount",
      label: "Ø§Ù„Ù…Ø¨Ù„Øº Ø§Ù„Ù…Ø·Ù„ÙˆØ¨",
      type: "number",
      value: calculatedAmount,
      readOnly: true,
    },
  ];
  const isFormValid =
    landline && selectedCompany && (selectedSpeed || ['PHONE', 'SYR', 'MTN'].includes(formType)) && amountToPay;

  const companies = config.companies || [];
  const speeds = Array.isArray(config.speeds) ? config.speeds : [];
  const title = config.title || "";
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    const email = decoded?.email;


    try {
      const res = await axios.post(
        "https://paynet-1.onrender.com/api/payment/internet-full",
        {
          landline,
          company: selectedCompany,
          speed: selectedSpeed,
          amount: parseFloat(amountToPay),
          email,
          paymentType,
          calculatedAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("ØªÙ… Ø§Ù„ØªØ³Ø¯ÙŠØ¯ Ø¨Ù†Ø¬Ø§Ø­. Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ø¬Ø¯ÙŠØ¯: " + res.data.newBalance);


      // Ø¥Ø¹Ø§Ø¯Ø© ØªØ¹ÙŠÙŠÙ† Ø§Ù„Ø­Ù‚ÙˆÙ„
      setLandline("");
      setSelectedCompany("");
      setSelectedSpeed("");
      setAmountToPay("");
      // Ø¥Ø¹Ø§Ø¯Ø© ØªØ­Ù…ÙŠÙ„ Ø§Ù„ØµÙØ­Ø© Ø£Ùˆ ØªØ­Ø¯ÙŠØ« Ø§Ù„Ø­Ø§Ù„Ø© Ø­Ø³Ø¨ Ø§Ù„Ø­Ø§Ø¬Ø©
      window.location.reload();

    } catch (err) {
      alert(err.response?.data?.message || "Ø­Ø¯Ø« Ø®Ø·Ø£");
      // Ø§Ù„ØªÙˆÙƒÙ† ØºÙŠØ± ØµØ§Ù„Ø­ØŒ Ù†Ø³Ø¬Ù„ Ø§Ù„Ø®Ø±ÙˆØ¬
      localStorage.removeItem('token'); // Ø£Ùˆ Ø­Ø³Ø¨ ØªØ®Ø²ÙŠÙ†Ùƒ Ù„Ù„ØªÙˆÙƒÙ†
      window.location.href = '/login'; // Ø¥Ø¹Ø§Ø¯Ø© ØªÙˆØ¬ÙŠÙ‡ Ù„ØµÙØ­Ø© ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (['PHONE', 'PAYCELL', 'USDTTRC20', 'USDTBEB20', 'SYR', 'MTN', 'pubg', 'pubgtr', 'freefire', 'ballpool8', 'clashclans', 'clashroyal', 'jawakerman', 'jawaker', 'knivesout', 'ludoking', 'mobilelegend', 'projectentropy', 'whithoutsurvivial'].includes(formType)) { setSelectedSpeed('0') }
  }, [])

  return (
    <ScreenWrapper className={'min-h-screen flex items-center justify-center p-4'}>
      <Card>
        <CardHeader>

          <h1 className="text-2xl">
            {title}
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 ">
            {/* Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù†ØµÙŠØ© */}
            <div className="grid grid-cols-2 gap-6">
              {inputs.map((input, idx) => (
                input.id == 1 ? <>
                  <div className="relative">
                    <label className="block mb-1 mr-3 text-sm font-medium text-foreground">
                      {config.description}
                    </label>
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="peer h-10 w-full text-foreground px-2 bg-foreground/10 border rounded-md border-foreground/50 outline-none"
                      required
                    >
                      {companies.map((company) => (
                        <option key={company} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
                  : input.id == 2 ? <>
                    {/* Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø³Ø±Ø¹Ø© Ø£Ùˆ Ø§Ù„Ø¹Ø¯Ø§Ø¯ */}
                    {(Array.isArray(config.speeds) && config.speeds.length > 0) || config.speeds === "counter" || config.speeds === 'mobilelegend' || config.speeds === 'BANKTR' ? (
                      config.speeds === "counter" || config.speeds === 'mobilelegend' || config.speeds === 'BANKTR' ? (
                        <Input
                          key={input.id}
                          id={input.id}
                          label={config.speeds === 'mobilelegend' ? 'ÙŠØ±Ø¬Ù‰ Ø§Ø¯Ø®Ø§Ù„ Zone ID' : config.speeds === 'BANKTR' ? "ÙŠØ±Ø¬Ù‰ Ø§Ø¯Ø®Ø§Ù„ Ø±Ù‚Ù… Ø§Ù„Ø­Ø³Ø§Ø¨" : 'Ø±Ù‚Ù… Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ / Ø§Ù„Ø¹Ø¯Ø§Ø¯'}
                          type={'number'}
                          value={selectedSpeed}
                          onChange={(e) => setSelectedSpeed(e.target.value)}
                          required
                        />
                      ) : (
                        <div className="relative col-span-2">
                          <label className="block mb-1 mr-3 text-sm font-medium text-foreground">
                            {formType == 'ADSL' ? 'Ø§Ø®ØªØ± Ø§Ù„Ø³Ø±Ø¹Ø©' : 'Ø§Ø®ØªØ± Ø§Ù„Ø¨Ø§Ù‚Ø©'}
                          </label>
                          <select
                            value={selectedSpeed}
                            onChange={(e) => setSelectedSpeed(e.target.value)}
                            className="peer h-10 w-full text-foreground px-2 bg-foreground/10 border rounded-md border-foreground/50 outline-none"
                            required
                          >
                            <option value="" disabled hidden></option>
                            {speeds.map((speed) => (
                              <option key={speed} value={speed}>
                                {speed}
                              </option>
                            ))}
                          </select>
                        </div>
                      )
                    ) : null}
                  </>
                    :
                    <Input
                      key={input.id}
                      id={input.id}
                      label={input.label}
                      type={input.type}
                      value={input.value}
                      onChange={(e) => input.onChange && input.onChange(e.target.value)}
                      readOnly={input.readOnly || false}
                      required={!input.readOnly}
                      min={input.min}
                    />
              ))}
            </div>

            {/* Ù†ÙˆØ¹ Ø§Ù„Ø¯ÙØ¹ */}
            <div className="">
              <label className="block mb-2 mr-3 text-sm font-medium text-foreground">
                Ù†ÙˆØ¹ Ø§Ù„Ø¯ÙØ¹
              </label>
              <div className="flex gap-2">
                <Button
                  type={'button'}
                  className={'w-1/2'}
                  onClick={() => {
                    setPaymentType('cash')
                  }}
                  variant={paymentType == 'cash' ? 'default' : 'outline'}
                >
                  Ù†Ù‚Ø¯Ø§
                </Button>
                <Button
                  type={'button'}
                  className={'w-1/2'}
                  onClick={() => {
                    setPaymentType('credit')
                  }}
                  variant={paymentType == 'credit' ? 'default' : 'outline'}
                >
                  Ø¯ÙŠÙ†
                </Button>
              </div>
            </div>

            {/* Ø²Ø± Ø§Ù„ØªØ³Ø¯ÙŠØ¯ */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold transition ${isFormValid
                ? "bg-violet-600 hover:bg-violet-700 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? "Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ³Ø¯ÙŠØ¯..." : "ØªØ³Ø¯ÙŠØ¯ Ø§Ù„ÙØ§ØªÙˆØ±Ø©"}
            </button>
          </form>
        </CardContent>
      </Card>
    </ScreenWrapper>
  );
}