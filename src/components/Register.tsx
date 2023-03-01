import React from "react";
import { api } from "~/utils/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

type Inputs = {
  name: string;
  password: string;
  email: string;
};

type Props = {};

const Register = (props: Props) => {
  const router = useRouter();
  const {
    getValues,
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const registerUser = api.user.register.useMutation({
    onSuccess: async () => {
      const res: any = await signIn("credentials", {
        redirect: false,
        email: getValues().email,
        password: getValues().password,
      });
      console.log({ res });
      res.error ? console.log(res.error) : router.push("/");
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    registerUser.mutate(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
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
