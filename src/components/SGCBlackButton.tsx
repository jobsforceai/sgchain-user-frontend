"use client";

import React from "react";
import Link from "next/link";

interface SGCBlackButtonProps {
  link: string;
  icon?: React.ReactNode;
  name: React.ReactNode;
  className?: string;
  target?: string;
}

const SGCBlackButton: React.FC<SGCBlackButtonProps> = ({
  link,
  icon,
  name,
  className,
  target,
}) => {
  const base = "inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 bg-[#232323] text-sm text-white";

  return (
    <Link href={link} className={`${base} ${className || ""} hover:bg-[#404040] transition-colors duration-300`} target={target}>
      {icon ? (
        <span className="flex items-center text-white">{icon}</span>
      ) : null}
      <span>{name}</span>
    </Link>
  );
};

export default SGCBlackButton;
