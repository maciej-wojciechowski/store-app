import { type Address } from "@prisma/client";
import { Button, Typography } from "antd";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ControllerInput from "~/components/common/ControllerInput";
import { api } from "~/utils/api";
import { myNotification } from "~/utils/notification";

type AddressForm = Omit<Address, "id" | "userId">;

const MyProfile: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset: resetForm,
    formState: { dirtyFields, isDirty },
  } = useForm<AddressForm>();

  const { data: userData } = api.user.getUserProfile.useQuery(
    { userId: sessionData?.user.id ?? "" },
    { enabled: !!sessionData?.user }
  );

  useEffect(() => {
    if (userData) {
      resetForm(userData);
    }
  }, [userData, resetForm]);

  const createOrUpdateAddress = api.user.createOrUpdateAddress.useMutation({
    onSuccess: () => {
      myNotification.success({ message: "Address updated" });
    },
  });

  const onSubmit = (data: AddressForm) => {
    if (!sessionData?.user.id) {
      throw new Error("user not present");
    }
    const dataToSend: Partial<AddressForm> = {};
    Object.entries(dirtyFields).forEach(([k, v]) => {
      if (v) {
        dataToSend[k as keyof AddressForm] = data[k as keyof AddressForm];
      }
    });
    createOrUpdateAddress.mutate({
      userId: sessionData.user.id,
      addressData: dataToSend,
    });
  };

  if (!sessionData?.user) {
    return <div>{"You're not logged in"}</div>;
  }

  return (
    <div className="flex h-[90vh] flex-col items-center justify-center">
      <Typography.Title level={4}>My profile</Typography.Title>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
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
        <Button disabled={!isDirty} htmlType="submit">
          Update address
        </Button>
      </form>
    </div>
  );
};

export default MyProfile;
