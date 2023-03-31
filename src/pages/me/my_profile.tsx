import { Typography } from "antd";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Address, { type AddressForm } from "~/components/Address";
import { api } from "~/utils/api";
import { myNotification } from "~/utils/notification";

const MyProfile: NextPage = () => {
  const { data: sessionData } = useSession();

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
      <Address
        isDirty={isDirty}
        control={control}
        handleSubmitPromise={handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default MyProfile;
