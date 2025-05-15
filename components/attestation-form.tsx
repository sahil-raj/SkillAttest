"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useWallet } from "@/components/wallet-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  isAddress,
  encodeFunctionData,
  createWalletClient,
  custom,
} from "viem";
import { baseSepolia } from "viem/chains";
import SkillAttestationAbi from "../app/abis/SkillAttestationAbi.json";

const formSchema = z.object({
  walletAddress: z.string().refine((val) => isAddress(val), {
    message: "Please enter a valid Ethereum address",
  }),
  skill: z.string().min(2, {
    message: "Skill must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export default function AttestationForm() {
  const { walletClient, address } = useWallet();
  // Note: setWalletClient appears to be unavailable
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txnCompleted, setTxnCompleted] = useState(false);
  const [txHash, setTxHash] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletAddress: "",
      skill: "",
      description: "",
    },
  });

  async function switchToBaseSepolia() {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: "0x" + baseSepolia.id.toString(16).replace(/^0x/, ""),
          },
        ],
      });

      // Since setWalletClient is not available, we'll create and return a new client
      // without setting it in the wallet context
      return createWalletClient({
        chain: baseSepolia,
        transport: custom(window.ethereum),
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Chain not added, try to add it
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x" + baseSepolia.id.toString(16).replace(/^0x/, ""),
                chainName: baseSepolia.name,
                nativeCurrency: baseSepolia.nativeCurrency,
                rpcUrls: baseSepolia.rpcUrls.default.http,
                blockExplorerUrls: baseSepolia.blockExplorers?.default
                  ? [baseSepolia.blockExplorers.default.url]
                  : [],
              },
            ],
          });

          // After adding, create and return a new client
          return createWalletClient({
            chain: baseSepolia,
            transport: custom(window.ethereum),
          });
        } catch (addError) {
          console.error("Failed to add Base Sepolia chain:", addError);
          throw addError;
        }
      } else {
        console.error("Failed to switch to Base Sepolia:", switchError);
        throw switchError;
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask to submit attestations",
        variant: "destructive",
      });
      return;
    }

    if (!walletClient || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to submit attestations",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Switch to Base Sepolia first
      const activeClient = await switchToBaseSepolia();

      const contractAddress = "0x3fe435e803df1fb56c8e1b3fc650bece708fd749";

      const data = encodeFunctionData({
        abi: SkillAttestationAbi,
        functionName: "attestSkill",
        args: [values.walletAddress, values.skill, values.description],
      });

      const hash = await (activeClient || walletClient).sendTransaction({
        account: address,
        to: contractAddress,
        data,
      });

      // Store the transaction hash and set completed state
      setTxHash(hash);
      setTxnCompleted(true);
      setIsSubmitting(false);

      form.reset();
    } catch (error: any) {
      console.error("Error submitting attestation:", error);
      toast({
        title: "Transaction failed",
        description:
          error?.message || "There was an error submitting your attestation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {txnCompleted ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
            Transaction Completed!
          </h3>
          <p className="text-green-700 dark:text-green-400 mb-4">
            Your skill attestation has been successfully submitted to the
            blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={`https://sepolia.basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
            >
              View on Block Explorer
            </a>
            <button
              onClick={() => {
                setTxnCompleted(false);
                setTxHash("");
              }}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md"
            >
              Submit Another Attestation
            </button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0x..."
                      {...field}
                      className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    The Ethereum address of the person you're attesting skills
                    for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Solidity, React, Smart Contract Auditing"
                      {...field}
                      className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    The skill you're attesting for this person
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe why you're attesting this skill..."
                      {...field}
                      className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm resize-none min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Provide context about your attestation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Attestation"
              )}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
