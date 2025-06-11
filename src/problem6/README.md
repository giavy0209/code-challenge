<!-- @format -->

# Live Scoreboard Module Specification

## Overview

A real-time scoreboard system that tracks and displays the top 10 users' scores with live updates. The system ensures secure score updates and prevents unauthorized score modifications.

## System Architecture

### Components

1. **WebSocket Server**

   - Handles real-time updates to connected clients
   - Maintains active connections
   - Broadcasts score updates to all connected clients

2. **Authentication Service**

   - Validates user tokens
   - Ensures secure score updates
   - Prevents unauthorized access

3. **Score Service**

   - Manages score updates
   - Maintains leaderboard cache
   - Handles score validation

4. **Redis Cache**
   - Stores sorted set of scores
   - Enables fast leaderboard queries
   - Maintains data consistency

### API Endpoints

#### 1. WebSocket Connection

```
WS /api/scoreboard/live
```

- Requires: Valid JWT token in connection headers
- Returns: WebSocket connection for real-time updates

#### 2. Update Score

```
POST /api/scores/update
```

- Headers:
  - Authorization: Bearer {jwt_token}
- Body:

```json
{
  "actionId": "string", // Unique identifier for the action
  "timestamp": "number", // Unix timestamp of the action
  "signature": "string" // HMAC signature of the action
}
```

- Response:

```json
{
  "newScore": number,
  "rank": number,
  "topScores": [
    {
      "userId": "string",
      "username": "string",
      "score": number,
      "rank": number
    }
  ]
}
```

#### 3. Get Leaderboard

```
GET /api/scores/leaderboard
```

- Response:

```json
{
  "lastUpdated": "string",
  "scores": [
    {
      "userId": "string",
      "username": "string",
      "score": number,
      "rank": number
    }
  ]
}
```

## Security Measures

### 1. Action Verification

- Each score update must include:
  - Unique action ID
  - Server-side timestamp validation
  - HMAC signature using shared secret
  - Rate limiting per user

### 2. Authentication

- JWT-based authentication
- Token validation for all requests
- WebSocket connection authentication

### 3. Rate Limiting

- Maximum 10 score updates per minute per user
- WebSocket connection limit per user
- IP-based rate limiting

## Data Flow

1. **Score Update Flow**

   - Client completes action
   - Client generates action signature
   - Server validates action and signature
   - Server updates score in Redis
   - Server broadcasts update via WebSocket
   - Connected clients update UI

2. **WebSocket Connection Flow**
   - Client requests WebSocket connection with JWT
   - Server validates token
   - Server establishes connection
   - Server sends initial leaderboard data
   - Server broadcasts updates as they occur

## Implementation Guidelines

### 1. Redis Schema

```
Key: scoreboard:scores
Type: Sorted Set
Members: {userId}
Score: {userScore}

Key: user:{userId}
Type: Hash
Fields:
  - username
  - lastUpdate
  - actionCount
```

### 2. Caching Strategy

- Leaderboard cached for 5 seconds
- Score updates immediately reflect in Redis
- Periodic full cache refresh
- Cache invalidation on score updates

### 3. WebSocket Events

```typescript
interface ScoreUpdate {
  type: "SCORE_UPDATE"
  data: {
    userId: string
    newScore: number
    rank: number
    topScores: Array<{
      userId: string
      username: string
      score: number
      rank: number
    }>
  }
}
```

## Performance Considerations

1. **Scalability**

   - Horizontal scaling of WebSocket servers
   - Redis cluster for high availability
   - Load balancing for API endpoints

2. **Optimization**
   - Batched score updates
   - Debounced WebSocket broadcasts
   - Cached leaderboard calculations
