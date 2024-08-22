import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { ConnectButton } from "@mysten/dapp-kit";
import { Wallet } from "lucide-react";

export function ConnectTips() {
  return (
    <div className="flex h-full items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold  text-slate-600 flex items-center">
            <Wallet size={48} />
            <span className="ml-4">Wallet not connected</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center">
          <p className="w-[400px] text-2xl text-slate-500">
            Please{" "}
            <span className="font-bold text-4xl text-pink-500">CONNECT</span>{" "}
            your wallet before start your journey
          </p>
          <Image
            className="z-0"
            src="/scene-surfing-scallop.svg"
            alt="Sui"
            priority={true}
            height={400}
            width={400}
          />
        </CardContent>
        <CardFooter>
          <ConnectButton />
        </CardFooter>
      </Card>
    </div>
  );
}
