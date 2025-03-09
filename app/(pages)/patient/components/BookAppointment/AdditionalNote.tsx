"use client";

import { Textarea } from "@nextui-org/react";

export function AdditionalNote({
  additionalNote,
  noteError,
  onChange,
}: AdditionalNoteProps) {
  return (
    <Textarea
      isRequired
      isInvalid={noteError !== ""}
      variant="bordered"
      label="Additional Note"
      placeholder="Enter your description"
      errorMessage={noteError}
      className="max-w-lg self-center mt-5"
      value={additionalNote}
      onChange={onChange}
    />
  );
}
