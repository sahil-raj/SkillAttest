"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useWallet } from "@/components/wallet-provider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { isAddress } from "viem"

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
})

export default function AttestationForm() {
  const { walletClient, address } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletAddress: "",
      skill: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!walletClient || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to submit attestations",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would use viem to send a transaction to an attestation contract
      // const hash = await walletClient.sendTransaction({
      //   account: address,
      //   to: "0xYourAttestationContractAddress",
      //   data: "0x...", // encoded contract call
      // });

      toast({
        title: "Attestation submitted!",
        description: `You've successfully attested ${values.skill} for ${values.walletAddress.substring(0, 6)}...${values.walletAddress.substring(38)}`,
      })

      form.reset()
    } catch (error) {
      console.error("Error submitting attestation:", error)
      toast({
        title: "Transaction failed",
        description: "There was an error submitting your attestation",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="walletAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Address</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm" />
              </FormControl>
              <FormDescription>The Ethereum address of the person you're attesting skills for</FormDescription>
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
              <FormDescription>The skill you're attesting for this person</FormDescription>
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
              <FormDescription>Provide context about your attestation</FormDescription>
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
  )
}
