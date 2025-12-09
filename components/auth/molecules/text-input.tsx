"use client";

import { Input } from "@/components/ui/input";
import { MailIcon, UserIcon } from "../atoms/icon";
import { cn } from "@/lib/utils";

interface TextInputProps extends React.ComponentProps<typeof Input> {
  icon?: "mail" | "user";
}

export function TextInput({
  className,
  icon = "mail",
  ...props
}: TextInputProps) {
  const Icon = icon === "mail" ? MailIcon : UserIcon;

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <Icon />
      </div>
      <Input className={cn("pl-10", className)} {...props} />
    </div>
  );
}
