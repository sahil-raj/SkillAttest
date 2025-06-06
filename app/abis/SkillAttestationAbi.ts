export const SkillAttestationAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "subject",
        type: "address",
      },
      {
        internalType: "string",
        name: "skill",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "attestSkill",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "attester",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "subject",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "skill",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "SkillAttested",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "attestations",
    outputs: [
      {
        internalType: "address",
        name: "attester",
        type: "address",
      },
      {
        internalType: "string",
        name: "skill",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "subject",
        type: "address",
      },
    ],
    name: "getAttestations",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "attester",
            type: "address",
          },
          {
            internalType: "string",
            name: "skill",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct SkillAttestation.Attestation[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
