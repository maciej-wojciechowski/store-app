import React from "react";
import { api } from "~/utils/api";
import { useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";

type Inputs = {
  name: string;
  password: string;
  email: string;
};

const Register = () => {
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const registerUser = api.user.register.useMutation({
    onSuccess: async () => {
      await signIn("credentials", {
        callbackUrl: "login",
      });
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    registerUser.mutate(data);
  };
  return (
    <div>
      <form onSubmit={void handleSubmit(onSubmit)} className="flex flex-col">
        <input
          placeholder="name"
          {...registerForm("name", { required: true })}
        />
        <input
          placeholder="email"
          type="email"
          {...registerForm("email", { required: true })}
        />
        <input
          placeholder="password"
          type="password"
          {...registerForm("password", { required: true })}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
