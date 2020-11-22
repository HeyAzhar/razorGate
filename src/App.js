import { useState } from "react";
import axios from "axios";
import NumberFormat from "react-number-format";

function App() {
  //---- defining states
  const [vendorIndex, setVendorIndex] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState({});
  //------

  //---- hard coded vendors data
  const vendor = [
    {
      account_type: "bank_account",
      bank_account: {
        name: "Ramesh Kumar",
        ifsc: "HDFC0001234",
        account_number: "1121431121541121",
      },
      contact: {
        name: "Ramesh Kumar",
        email: "ramesh.kumar@example.com",
        contact: "9876543210",
        type: "employee",
      },
    },
    {
      account_type: "bank_account",
      bank_account: {
        name: "Suresh Kumar",
        ifsc: "HDFC0001234",
        account_number: "1121431121541122",
      },
      contact: {
        name: "Suresh Kumar",
        email: "suresh.kumar@example.com",
        contact: "9876543211",
        type: "employee",
      },
    },
    {
      account_type: "bank_account",
      bank_account: {
        name: "Harish",
        ifsc: "HDFC0001234",
        account_number: "1121431121541122",
      },
      contact: {
        name: "Harish",
        email: "suresh.kumar@example.com",
        contact: "9876543211",
        type: "employee",
      },
    },
  ];
  //------

  //---- JSON for Razorpay API
  const json = {
    account_number: "2323230087768349",
    amount: amount * 100,
    currency: "INR",
    mode: "NEFT",
    purpose: "payout",
    fund_account: vendor[vendorIndex],
    queue_if_low_balance: true,
  };
  //------

  //---- Pay button / Payment function
  const pay = async (e) => {
    e.preventDefault();

    // Razorpay auth access
    const SECRET_KEY = "rzp_test_outGctzygO8PSc";
    const SECRET = "dJDxgmcTsILcnPfyV06hR8WM";

    await axios({
      method: "post",
      url: "/payouts",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      auth: {
        username: SECRET_KEY,
        password: SECRET,
      },
      data: JSON.stringify(json),
    })
      .then((res) => {
        const { data } = res;
        setData(data);
      })
      .catch((err) => console.log(err));

    // reset inputs
    setAmount("");
    setVendorIndex("");
  };
  //------

  //------ Rendering component
  return (
    <div className="app">
      <h1>RazorGate</h1>

      {/* vendor selector */}

      <div className="app__selectVendor">
        <label htmlFor="vendor">
          <p>Select Vendor:</p>
        </label>
        <select
          id="vendor"
          value={vendorIndex}
          onChange={(e) => setVendorIndex(e.target.value)}
        >
          <option value="">Select</option>
          {vendor.map((v, i) => (
            <option key={v.contact.contact} value={i}>
              {v.contact.name}
            </option>
          ))}
        </select>
      </div>

      {/* Vendor details or Message */}

      <div className="app__placeholder">
        {vendorIndex !== "" && (
          <div className="app__vendorDetails">
            <p>
              <b>Name : </b>
              {vendor[vendorIndex].contact.name}
            </p>
            <p>
              <b>Contact : </b>
              {vendor[vendorIndex].contact.contact}
            </p>
            <p>
              <b>AC Number : </b>
              {vendor[vendorIndex].bank_account.account_number}
            </p>
          </div>
        )}
        {data.status && vendorIndex === "" && (
          <div className="app__msg">
            {data.status === "processing" ? (
              <p>
                The payment with <b>{data.amount / 100} Rs.</b> to
                <b> {data.fund_account.contact.name}</b>, has been initiated
                successfully.
              </p>
            ) : (
              ""
            )}
          </div>
        )}
      </div>

      {/* amount input */}

      <div className="app__amount">
        <label htmlFor="amount">
          <p>Enter amount: </p>
        </label>
        <NumberFormat
          thousandSeparator={true}
          thousandsGroupStyle="lakh"
          decimalScale="2"
          fixedDecimalScale={true}
          prefix={"₹"}
          inputMode="numeric"
          value={amount}
          onValueChange={(values) => setAmount(values.value)}
        />
      </div>

      <button
        disabled={vendorIndex === "" || amount === "" ? true : false}
        onClick={pay}
      >
        PAY
      </button>
    </div>
  );
}

export default App;
