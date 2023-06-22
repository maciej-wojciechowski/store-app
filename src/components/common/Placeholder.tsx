import React, { type PropsWithChildren } from "react";

function Placeholder({ children }: PropsWithChildren) {
  return (
    <div className="flex h-[93vh] w-full items-center justify-center">
      {children}
    </div>
  );
}

export default Placeholder;
