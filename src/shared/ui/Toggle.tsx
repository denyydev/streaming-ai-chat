import type { ButtonHTMLAttributes } from "react";

type ToggleProps = ButtonHTMLAttributes<HTMLButtonElement>;

function Toggle({ className = "", children, ...props }: ToggleProps) {
  return (
    <button
      type="button"
      className={`!inline-flex items-center justify-center select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Toggle;
