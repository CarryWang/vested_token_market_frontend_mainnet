"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import {
  LIST_MARKET,
  PACKAGE_OBJECT_ID,
  RESERVE_OBJECT,
  VE_TOKEN_TYPE,
} from "@/utils/const";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Gem } from "lucide-react";

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: any;
}) {
  console.log(searchParams, "=====");
  const account = useCurrentAccount();
  const client = useSuiClient();
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          showEffects: true,
          showObjectChanges: true,
        },
      }),
  });

  const calcPrice = String(searchParams.price / 10 ** 9);

  const [price, setPrice] = useState<string>(calcPrice);

  async function handleUpdateListing() {
    if (!account) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first.",
      });
      return;
    }

    if (!price.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "The price cannot be empty.",
      });
      return;
    }

    const finalPrice = Number(price) * 10 ** 9;

    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(LIST_MARKET),
        tx.object(RESERVE_OBJECT),
        tx.object(searchParams.nftId),
        tx.pure.u64(finalPrice),
      ],
      typeArguments: [VE_TOKEN_TYPE],
      target: `${PACKAGE_OBJECT_ID}::user::change_vetoken_price`,
    });

    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log("executed transaction", result);
          toast({
            title: "Congratulations, Successful Operation",
            description: "You have successfully updated the price.",
          });
          router.push("/market");
        },
      }
    );
  }

  return (
    <div className="h-full">
      <div className="mb-28">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/profile">Listed</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-xl text-slate-600">
                Update veSCA Price
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-center items-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-fuchsia-900">
              <Gem size={24} />
              <span className="ml-1">veSCA</span>
            </CardTitle>
            <CardDescription>{searchParams.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="w-full items-center gap-4 flex">
                <Image
                  priority={true}
                  src="/VeSCA.png"
                  alt="logo"
                  height={96}
                  width={96}
                />
                <div className="flex flex-col space-y-1.5 w-full">
                  <Label className="text-lg text-slate-500" htmlFor="name">
                    Updating price (SUI)
                  </Label>
                  <Input
                    className="w-full"
                    value={price}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const regex = /^\d*\.?\d*$/;
                      if (regex.test(inputValue)) {
                        setPrice(inputValue);
                      }
                    }}
                    id="name"
                    placeholder="Amount"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 text-white hover:opacity-80"
              onClick={handleUpdateListing}
            >
              Update price
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
