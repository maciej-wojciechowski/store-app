import { Button, Typography, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  type RcFile,
  type UploadChangeParam,
  type UploadFile,
  type UploadProps,
} from "antd/es/upload";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Address, { type AddressForm } from "~/components/Address";
import { api } from "~/utils/api";
import { myNotification } from "~/utils/notification";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const AvatarForm = ({ userId }: { userId?: string }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<RcFile>();
  const [imageUrl, setImageUrl] = useState<string>();

  const uploadButton = (
    <div className="flex h-5 flex-col items-center justify-between">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <span>Choose avatar</span>
    </div>
  );

  const handleChange: UploadProps["onChange"] = ({
    file,
  }: UploadChangeParam<UploadFile>) => {
    if (file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (file.status === "done") {
      setFile(file.originFileObj as RcFile);
      // Get this url from response in real world.
      getBase64(file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
    if (file.status === "removed") {
      setImageUrl(undefined);
      setFile(undefined);
    }
  };

  async function sendAvatar(): Promise<void> {
    if (!file || !userId) {
      return;
    }
    const apiUrl = "/api/avatar/" + encodeURIComponent(userId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Upload
        showUploadList={false}
        maxCount={1}
        listType="picture-card"
        onChange={handleChange}
      >
        {imageUrl ? (
          <img src={imageUrl} className="mx-auto max-w-[50%]" alt="avatar" />
        ) : (
          uploadButton
        )}
      </Upload>
      {file && <Button onClick={() => void sendAvatar()}>Send avatar</Button>}
    </>
  );
};

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
    return <div>You&aposre not logged in</div>;
  }

  return (
    <div className="flex h-[90vh] flex-col items-center justify-center">
      <Typography.Title level={4}>My profile</Typography.Title>
      <div className="my-4">
        <AvatarForm userId={sessionData?.user.id} />
      </div>
      <Address
        isDirty={isDirty}
        control={control}
        handleSubmitPromise={handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default MyProfile;
