// const MilkSupplyChainABI = 
// [
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "serialNumber",
//         "type": "string"
//       },
//       {
//         "indexed": false,
//         "internalType": "enum MilkSupplyChain.MilkBoxStatus",
//         "name": "status",
//         "type": "uint8"
//       }
//     ],
//     "name": "BoxStatusUpdated",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "serialNumber",
//         "type": "string"
//       },
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "distributor",
//         "type": "string"
//       }
//     ],
//     "name": "DistributorUpdated",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "batchId",
//         "type": "uint256"
//       }
//     ],
//     "name": "MilkBatchApproved",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "batchId",
//         "type": "uint256"
//       },
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "batchName",
//         "type": "string"
//       },
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "milkingDate",
//         "type": "string"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "volume",
//         "type": "uint256"
//       }
//     ],
//     "name": "MilkBatchCreated",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "serialNumber",
//         "type": "string"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "batchId",
//         "type": "uint256"
//       }
//     ],
//     "name": "MilkBoxCreated",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "serialNumber",
//         "type": "string"
//       }
//     ],
//     "name": "ProcessingBoxApproved",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "serialNumber",
//         "type": "string"
//       }
//     ],
//     "name": "TransportBoxApproved",
//     "type": "event"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "_batchId",
//         "type": "uint256"
//       },
//       {
//         "internalType": "string",
//         "name": "_approvedBy",
//         "type": "string"
//       }
//     ],
//     "name": "approveMilking",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "_serialNumber",
//         "type": "string"
//       }
//     ],
//     "name": "approveProcessingBox",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "_serialNumber",
//         "type": "string"
//       }
//     ],
//     "name": "approveTransportBox",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "_batchName",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_milkingDate",
//         "type": "string"
//       },
//       {
//         "internalType": "uint256",
//         "name": "_volume",
//         "type": "uint256"
//       },
//       {
//         "internalType": "string",
//         "name": "_farmOwner",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_approvedBy",
//         "type": "string"
//       }
//     ],
//     "name": "createMilkBatch",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "_batchId",
//         "type": "uint256"
//       },
//       {
//         "internalType": "string",
//         "name": "_serialNumber",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_boxName",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_manufacturingDate",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_expirationDate",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_manufacturer",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_distributorAddress",
//         "type": "string"
//       }
//     ],
//     "name": "createMilkBox",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "_serialNumber",
//         "type": "string"
//       }
//     ],
//     "name": "getMilkBoxDetails",
//     "outputs": [
//       {
//         "components": [
//           {
//             "internalType": "string",
//             "name": "serialNumber",
//             "type": "string"
//           },
//           {
//             "internalType": "uint256",
//             "name": "batchId",
//             "type": "uint256"
//           },
//           {
//             "internalType": "bool",
//             "name": "processingApproved",
//             "type": "bool"
//           },
//           {
//             "internalType": "bool",
//             "name": "transportApproved",
//             "type": "bool"
//           },
//           {
//             "internalType": "string",
//             "name": "distributorAddress",
//             "type": "string"
//           },
//           {
//             "internalType": "uint8",
//             "name": "boxStatus",
//             "type": "uint8"
//           },
//           {
//             "internalType": "string",
//             "name": "owner",
//             "type": "string"
//           },
//           {
//             "internalType": "string",
//             "name": "manufacturer",
//             "type": "string"
//           },
//           {
//             "internalType": "string",
//             "name": "boxName",
//             "type": "string"
//           },
//           {
//             "internalType": "string",
//             "name": "manufacturingDate",
//             "type": "string"
//           },
//           {
//             "internalType": "string",
//             "name": "expirationDate",
//             "type": "string"
//           },
//           {
//             "internalType": "string",
//             "name": "batchName",
//             "type": "string"
//           },
//           {
//             "internalType": "string",
//             "name": "milkingDate",
//             "type": "string"
//           },
//           {
//             "internalType": "uint256",
//             "name": "volume",
//             "type": "uint256"
//           },
//           {
//             "internalType": "string",
//             "name": "farmOwner",
//             "type": "string"
//           },
//           {
//             "internalType": "string",
//             "name": "approvedBy",
//             "type": "string"
//           },
//           {
//             "internalType": "uint8",
//             "name": "batchStatus",
//             "type": "uint8"
//           }
//         ],
//         "internalType": "struct MilkSupplyChain.MilkBoxDetail",
//         "name": "",
//         "type": "tuple"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "getParticipants",
//     "outputs": [
//       {
//         "components": [
//           {
//             "internalType": "string",
//             "name": "name",
//             "type": "string"
//           },
//           {
//             "internalType": "string",
//             "name": "location",
//             "type": "string"
//           },
//           {
//             "internalType": "string",
//             "name": "phone",
//             "type": "string"
//           },
//           {
//             "internalType": "string",
//             "name": "role",
//             "type": "string"
//           },
//           {
//             "internalType": "bool",
//             "name": "isActive",
//             "type": "bool"
//           }
//         ],
//         "internalType": "struct MilkSupplyChain.Participant[]",
//         "name": "",
//         "type": "tuple[]"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "name": "milkBatches",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "batchId",
//         "type": "uint256"
//       },
//       {
//         "internalType": "string",
//         "name": "batchName",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "milkingDate",
//         "type": "string"
//       },
//       {
//         "internalType": "uint256",
//         "name": "volume",
//         "type": "uint256"
//       },
//       {
//         "internalType": "string",
//         "name": "farmOwner",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "approvedBy",
//         "type": "string"
//       },
//       {
//         "internalType": "enum MilkSupplyChain.BatchStatus",
//         "name": "status",
//         "type": "uint8"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "",
//         "type": "string"
//       }
//     ],
//     "name": "milkBoxes",
//     "outputs": [
//       {
//         "internalType": "string",
//         "name": "serialNumber",
//         "type": "string"
//       },
//       {
//         "internalType": "uint256",
//         "name": "batchId",
//         "type": "uint256"
//       },
//       {
//         "internalType": "bool",
//         "name": "processingApproved",
//         "type": "bool"
//       },
//       {
//         "internalType": "bool",
//         "name": "transportApproved",
//         "type": "bool"
//       },
//       {
//         "internalType": "string",
//         "name": "distributorAddress",
//         "type": "string"
//       },
//       {
//         "internalType": "enum MilkSupplyChain.MilkBoxStatus",
//         "name": "status",
//         "type": "uint8"
//       },
//       {
//         "internalType": "string",
//         "name": "owner",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "manufacturer",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "boxName",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "manufacturingDate",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "expirationDate",
//         "type": "string"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "nextBatchId",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "name": "participantAddresses",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "name": "participantRegistered",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "",
//         "type": "bool"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "name": "participants",
//     "outputs": [
//       {
//         "internalType": "string",
//         "name": "name",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "location",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "phone",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "role",
//         "type": "string"
//       },
//       {
//         "internalType": "bool",
//         "name": "isActive",
//         "type": "bool"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "_participant",
//         "type": "address"
//       },
//       {
//         "internalType": "string",
//         "name": "_name",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_location",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_phone",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_role",
//         "type": "string"
//       },
//       {
//         "internalType": "bool",
//         "name": "_isActive",
//         "type": "bool"
//       }
//     ],
//     "name": "setParticipant",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "_serialNumber",
//         "type": "string"
//       },
//       {
//         "internalType": "enum MilkSupplyChain.MilkBoxStatus",
//         "name": "_newStatus",
//         "type": "uint8"
//       }
//     ],
//     "name": "updateBoxStatusAtRetail",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "_serialNumber",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_distributorAddress",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_owner",
//         "type": "string"
//       }
//     ],
//     "name": "updateDistributor",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   }
// ];

// export default MilkSupplyChainABI;


import MilkSupplyChainData from './data/MilkSupplyChain.json'; // Import dữ liệu JSON

const MilkSupplyChainABI = MilkSupplyChainData.abi; // Lấy mảng ABI từ dữ liệu

export default MilkSupplyChainABI;