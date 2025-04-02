"use client";

interface ClientBodyWrapperProps {
  className?: string;
  children: React.ReactNode;
}

export default function ClientBodyWrapper({
  className = "",
  children,
}: ClientBodyWrapperProps) {
  return <div className={className}>{children}</div>;
}
