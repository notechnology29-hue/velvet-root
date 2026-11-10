"use client";

import { useFormStatus } from "react-dom";

export function ApplicationSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="button-solid min-h-[56px] w-full disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Adding you…" : "Join the guest list"}
    </button>
  );
}
