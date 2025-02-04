import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Une activité - Activity Up",
    description: "Une activité",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}