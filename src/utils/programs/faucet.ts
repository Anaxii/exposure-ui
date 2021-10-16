export const idl = {
    "version": "0.0.0",
    "name": "exposure_etf",
    "instructions": [
      {
        "name": "createEtf",
        "accounts": [
          {
            "name": "etf",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "nonce",
            "type": "u8"
          }
        ]
      },
      {
        "name": "addAsset",
        "accounts": [
          {
            "name": "asset",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "etf",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "splToken",
            "type": "publicKey"
          },
          {
            "name": "bidPubkey",
            "type": "publicKey"
          },
          {
            "name": "marketPubkey",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "etfPriceWeightSubmit",
        "accounts": [
          {
            "name": "exposureEtf",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "dexPid",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "create",
        "accounts": [
          {
            "name": "user",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "exposureEtf",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "exposureEtfSigner",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "exposureEtfToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "exposureEtfTokenUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "redeem",
        "accounts": [
          {
            "name": "user",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "exposureEtf",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "exposureEtfToken",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "exposureEtfTokenUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "exposureEtfSigner",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Asset",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "token",
              "type": "publicKey"
            },
            {
              "name": "marketPubkey",
              "type": "publicKey"
            },
            {
              "name": "bidPubkey",
              "type": "publicKey"
            }
          ]
        }
      },
      {
        "name": "ExposureETF",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "tokens",
              "type": {
                "vec": "publicKey"
              }
            },
            {
              "name": "weights",
              "type": {
                "vec": "u128"
              }
            },
            {
              "name": "indexPrice",
              "type": "u64"
            },
            {
              "name": "nonce",
              "type": "u8"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 300,
        "name": "InvalidOwner",
        "msg": "The given owner is not part of this multisig."
      },
      {
        "code": 301,
        "name": "NotEnoughSigners",
        "msg": "Not enough owners signed this transaction."
      },
      {
        "code": 302,
        "name": "TransactionAlreadySigned",
        "msg": "Cannot delete a transaction that has been signed by an owner."
      },
      {
        "code": 303,
        "name": "Overflow",
        "msg": "Overflow when adding."
      },
      {
        "code": 304,
        "name": "UnableToDelete",
        "msg": "Cannot delete a transaction the owner did not create."
      },
      {
        "code": 305,
        "name": "AlreadyExecuted",
        "msg": "The given transaction has already been executed."
      },
      {
        "code": 306,
        "name": "InvalidThreshold",
        "msg": "Threshold must be less than or equal to the number of owners."
      },
      {
        "code": 307,
        "name": "InvalidAccountCount",
        "msg": "Depositer does not have correct amount of accounts passed!"
      },
      {
        "code": 308,
        "name": "NotEnoughBalance",
        "msg": "Depositer does not have enough tokens!"
      },
      {
        "code": 309,
        "name": "WeightsInvalid",
        "msg": "Weights are invalid!"
      },
      {
        "code": 310,
        "name": "InvalidAccount",
        "msg": "Invalid Account!"
      }
    ],
    "metadata": {
      "address": "CJmvDaqZrfBsmmcNpV7bVF3gqUMHB2dXdw8pFKCdPk8n"
    }
  }