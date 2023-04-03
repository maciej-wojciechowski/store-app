import { type Address } from "@prisma/client";
import { Button, Typography } from "antd";
import React, { type BaseSyntheticEvent } from "react";
import { type Control } from "react-hook-form";
import ControllerInput from "./common/ControllerInput";

export type AddressForm = Omit<Address, "id" | "userId">;

const checkIsValidAddressNumber = (s: string) => {
  if (!s) {
    return false;
  }
  // if contains only numbers return true
  if (!/\D/.test(s)) {
    return true;
  }
  // if is a number followed by letters
  if (/^[0-9]+[a-zA-Z]+$/.test(s)) {
    return true;
  }
  return false;
};

const houseNumberValidation = (v: string) => {
  // check if is a number
  if (!isNaN(Number(v))) {
    return true;
  }
  // check if don't have slash - must be single address number
  if (!v.includes("/")) {
    if (!checkIsValidAddressNumber(v)) {
      return "Incorrect house number";
    }
    return true;
  }
  // check if have slash - must be house number and flat number
  const split = v.split("/");
  if (
    split.length !== 2 ||
    !checkIsValidAddressNumber(String(split[0])) ||
    !checkIsValidAddressNumber(String(split[1]))
  ) {
    return "House number or house number/flat number";
  }
};

type Props = {
  control: Control<AddressForm>;
  handleSubmitPromise?: (e: BaseSyntheticEvent) => Promise<void>;
  isDirty?: boolean;
  noBtn?: boolean;
};

function Address({ control, handleSubmitPromise, isDirty, noBtn }: Props) {
  return (
    <div>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form className="flex flex-col" onSubmit={handleSubmitPromise}>
        <Typography.Title level={5}>Address</Typography.Title>
        <ControllerInput
          label="House / Flat Number"
          controllerProps={{
            control,
            name: "house_number",
            rules: {
              required: "Required",
              validate: houseNumberValidation,
            },
          }}
        />
        <ControllerInput
          label="Street"
          controllerProps={{
            control,
            name: "street",
            rules: {
              required: "Required",
              pattern: {
                value: /^[a-zA-Z]+$/,
                message: "Must contain only letters",
              },
            },
          }}
        />

        <ControllerInput
          label="City"
          controllerProps={{
            control,
            name: "city",
            rules: {
              required: "Required",
              pattern: {
                value: /^[a-zA-Z]+$/,
                message: "Must contain only letters",
              },
            },
          }}
        />
        <ControllerInput
          label="Zip code"
          controllerProps={{
            control,
            name: "zip_code",
            rules: {
              required: "Required",
              pattern: {
                value: /^\d{2}-\d{3}$/,
                message: "Zip code must be in format 00-000",
              },
            },
          }}
        />
        <ControllerInput
          label="Phone"
          controllerProps={{
            control,
            name: "phone",
            rules: {
              required: "Required",
              pattern: {
                value: /^\d{9}$/,
                message: "Invalid phone number",
              },
            },
          }}
        />
        {noBtn ? null : (
          <Button disabled={!isDirty} className="mt-2" htmlType="submit">
            Update address
          </Button>
        )}
      </form>
    </div>
  );
}

export default Address;
