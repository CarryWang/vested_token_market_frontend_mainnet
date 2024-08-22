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
import { LIST_MARKET, PACKAGE_OBJECT_ID, VE_TOKEN_TYPE } from "@/utils/const";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Gem } from "lucide-react";

export default function Page({ params }: { params: { id: string } }) {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const router = useRouter();
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const vesca_id = searchParams.get("vesca_id");
  const current_vesca = searchParams.get("current_vesca");
  const locked_sca = searchParams.get("locked_sca");
  const remaining_lock_period = searchParams.get("remaining_lock_period");

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

  const [price, setPrice] = useState("");

  async function handleCompleteListing() {
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
        tx.object(params.id),
        tx.pure.u64(finalPrice),
      ],
      typeArguments: [VE_TOKEN_TYPE],
      target: `${PACKAGE_OBJECT_ID}::user::list_vetoken`,
    });

    // tx.setSender(account.address);

    // const res = await client.dryRunTransactionBlock({
    //     transactionBlock: await tx.build()
    // })

    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log("executed transaction", result);
          toast({
            title: "Congratulations, Successful Operation",
            description:
              "your veSCA is listed, you can check it out in the marketplace.",
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
              <Link href="/profile">Collected</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-xl text-slate-600">
                veSCA Detail
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
            <div className="space-y-3">
              <div className="truncate" title={vesca_id!}>
                {vesca_id}
              </div>
              <div>
                <h1 className="text-xs text-fuchsia-900">CURRENT VESCA:</h1>
                <p className="text-lg font-semibold text-fuchsia-900">
                  {current_vesca}
                </p>
              </div>
              <div>
                <h1 className="text-xs text-fuchsia-900">LOCKED SCA:</h1>
                <p className="text-lg font-semibold text-fuchsia-900">
                  {locked_sca}
                </p>
              </div>
              <div>
                <h1 className="text-xs text-fuchsia-900">
                  REMAINING LOCK PERIOD:
                </h1>
                <p className="text-lg font-semibold text-fuchsia-900">
                  {remaining_lock_period}
                </p>
              </div>
            </div>
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
                    Starting price (SUI)
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
              onClick={handleCompleteListing}
            >
              Complete listing
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
