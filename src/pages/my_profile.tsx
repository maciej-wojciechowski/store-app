import { type Address } from "@prisma/client";
import { Button } from "antd";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import ControllerInput from "~/components/common/ControllerInput";
import { api } from "~/utils/api";

type AddressForm = Omit<Address, "id" | "userId">;

const MyProfile: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { handleSubmit, control } = useForm<AddressForm>();

  const createOrUpdateAddress = api.user.createOrUpdateAddress.useMutation();

  const onSubmit = (data: AddressForm) => {
    console.log({ data, sessionData }, sessionData?.user.id);
    if (!sessionData?.user.id) {
      throw new Error("user not present");
    }
    createOrUpdateAddress.mutate({
      userId: sessionData.user.id,
      addressData: data,
    });
  };

  if (!sessionData?.user) {
    return <div>{"You're not logged in"}</div>;
  }

  return (
    <div className="h-90vh flex flex-col items-center">
      <h4>My profile</h4>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <h6>Address</h6>
        <ControllerInput
          label="House / Flat Number"
          controllerProps={{
            control,
            name: "house_number",
          }}
        />
        <ControllerInput
          label="Street"
          controllerProps={{
            control,
            name: "street",
          }}
        />
        <ControllerInput
          label="City"
          controllerProps={{
            control,
            name: "city",
          }}
        />
        <ControllerInput
          label="Zip code"
          controllerProps={{
            control,
            name: "zip_code",
          }}
        />
        <ControllerInput
          label="Phone"
          controllerProps={{
            control,
            name: "phone",
          }}
        />
        <Button htmlType="submit">Update address</Button>
      </form>
    </div>
  );
};

export default MyProfile;
