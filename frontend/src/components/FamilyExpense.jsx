import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"
const FamilyExpense = () => {
  const [familyCode, setFamilyCode] = useState("ABCD");
  const [inputCode, setInputCode] = useState("");
  const [isMasterOfFamily, setIsMasterOfFamily] = useState(true);
  const handleJoin = () => {
    setFamilyCode(inputCode);
  };
  const [familyMember, setFamilyMember] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("");

  useEffect(() => {
    const fetchUser = async()=>{
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/detail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": Cookies.get("token"),
            "x-session-id": Cookies.get("sessionId"),
          },
          body: JSON.stringify({
            name: familyMember
          }),
        }
      );
  
      if (response.ok) {
        const user = await response.json();
        console.log(user);
        // alert("userdata fetch successfully")
      } else {
        const error = await response.json();
        console.error(error.message);
        // Handle error, e.g., show a message to the user
      }
    } catch (error) {
      
    }
  }
  fetchUser();
  },[familyMember]);

  useEffect(() => {
    const fetchtransdata = async()=>{
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/detail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": Cookies.get("token"),
            "x-session-id": Cookies.get("sessionId"),
          },
          body: JSON.stringify({
            name: familyMember
          }),
        }
      );
  
      if (response.ok) {
        const user = await response.json();
        console.log(user);
        // alert("userdata fetch successfully")
      } else {
        const error = await response.json();
        console.error(error.message);
        // Handle error, e.g., show a message to the user
      }
    } catch (error) {
      
    }
  }
  fetchtransdata();
  },[familyMember]);
  return (
    <div>
      {familyCode === "" ? (
        <div className="flex">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter family code"
            required
            className="outline-none w-full text-xl bg-primaryBlack text-white p-3 border border-primaryGray rounded-lg"
          />
          <button
            onClick={handleJoin}
            className="py-2 px-6 ml-5 bg-primaryYellow text-xl rounded-lg text-nowrap"
          >
            Join Family
          </button>
        </div>
      ) : (
        <div>
          {!isMasterOfFamily ? (
            <div>
              Sorry, You Cant see any details becaure you are not the master of
              the family
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <select
                  name="type"
                  id="type"
                  value={familyMember}
                  onChange={(e) => setFamilyMember(e.target.value)}
                  className="shadow border p-2 w-full rounded bg-primaryBlack outline-none text-white text-2xl"
                  required
                >
                  <option value="all">All</option>
                  <option value="aryan">Aryan</option>
                  <option value="dhruv">Dhruv</option>
                  <option value="devesh">Devesh</option>
                  <option value="jagjit">Jagjit</option>
                </select>
              </div>
              <div className="flex gap-5">
                <span
                  className={`border px-3 py-1 text-2xl rounded-lg cursor-pointer ${
                    selectedMenu === "Transactions"
                      ? "bg-primaryYellow border-primaryYellow"
                      : "bg-primaryBlack text-white border-primaryGray"
                  }`}
                  onClick={() => setSelectedMenu("Transactions")}
                >
                  Transactions
                </span>
                <span
                  className={`border px-3 py-1 text-2xl rounded-lg cursor-pointer ${
                    selectedMenu === "Investment"
                      ? "bg-primaryYellow border-primaryYellow"
                      : "bg-primaryBlack text-white border-primaryGray"
                  }`}
                  onClick={() => setSelectedMenu("Investment")}
                >
                  Investment
                </span>
                <span
                  className={`border px-3 py-1 text-2xl rounded-lg cursor-pointer ${
                    selectedMenu === "Loans"
                      ? "bg-primaryYellow border-primaryYellow"
                      : "bg-primaryBlack text-white border-primaryGray"
                  }`}
                  onClick={() => setSelectedMenu("Loans")}
                >
                  Loans
                </span>
                <span
                  className={`border px-3 py-1 text-2xl rounded-lg cursor-pointer ${
                    selectedMenu === "Insurance"
                      ? "bg-primaryYellow border-primaryYellow"
                      : "bg-primaryBlack text-white border-primaryGray"
                  }`}
                  onClick={() => setSelectedMenu("Insurance")}
                >
                  Insurance
                </span>
              </div>
              <div>List</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyExpense;
