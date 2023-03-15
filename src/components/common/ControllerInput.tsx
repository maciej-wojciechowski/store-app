import { Input, type InputProps } from "antd";
import React, { useCallback } from "react";
import {
  Controller,
  type ControllerFieldState,
  type ControllerRenderProps,
  type ControllerProps,
} from "react-hook-form";

type Props = {
  controllerProps: Omit<ControllerProps<any>, "render">;
  inputProps?: InputProps;
  label?: string;
  type?: "password" | "search";
};

const ControllerInput = ({
  controllerProps,
  inputProps,
  type,
  label,
}: Props) => {
  const getInputComponent = useCallback(
    (
      field: ControllerRenderProps<any, string>,
      fieldState: ControllerFieldState
    ) => {
      let component: any = Input;
      if (type === "password") {
        component = Input.Password;
      }
      if (type === "search") {
        component = Input.Search;
      }

      return React.createElement(component, {
        ...inputProps,
        ...field,
        status: fieldState.invalid ? "error" : undefined,
      });
    },
    [type, inputProps]
  );

  return (
    <Controller
      {...controllerProps}
      render={({ field, fieldState }) => {
        return (
          <div className="relative min-h-[45px] w-full">
            {label ? (
              <label
                className="absolute right-[calc(100%+4px)] top-0 whitespace-nowrap"
                htmlFor={controllerProps.name}
              >
                {label + ":"}
              </label>
            ) : null}
            {getInputComponent(field, fieldState)}
            {fieldState.error?.message ? (
              <p className="text-sm text-red-500">
                {fieldState.error?.message}
              </p>
            ) : null}
          </div>
        );
      }}
    />
  );
};

export default ControllerInput;
