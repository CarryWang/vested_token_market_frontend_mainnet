"use client";
import Image from "next/image";
import {
  useCurrentAccount,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { SkeletonComponent } from "../skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { upperCase } from "lodash";
import { VE_TOKEN_TYPE } from "@/utils/const";
import { Gem } from "lucide-react";
import { useEffect } from "react";

export default function Page() {
  const account = useCurrentAccount();

  const {
    data: vescaObjs,
    isPending,
    error,
    refetch,
  } = useSuiClientQuery("getOwnedObjects", {
    owner: account?.address!,
    options: {
      showContent: true,
    },
    filter: {
      StructType: VE_TOKEN_TYPE,
    },
  });

  return isPending ? (
    <div>
      <div className="text-lg mb-6">
        <Skeleton className="h-[28px] w-[120px]" />
      </div>
      <SkeletonComponent />
    </div>
  ) : (
    <div className="">
      <h1 className="text-base mb-6 text-slate-500 font-bold">
        <span className="text-pink-800 text-xl mr-2">{`${vescaObjs?.data.length}`}</span>
        items
      </h1>

      <div className="flex flex-row flex-wrap gap-4">
        {vescaObjs?.data?.map((obj) => (
          <Card key={obj.data?.objectId} className="max-w-[320px]">
            <CardHeader>
              <CardTitle className="flex items-center text-fuchsia-900">
                <Gem size={24} />
                <span className="ml-1">veSCA</span>
              </CardTitle>
              <CardDescription className="truncate">
                {obj.data?.objectId}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex items-center">
              <Image
                priority={true}
                src="/VeSCA.png"
                alt="logo"
                height={96}
                width={96}
              />
              <div className="ml-6 text-lg ">
                <p className="pr-2 text-sm text-slate-400">
                  Waiting for priced
                </p>
                <span className="font-bold text-4xl text-fuchsia-500">-</span>
                <span className="pl-2">SUI</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/profile/listDetail/${obj.data?.objectId}`}>
                <Button className=" bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 text-white hover:opacity-80">
                  List for sale
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
