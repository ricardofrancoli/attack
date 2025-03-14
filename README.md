# YVH Combat Droid Targeting Module

*A critical mission for the New Republic, authorized by Commander Lando Calrissian*

## Mission Briefing

This application provides the targeting module for the new YVH combat droids. It processes radar scan data according to specific battle protocols and maintains an audit log of all targeting calculations for later review by New Republic Intelligence.

## Droid Capabilities

- **Protocol-based targeting system** with specialised combat logic:
  - Range protocols: `closest-enemies`, `furthest-enemies` 
  - Ally protection protocols: `assist-allies`, `avoid-crossfire`
  - Tactical protocols: `prioritize-mech`, `avoid-mech`
  
- **Secure MongoDB integration** for persistent mission logs and battle data

- **Intelligence Auditing System** with secure endpoints to:
  - Review mission history
  - Analyze specific targeting decisions
  - Purge sensitive records when necessary

## Technical Requirements

- Node.js
- MongoDB (locally deployed or via secure Republic connection string)
- Typescript knowledge (as required by New Republic Engineering standards)

## Deployment Instructions

1. Secure the repository:
    ```bash
    git clone https://github.com/ricardofrancoli/attack.git
    cd attack
    ```

2. Install required modules:
    ```bash
    pnpm install
    ```

3. Configure your secure environment with `.env`:
    ```
    MONGODB_URI=mongodb://localhost:27017/
    MONGODB_URI_TEST=mongodb://localhost:27017/
    DB_NAME=attack
    DB_NAME_TEST=attack-test
    PORT=3000
    NODE_ENV=dev
    ```

## Activating the Combat System

Start the targeting module:
```bash
pnpm run dev 
```

## Combat Interface Specifications

### Targeting Module

- **POST /radar**
  - Processes incoming scanner data with tactical protocols
  - Request body example: 
    ```json
    {
      "protocols": ["closest-enemies", "avoid-mech"],
      "scan": [
        {
          "coordinates": {"x": 0, "y": 40},
          "enemies": {"type": "soldier", "number": 10},
          "allies": 0
        }
      ]
    }
    ```
  - Response: Target coordinates for immediate engagement

### Intelligence Audit System

- **GET /audit**
  - Retrieves all targeting decisions with pagination

- **GET /audit/:id**
  - Detailed analysis of specific targeting decision

- **DELETE /audit/:id**
  - Secure method to remove sensitive targeting records

## Combat Testing

Run the provided Republic testing protocols:
```bash
pnpm run test
```

For instructions on using the intelligence audit utilities, see the [classified scripts documentation](./scripts/README.md).

## Security Notice

All targeting decisions are logged for review by New Republic Intelligence. Unauthorised access to this system is punishable under Republic law.

*May the Force be with you.*