"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Header() {
    const pathname = usePathname();

    return (
        <nav>
            <Link
                href="/mon-compte"
                className={clsx("", {
                    active: pathname === "/mon-compte",
                })}
            >
                Mon compte
            </Link>
        </nav>
    );
}