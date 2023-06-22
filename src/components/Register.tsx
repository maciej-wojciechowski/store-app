import React from "react";
import { api } from "~/utils/api";
import { useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Button, Typography } from "antd";
import ControllerInput from "./common/ControllerInput";

type Inputs = {
  name: string;
  password: string;
  email: string;
};

const Register = () => {
  const { control, handleSubmit } = useForm<Inputs>();

  const registerUser = api.user.register.useMutation({
    onSuccess: async () => {
      await signIn();
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data, e) => {
    registerUser.mutate(data);
  };
  return (
    <div className="flex h-[90vh] flex-col items-center justify-center">
      <Typography.Title className="text-center">
        Register new user
      </Typography.Title>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex flex-col">
        <ControllerInput
          label="Name"
          controllerProps={{
            name: "name",
            control: control,
            rules: {
              required: "Required",
              minLength: {
                value: 6,
                message: "Must be minimum 6 characters",
              },
            },
          }}
        />
        <ControllerInput
          label="Email"
          controllerProps={{
            name: "email",
            control: control,
            rules: {
              required: "Required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            },
          }}
          inputProps={{
            placeholder: "Example@example.com",
          }}
        />
        <ControllerInput
          label="Password"
          controllerProps={{
            name: "password",
            control: control,
            rules: {
              required: "Required",
              minLength: {
                value: 6,
                message: "Must be minimum 6 characters",
              },
            },
          }}
          type="password"
        />
        <Button htmlType="submit">Register</Button>
      </form>
    </div>
  );
};

export default Register;
