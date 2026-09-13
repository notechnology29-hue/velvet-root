"use client";

import { useFormStatus } from "react-dom";

export function ApplicationSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="button-solid w-full min-h-[56px] rounded-2xl text-center disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Submitting..." : "Submit Membership Request"}
    </button>
  );
}
