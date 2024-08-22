"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import Link from "next/link";
import { ConnectTips } from "../connectTips";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const account = useCurrentAccount();
  const pathname = usePathname();

  if (!account) {
    return <ConnectTips />;
  }

  return (
    <div className=" h-full">
      <div className=" container mx-auto pt-28">
        <nav className="space-x-8 font-bold flex text-slate-700">
          <Link
            href="/profile"
            className={`${cn(
              pathname == "/profile"
                ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl"
                : ""
            )} hover:opacity-50`}
          >
            Collected
          </Link>
          <div>
            <Separator orientation="vertical" />
          </div>
          <Link
            href="/profile/listed"
            className={`${cn(
              pathname == "/profile/listed"
                ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl"
                : ""
            )} hover:opacity-50`}
          >
            Listed
          </Link>
          <div>
            <Separator orientation="vertical" />
          </div>
          <Link
            href="/profile/redeem"
            className={`${cn(
              pathname == "/profile/redeem"
                ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl"
                : ""
            )} hover:opacity-50`}
          >
            Redeem
          </Link>
          <div>
            <Separator orientation="vertical" />
          </div>
          <Link
            href="/profile/offersMade"
            className={`${cn(
              pathname == "/profile/offersMade"
                ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl"
                : ""
            )} hover:opacity-50`}
          >
            Offers made
          </Link>
          <div>
            <Separator orientation="vertical" />
          </div>
          <Link
            href="/profile/offersReceived"
            className={`${cn(
              pathname == "/profile/offersReceived"
                ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl"
                : ""
            )} hover:opacity-50`}
          >
            Offers received
          </Link>
        </nav>
        <Separator className="my-4" />

        {children}
      </div>
    </div>
  );
}
