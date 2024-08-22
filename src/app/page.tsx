import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container flex flex-col items-start justify-center h-full drop-shadow-md">
      <div className="text-6xl z-10 text-white ">
        <div className="flex items-center justify-start">
          <div className="animate-text text-9xl font-bold bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Vested Token Market
          </div>
        </div>
        Ignite the power of your vested tokens
        <div className="flex mt-6">
          <span className="pr-2 text-base">Based on</span>
          <Link href="https://sui.io/">
            <Image
              src="/sui_icon.png"
              alt="Sui"
              priority={true}
              height={24}
              width={24}
            />
          </Link>
        </div>
      </div>

      <Image
        className=" absolute right-[-120px] z-0 w-[800px] h-auto"
        src="/scene-surfing-scallop.svg"
        alt="Sui"
        priority={true}
        height={0}
        width={0}
      />

      <div className="mt-8">
        <Link href={`/market`}>
          <Button className="w-[140px] h-[48px] bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 text-white hover:opacity-80">
            Launch App
          </Button>
        </Link>
        <Button
          variant="outline"
          className="ml-4 w-[140px] h-[48px] bg-transparent border-fuchsia-500 text-fuchsia-500 border-2 hover:bg-transparent hover:text-purple-500"
        >
          Read More
        </Button>
      </div>
    </div>
  );
}
