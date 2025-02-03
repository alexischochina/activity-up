"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/sessions";

export default function Header() {
    const router = useRouter();

    const Logout = () => {
        logout(); // Destroy the cookie
        return router.push("/login"); // redirect to login page
    };

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
            <button onClick={Logout}>Logout</button>
        </nav>
    );
}