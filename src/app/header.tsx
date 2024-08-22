"use client";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@mysten/dapp-kit";
import { HomeIcon, PersonIcon } from "@radix-ui/react-icons";
import {
  Camera,
  CircleUserRound,
  SquareUserRound,
  Store,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  return (
    <header className="drop-shadow-lg shadow-lg fixed z-10 w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 text-white opacity-90">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link href="/">
          <div className="flex items-center">
            <Image
              priority={true}
              src="/VeSCA.png"
              alt="logo"
              height={64}
              width={64}
            />
            <h1 className="text-xl ml-2 font-semibold drop-shadow-md">
              Vested Token Market
            </h1>
          </div>
        </Link>

        <nav className="space-x-8 font-bold flex drop-shadow-md">
          <Link
            href="/market"
            className={`${cn(
              pathname == "/market"
                ? "text-yellow-300  underline underline-offset-4"
                : ""
            )} hover:text-yellow-200`}
          >
            <div className="flex items-center">
              <Store size={24} />
              <span className="pl-2">Market</span>
            </div>
          </Link>
          <Link
            href="/profile"
            className={`${cn(
              pathname.includes("profile")
                ? "text-yellow-300  underline underline-offset-4"
                : ""
            )} hover:text-yellow-200`}
          >
            <div className="flex items-center">
              <CircleUserRound size={24} />
              <span className="pl-2">Profile</span>
            </div>
          </Link>
        </nav>

        <div className="space-x-4">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
