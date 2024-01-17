import { Typography } from "@mui/material";
import React from "react";
import AccountField from "./EditableField";
const AccountSettings = () => {
  const fieldArray = [
    {
      label: "User Name",
      type: "text",
      value: "Emman1320",
      pattern: /^[a-zA-Z0-9_]{3,20}$/,
      tooltip: (
        <ul style={{ margin: "5px", padding: "0 5px" }}>
          <li>Minimum 3 characters</li>
          <li>Maximum 20 characters</li>
          <li>Shouldn't contain special characters except underscore ( _ )</li>
        </ul>
      ),
    },
    // {
    //   label: "Password",
    //   type: "password",
    //   value: "dscsocjsdiocjdiocjwdeiocj",
    //   pattern:
    //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?#&-_])[A-Za-z\d@$#!%*?&-_]{8,}$/,
    //   tooltip: (
    //     <ul style={{ margin: "5px", padding: "0 10px" }}>
    //       <li>Minimum 8 characters</li>
    //       <li>
    //         Must contain atleast a lowercase character, an uppercase character,
    //         a number and a special character(@$!%*?#&-_)
    //       </li>
    //     </ul>
    //   ),
    // },
  ];

  return (
    <div className="account-container">
      <Typography variant="h5" fontWeight="500">
        Account
      </Typography>
      <table className="account-details">
        <tbody>
          {fieldArray.map((field, index) => (
            <tr key={index}>
              <td width="150px">
                <label>{field.label}</label>
              </td>
              <td>
                <AccountField
                  pattern={field.pattern}
                  tooltip={field.tooltip}
                  type={field.type}
                  value={field.value}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountSettings;
