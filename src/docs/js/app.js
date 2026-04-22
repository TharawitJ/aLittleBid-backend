
    const schema = {
  "asyncapi": "3.1.0",
  "info": {
    "title": "A Little Bid Auction Real-time API",
    "version": "1.0.0",
    "description": "##   Handles real-time bidding amount and auction room management. \n## Quick Start for Frontend\n```javascript\nconst socket = io('http://localhost:3000');\n\n// To Join Auction\nsocket.emit('join_auction', 123);\n\n// To Bid\nsocket.emit('send_bid', { auctionId: 123, amount: 50.5 });\n\n// To Listen\nsocket.on('newest_bid', (data) => console.log(data)); \n\n// To Leave Auction\nsocket.emit('leave_auction', 123);\n```\n"
  },
  "servers": {
    "dev": {
      "host": "localhost:3000",
      "protocol": "socket.io"
    }
  },
  "channels": {
    "root": {
      "address": "/",
      "messages": {
        "joinAuction": {
          "name": "join_auction",
          "payload": {
            "type": "integer",
            "description": "The ID of the auction to join.",
            "x-parser-schema-id": "<anonymous-schema-1>"
          },
          "x-parser-unique-object-id": "joinAuction"
        },
        "leaveAuction": {
          "name": "leave_auction",
          "payload": {
            "type": "integer",
            "description": "The ID of the auction to leave.",
            "x-parser-schema-id": "<anonymous-schema-2>"
          },
          "x-parser-unique-object-id": "leaveAuction"
        },
        "sendBid": {
          "name": "send_bid",
          "payload": {
            "type": "object",
            "properties": {
              "auctionId": {
                "type": "integer",
                "x-parser-schema-id": "<anonymous-schema-3>"
              },
              "amount": {
                "type": "number",
                "minimum": 0,
                "x-parser-schema-id": "<anonymous-schema-4>"
              }
            },
            "x-parser-schema-id": "BidPayload"
          },
          "x-parser-unique-object-id": "sendBid"
        },
        "newestBid": {
          "name": "newest_bid",
          "payload": {
            "type": "object",
            "properties": {
              "bidderId": {
                "type": "integer",
                "x-parser-schema-id": "<anonymous-schema-5>"
              },
              "auctionId": {
                "type": "integer",
                "x-parser-schema-id": "<anonymous-schema-6>"
              },
              "amount": {
                "type": "number",
                "x-parser-schema-id": "<anonymous-schema-7>"
              },
              "createdAt": {
                "type": "string",
                "format": "date-time",
                "x-parser-schema-id": "<anonymous-schema-8>"
              }
            },
            "x-parser-schema-id": "SavedBid"
          },
          "x-parser-unique-object-id": "newestBid"
        }
      },
      "x-parser-unique-object-id": "root"
    }
  },
  "operations": {
    "emitJoinAuction": {
      "action": "receive",
      "summary": "Join an auction room",
      "description": "**Frontend Action:** Use `socket.emit('join_auction', auctionId)` \nto start receiving updates for a specific auction.\n",
      "channel": "$ref:$.channels.root",
      "messages": [
        "$ref:$.channels.root.messages.joinAuction"
      ],
      "x-parser-unique-object-id": "emitJoinAuction"
    },
    "emitSendBid": {
      "action": "receive",
      "summary": "Send a bid to the auction room",
      "description": "**Frontend Action:** Use `socket.emit('send_bid', auctionId)` \nto send bid for a specific auction.\n",
      "channel": "$ref:$.channels.root",
      "messages": [
        "$ref:$.channels.root.messages.sendBid"
      ],
      "x-parser-unique-object-id": "emitSendBid"
    },
    "onNewestBid": {
      "action": "send",
      "summary": "Listen for new bids",
      "description": "**Frontend Action:** Use `socket.on('newest_bid', (data) => { ... })` \nto update the UI when a new bid is placed by any user.\n",
      "channel": "$ref:$.channels.root",
      "messages": [
        "$ref:$.channels.root.messages.newestBid"
      ],
      "x-parser-unique-object-id": "onNewestBid"
    },
    "emitLeaveAuction": {
      "action": "receive",
      "summary": "Leave an auction room",
      "description": "**Frontend Action:** Use `socket.emit('leave_auction', auctionId)` \nto leave for a specific auction.\n",
      "channel": "$ref:$.channels.root",
      "messages": [
        "$ref:$.channels.root.messages.leaveAuction"
      ],
      "x-parser-unique-object-id": "emitLeaveAuction"
    }
  },
  "components": {
    "schemas": {
      "BidPayload": "$ref:$.channels.root.messages.sendBid.payload",
      "SavedBid": "$ref:$.channels.root.messages.newestBid.payload"
    }
  },
  "x-parser-spec-parsed": true,
  "x-parser-api-version": 3,
  "x-parser-spec-stringified": true
};
    const config = {"show":{"sidebar":true},"sidebar":{"showOperations":"byDefault"}};
    const appRoot = document.getElementById('root');
    AsyncApiStandalone.render(
        { schema, config, }, appRoot
    );
  