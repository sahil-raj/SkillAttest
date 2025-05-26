"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWallet } from "@/components/wallet-provider";
import AttestationForm from "@/components/attestation-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { createPublicClient, http, getContract, parseAbiItem } from "viem";
import { baseSepolia } from "viem/chains";
import { SkillAttestationAbi } from "../abis/SkillAttestationAbi";

const CONTRACT_ADDRESS = "0x3Fe435E803df1fB56c8E1B3fC650BEce708Fd749";

// Create public client for reading from the contract
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export default function Dashboard() {
  const { isConnected, address } = useWallet();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("attest");
  const [myAttestations, setMyAttestations] = useState([]);
  const [attestationsGiven, setAttestationsGiven] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch attestations from the contract
  const fetchAttestations = async () => {
    if (!address) return;

    try {
      setLoading(true);
      setError(null);

      // Create contract instance
      const contract = getContract({
        address: CONTRACT_ADDRESS,
        abi: SkillAttestationAbi,
        client: publicClient,
      });

      // Fetch attestations received by the current user
      const receivedAttestations = await contract.read.getAttestations([
        address,
      ]);
      const formattedReceived = receivedAttestations.map(
        (attestation, index) => ({
          id: index + 1,
          skill: attestation.skill,
          description: attestation.description,
          from: attestation.attester,
          date: new Date(
            Number(attestation.timestamp) * 1000
          ).toLocaleDateString(),
          timestamp: attestation.timestamp,
        })
      );
      setMyAttestations(formattedReceived);

      // Fetch attestations given by current user using events
      await fetchAttestationsGiven();
    } catch (err) {
      console.error("Error fetching attestations:", err);
      setError("Failed to fetch attestations from contract");
      setMyAttestations([]);
      setAttestationsGiven([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch attestations given by current user using events
  const fetchAttestationsGiven = async () => {
    try {
      // Get SkillAttested events where current user is the attester
      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESS,
        event: parseAbiItem(
          "event SkillAttested(address indexed attester, address indexed subject, string skill, string description, uint256 timestamp)"
        ),
        args: {
          attester: address,
        },
        fromBlock: "earliest",
      });

      const formattedGiven = logs.map((log, index) => ({
        id: index + 1,
        skill: log.args.skill,
        description: log.args.description,
        to: log.args.subject,
        date: new Date(Number(log.args.timestamp) * 1000).toLocaleDateString(),
        timestamp: log.args.timestamp,
        blockNumber: log.blockNumber,
      }));

      setAttestationsGiven(formattedGiven);
    } catch (err) {
      console.warn("Could not fetch given attestations from events:", err);
      setAttestationsGiven([]);
    }
  };

  // Get unique skills from attestations received
  const getAttestedSkills = () => {
    const skills = myAttestations.map((att) => att.skill);
    return [...new Set(skills)];
  };

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  useEffect(() => {
    if (isConnected && address) {
      fetchAttestations();
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your on-chain identity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-violet-500 to-indigo-500 w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                  {address?.substring(2, 4).toUpperCase()}
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-medium mt-4">Wallet Address</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 break-all">
                    {address}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-2">Skills Attested</h3>
                  {loading ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Loading skills...
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {getAttestedSkills().length > 0 ? (
                        getAttestedSkills().map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No skills attested yet
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {error}
                    </p>
                    <button
                      onClick={fetchAttestations}
                      className="text-sm text-violet-600 dark:text-violet-400 hover:underline mt-1"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs
            defaultValue="attest"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-2 mb-8 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md">
              <TabsTrigger value="attest">Attest Skills</TabsTrigger>
              <TabsTrigger value="history">Attestation History</TabsTrigger>
            </TabsList>

            <TabsContent value="attest" className="mt-0">
              <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader>
                  <CardTitle>Attest Skills</CardTitle>
                  <CardDescription>
                    Verify and attest skills for other wallet addresses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AttestationForm onSuccess={fetchAttestations} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader>
                  <CardTitle>Attestation History</CardTitle>
                  <CardDescription>
                    View your attestation history from the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                      <span className="ml-2">Loading attestations...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Skills Attested to You
                        </h3>
                        <div className="space-y-3">
                          {myAttestations.length > 0 ? (
                            myAttestations.map((attestation) => (
                              <div
                                key={attestation.id}
                                className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <Badge className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 mb-2">
                                      {attestation.skill}
                                    </Badge>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      From: {attestation.from}
                                    </p>
                                    {attestation.description && (
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {attestation.description}
                                      </p>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {attestation.date}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                              No attestations received yet
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium mb-4">
                          Skills You've Attested
                        </h3>
                        <div className="space-y-3">
                          {attestationsGiven.length > 0 ? (
                            attestationsGiven.map((attestation) => (
                              <div
                                key={attestation.id}
                                className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <Badge className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 mb-2">
                                      {attestation.skill}
                                    </Badge>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      To: {attestation.to}
                                    </p>
                                    {attestation.description && (
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {attestation.description}
                                      </p>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {attestation.date}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                              No attestations given yet
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
