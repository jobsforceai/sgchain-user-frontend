"use client";

import React from "react";
import Link from "next/link";

interface SGCBlackButtonProps {
  link?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  name: React.ReactNode;
  className?: string;
  target?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const SGCBlackButton: React.FC<SGCBlackButtonProps> = ({
  link,
  onClick,
  icon,
  name,
  className,
  target,
  type = 'button',
  disabled = false,
}) => {
  const baseClasses = "inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 bg-[#232323] text-sm text-white transition-colors duration-300";
  const disabledClasses = "disabled:bg-gray-400 disabled:cursor-not-allowed";
  const hoverClasses = "hover:bg-[#404040]";

  const buttonContent = (
    <>
      {icon && <span className="flex items-center text-white">{icon}</span>}
      <span>{name}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${hoverClasses} ${disabledClasses} ${className || ""}`}
      >
        {buttonContent}
      </button>
    );
  }

  if (link) {
    return (
      <Link href={link} className={`${baseClasses} ${hoverClasses} ${className || ""}`} target={target}>
        {buttonContent}
      </Link>
    );
  }

  // Fallback or error for no link/onClick provided could be added here
  return (
    <button
      disabled
      className={`${baseClasses} ${disabledClasses} ${className || ""}`}
    >
      {buttonContent}
    </button>
  );
};

export default SGCBlackButton;

