import { type Address } from "@prisma/client";
import { Button, Typography } from "antd";
import React, { type BaseSyntheticEvent } from "react";
import { type Control } from "react-hook-form";
import ControllerInput from "./common/ControllerInput";

export type AddressForm = Omit<Address, "id" | "userId">;

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
            rules: { required: "Required" },
          }}
        />
        <ControllerInput
          label="Street"
          controllerProps={{
            control,
            name: "street",
            rules: { required: "Required" },
          }}
        />
        <ControllerInput
          label="City"
          controllerProps={{
            control,
            name: "city",
            rules: { required: "Required" },
          }}
        />
        <ControllerInput
          label="Zip code"
          controllerProps={{
            control,
            name: "zip_code",
            rules: { required: "Required" },
          }}
        />
        <ControllerInput
          label="Phone"
          controllerProps={{
            control,
            name: "phone",
            rules: { required: "Required" },
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
