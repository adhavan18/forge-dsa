export const SD_TOPICS = [
  {
    id: 'fundamentals',
    title: 'Scalability Fundamentals',
    tag: 'Core Concept',
    desc: 'Vertical vs horizontal scaling, stateless design, CAP theorem, consistency models.',
    content: `# Scalability Fundamentals

## Vertical vs Horizontal Scaling

**Vertical (Scale Up):** Add more CPU/RAM to one machine.
- ✅ Simple — no code changes
- ❌ Hard limit (biggest machine)
- ❌ Single point of failure

**Horizontal (Scale Out):** Add more machines.
- ✅ Near-unlimited scale
- ✅ No single point of failure
- ❌ Requires stateless design, load balancing

**Rule:** Design stateless services. Store state in databases/caches, not in-memory.

---

## CAP Theorem

In a distributed system, you can guarantee only 2 of 3:

- **C — Consistency:** Every read sees the most recent write
- **A — Availability:** Every request gets a (non-error) response
- **P — Partition Tolerance:** System works despite network splits

In real networks, P must be guaranteed. So the choice is:
- **CP systems:** Consistent but may reject requests during partition. (HBase, Zookeeper, MongoDB)
- **AP systems:** Available and responsive but may return stale data. (Cassandra, DynamoDB, CouchDB)

**Interview answer:** "We chose AP for this service because availability is more important than consistency. We handle eventual consistency at the application layer."

---

## Consistency Models

1. **Strong Consistency:** All reads see the latest write. Expensive. Good for banking.
2. **Eventual Consistency:** Reads may return stale data; will converge eventually. Fast. Good for social feeds.
3. **Read-after-write Consistency:** A user always sees their own writes. Middle ground. Good for profile updates.

---

## Latency Numbers (Memorise These)

| Operation | Approx Latency |
|-----------|---------------|
| L1 cache reference | 1 ns |
| L2 cache reference | 10 ns |
| Main memory access | 100 ns |
| SSD random read | 150 μs |
| Network round trip (same DC) | 500 μs |
| HDD seek | 10 ms |
| Network round trip (cross continent) | 150 ms |

**1 μs = 1000 ns. 1 ms = 1000 μs. L1 < RAM < SSD < HDD < Network.**`,
  },
  {
    id: 'load-balancing',
    title: 'Load Balancing',
    tag: 'Infrastructure',
    desc: 'Distribute traffic across servers. Algorithms: round-robin, least connections, consistent hashing.',
    content: `# Load Balancing

## What It Does
Distributes incoming requests across multiple servers to:
- Prevent overloading any single server
- Maximize throughput
- Minimize response time
- Ensure availability (route around failed servers)

---

## Load Balancing Algorithms

### Round Robin
Each server gets requests in rotation. Simple. Works when servers are identical.

### Weighted Round Robin
Servers with more capacity get more requests. Server A (8 core): weight 4. Server B (2 core): weight 1.

### Least Connections
New request → server with fewest active connections. Good for long-lived connections (WebSockets).

### IP Hash (Sticky Sessions)
Hash client IP → always route to same server. Needed when session state is stored on server (avoid this if possible).

### Consistent Hashing ← Most Important for Interviews
Hash both servers AND keys onto a ring. Key maps to nearest server clockwise. 
- Adding/removing a server affects only ~1/n keys
- Used by: Cassandra, DynamoDB, Memcached

---

## Layer 4 vs Layer 7 Load Balancing

| | L4 (Transport) | L7 (Application) |
|---|---|---|
| Works on | IP/TCP/UDP | HTTP, WebSocket |
| Speed | Faster | Slightly slower |
| Content inspection | No | Yes |
| Use case | TCP load balancing | HTTP routing, SSL termination |

L7 can route /api to one cluster and /static to another.

---

## Health Checks
Load balancer periodically sends health checks (HTTP GET /health). Unhealthy servers are removed from rotation. Types:
- **Active:** LB sends ping
- **Passive:** LB observes real traffic failures

---

## Interview Pattern
"Our API layer is stateless and sits behind an L7 load balancer. We use least-connections for our WebSocket servers and round-robin for REST endpoints. Consistent hashing distributes data across our Cassandra nodes."`,
  },
  {
    id: 'caching',
    title: 'Caching',
    tag: 'Performance',
    desc: 'Redis, Memcached, cache invalidation strategies, CDN caching, write-through vs write-back.',
    content: `# Caching

## Why Cache?
- Database queries: 1–10 ms
- Cache reads: 0.1–1 ms
- 10–100x speedup for repeated reads

Cache frequently-accessed, rarely-changing data.

---

## Cache-Aside (Lazy Loading) ← Most Common Pattern
1. App checks cache for data
2. Cache HIT → return data
3. Cache MISS → query DB → store in cache → return data

**Pros:** Cache only what's actually requested. Resilient to cache failure.
**Cons:** Initial cache miss is slow. Stale data after DB write.

```
def get_user(user_id):
    # 1. Check cache
    user = cache.get(f"user:{user_id}")
    if user: return user
    
    # 2. Cache miss — hit DB
    user = db.query("SELECT * FROM users WHERE id=?", user_id)
    
    # 3. Populate cache
    cache.set(f"user:{user_id}", user, ttl=3600)
    return user
```

---

## Write-Through
Write to cache AND DB simultaneously. Cache always current.
**Pros:** No stale data. **Cons:** Write latency. Cache fills with infrequently-read data.

## Write-Back (Write-Behind)
Write to cache only. Asynchronously flush to DB.
**Pros:** Very fast writes. **Cons:** Data loss risk if cache fails before flush.

---

## Cache Invalidation
The hardest problem. Three strategies:
1. **TTL (Time-to-Live):** Auto-expire after N seconds. Simple. Accept some staleness.
2. **Event-driven:** On DB write, explicitly delete or update cache key.
3. **Cache-aside + short TTL:** Accept brief staleness, auto-heal.

---

## Redis vs Memcached

| | Redis | Memcached |
|---|---|---|
| Data types | Strings, Lists, Sets, Hashes, Sorted Sets | Strings only |
| Persistence | Yes (RDB snapshots, AOF) | No |
| Replication | Yes | No |
| Pub/Sub | Yes | No |
| Use case | Sessions, leaderboards, rate limiting, queues | Pure caching |

**Almost always choose Redis.** It's a superset of Memcached.

---

## CDN Caching
CDN = Content Delivery Network. Caches static assets (images, JS, CSS) close to users.
- Cache-Control: max-age=31536000 (1 year)
- Invalidate with versioned URLs: /app.v2.js

---

## Cache Eviction Policies
- **LRU (Least Recently Used):** Evict the entry not accessed longest. Most common.
- **LFU (Least Frequently Used):** Evict least accessed overall.
- **TTL:** Auto-expire.`,
  },
  {
    id: 'databases',
    title: 'Databases & Storage',
    tag: 'Storage',
    desc: 'SQL vs NoSQL, indexing, sharding, replication, ACID, BASE, database selection.',
    content: `# Databases & Storage

## SQL vs NoSQL

### When to use SQL (PostgreSQL, MySQL)
- Data has clear relations and you need JOINs
- ACID transactions are required (banking, payments)
- Schema is stable and well-defined
- Complex queries (aggregations, GROUP BY)

### When to use NoSQL
- **Document (MongoDB, DynamoDB):** Flexible schema, JSON documents, nested data
- **Columnar (Cassandra, HBase):** Time-series, write-heavy, analytics
- **Key-Value (Redis, DynamoDB):** Simple lookup by key, session storage
- **Graph (Neo4j):** Social networks, recommendation engines

---

## ACID Properties (SQL)
- **Atomicity:** Transaction either fully completes or fully rolls back
- **Consistency:** DB goes from one valid state to another
- **Isolation:** Concurrent transactions appear sequential
- **Durability:** Committed data persists even after crash

## BASE Properties (NoSQL)
- **Basically Available**
- **Soft state** (may be temporarily inconsistent)
- **Eventually consistent**

---

## Indexing

**B-Tree Index** (default): Balanced tree. O(log n) search. Good for range queries (BETWEEN, >, <).
**Hash Index:** O(1) exact lookup. No range queries.
**Composite Index:** Multi-column. Column ORDER matters. (a, b, c) helps queries on a, (a,b), (a,b,c) but NOT (b,c).

```sql
-- Create index
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_user_date ON orders(user_id, created_at);

-- Query that USES the composite index:
SELECT * FROM orders WHERE user_id=1 AND created_at > '2024-01-01';

-- Query that does NOT use (user_id, created_at) composite:
SELECT * FROM orders WHERE created_at > '2024-01-01';  -- skips user_id
```

**EXPLAIN ANALYZE** to see if index is used.

---

## Replication

**Primary-Replica (Master-Slave):**
- All writes to primary
- Reads distributed across replicas
- Replicas lag behind primary (eventual consistency)
- Automatic failover: replica promoted if primary dies

**Multi-Primary:** Multiple nodes accept writes. Conflict resolution needed. Complex. Used when low write latency globally needed (DynamoDB Global Tables).

---

## Sharding (Horizontal Partitioning)

Split data across multiple DB nodes. Each shard holds a subset of rows.

**Sharding strategies:**
- **Range:** Users A-M on shard1, N-Z on shard2. Risk: hotspots.
- **Hash:** hash(user_id) % num_shards. Even distribution. Hard to range query.
- **Directory:** Lookup table maps key to shard. Flexible. Single point of failure.

**Challenges:** JOINs across shards are expensive. Keep related data on same shard.

---

## Interview: Database Selection Framework
1. What is the data model? (relational, document, time-series?)
2. Are ACID transactions required?
3. What are read vs write ratios?
4. How much data? (fits on one machine vs need sharding)
5. What queries will be run? (exact lookup, range, aggregation, graph traversal)`,
  },
  {
    id: 'message-queues',
    title: 'Message Queues & Event Streaming',
    tag: 'Async',
    desc: 'Kafka, RabbitMQ, pub-sub, event-driven architecture, async processing.',
    content: `# Message Queues & Event Streaming

## Why Message Queues?

**Decouple producers from consumers.** Producer writes to queue. Consumer reads at its own pace. Neither knows about the other.

Benefits:
- **Async processing:** User gets instant response, work happens in background
- **Rate limiting:** Consumer processes at sustainable rate regardless of burst
- **Resilience:** If consumer crashes, messages stay in queue
- **Fanout:** One message → multiple consumers

---

## Kafka vs RabbitMQ

| | Kafka | RabbitMQ |
|---|---|---|
| Model | Event log (persist everything) | Message queue (delete after consume) |
| Throughput | Millions/sec | Thousands/sec |
| Retention | Days to forever | Until consumed |
| Replay | Yes (rewind offset) | No |
| Ordering | Per partition | Per queue |
| Use case | Event streaming, analytics, audit log | Task queue, RPC, work distribution |

**Rule:** High-throughput, event streaming, need replay → Kafka. Simple task queue → RabbitMQ or SQS.

---

## Kafka Concepts

**Topic:** Named stream of messages. Analogous to a DB table.
**Partition:** Topic split into N partitions for parallelism. Each partition = ordered log.
**Offset:** Position of message in partition. Consumer tracks its offset.
**Consumer Group:** Multiple consumers sharing work from one topic. Each partition → exactly one consumer in group.

```
Topic: "user-events"
  Partition 0: [msg0, msg1, msg2, ...]  ← Consumer A reads this
  Partition 1: [msg0, msg1, msg2, ...]  ← Consumer B reads this
  Partition 2: [msg0, msg1, msg2, ...]  ← Consumer C reads this
```

---

## Pub/Sub Pattern
Publisher sends to a **topic**. All **subscribers** receive a copy.

Producer → Topic → [Consumer1, Consumer2, Consumer3]

vs Message Queue (competing consumers):

Producer → Queue → [Consumer1 OR Consumer2 OR Consumer3]

---

## Common Patterns

### Async Notification (Email, Push)
User action → API writes event to queue → Email service consumes and sends → User gets email within seconds.

### Fan-Out on Write (Twitter Timeline)
User posts tweet → Event → Timeline Service fans out to follower queues → Each follower's timeline updated.

### Event Sourcing
Store every state change as an immutable event in Kafka. Replay events to rebuild state. Full audit log. Complex but powerful.

---

## Idempotency ← Critical
Messages can be delivered **at least once** (Kafka default). Consumer must be **idempotent**: processing same message twice has same effect as once.

```python
# Not idempotent — do NOT do this:
def process(order_id): charge_card(order_id)

# Idempotent — safe to retry:
def process(order_id):
    if not already_charged(order_id):
        charge_card(order_id)
        mark_charged(order_id)
````,
  },
  {
    id: 'api-design',
    title: 'API Design & REST vs gRPC',
    tag: 'Interface',
    desc: 'RESTful API design, HTTP methods, status codes, pagination, rate limiting, gRPC, GraphQL.',
    content: `# API Design

## REST Principles

1. **Stateless:** Server stores no client state between requests
2. **Uniform Interface:** Use HTTP methods semantically
3. **Resource-Based:** URLs represent resources (nouns, not verbs)

## HTTP Methods

| Method | Use | Idempotent? |
|--------|-----|-------------|
| GET | Read resource | Yes |
| POST | Create resource | No |
| PUT | Replace resource | Yes |
| PATCH | Update partial | No |
| DELETE | Delete resource | Yes |

## URL Design (Resource-First)

```
✅ GET    /users/123           → get user 123
✅ POST   /users               → create user
✅ PUT    /users/123           → replace user 123
✅ PATCH  /users/123           → update user 123 fields
✅ DELETE /users/123           → delete user 123
✅ GET    /users/123/posts     → get posts by user 123
✅ POST   /users/123/follow    → follow user 123

❌ GET    /getUser?id=123      → verb in URL
❌ POST   /deleteUser/123      → wrong method
```

## Status Codes (Memorise)

| Code | Meaning |
|------|---------|
| 200 OK | Success |
| 201 Created | Resource created (POST) |
| 204 No Content | Success, no body (DELETE) |
| 400 Bad Request | Client error, invalid input |
| 401 Unauthorized | Not authenticated |
| 403 Forbidden | Authenticated but not authorized |
| 404 Not Found | Resource doesn't exist |
| 409 Conflict | Duplicate resource |
| 422 Unprocessable | Validation failed |
| 429 Too Many Requests | Rate limited |
| 500 Internal Server Error | Server bug |
| 503 Service Unavailable | Server down/overloaded |

---

## Pagination

**Offset pagination:** Simple but slow for large offsets.
```
GET /posts?limit=20&offset=100
```

**Cursor pagination:** Fast, consistent. Cursor = last seen ID.
```
GET /posts?limit=20&after=eyJpZCI6MTAwfQ==
Response: { "data": [...], "next_cursor": "eyJpZCI6MTIwfQ==" }
```
Use cursor for large datasets and real-time feeds.

---

## Rate Limiting

**Algorithms:**
- **Fixed Window:** N requests per time window. Problem: burst at boundary.
- **Sliding Window:** Track exact request times. Accurate. Memory-heavy.
- **Token Bucket:** Tokens replenish at rate R. Max burst = bucket size. AWS default.
- **Leaky Bucket:** Requests processed at fixed rate. Queue smooths bursts.

**Implementation:** Redis INCR + TTL for simple rate limiting.
```python
def is_rate_limited(user_id, limit=100, window=60):
    key = f"rl:{user_id}:{int(time.time()//window)}"
    count = redis.incr(key)
    if count == 1: redis.expire(key, window)
    return count > limit
```

---

## REST vs gRPC

| | REST | gRPC |
|---|---|---|
| Protocol | HTTP/1.1 + JSON | HTTP/2 + Protobuf |
| Performance | OK | 5-7x faster (binary, multiplexing) |
| Schema | Optional (OpenAPI) | Required (proto files) |
| Streaming | No (polling/SSE) | Bidirectional streaming |
| Browser | Yes | Limited (grpc-web) |
| Use case | Public APIs, client-to-server | Internal microservices |

**Rule:** External APIs → REST. Internal microservices → gRPC.`,
  },
  {
    id: 'design-url-shortener',
    title: 'Design: URL Shortener',
    tag: 'Interview Problem',
    desc: 'Classic interview problem. Covers hashing, databases, caching, redirects.',
    content: `# Design a URL Shortener (like bit.ly)

## Step 1: Requirements Clarification (always do this first)

**Functional:**
- Shorten a long URL → short URL (e.g. https://bit.ly/abc123)
- Redirect short URL → original long URL
- Optional: custom aliases, expiration, analytics

**Non-functional:**
- 100M URLs created/day
- Reads 10x writes → 1B reads/day
- URLs should be unique
- Redirects should be fast (<10ms)
- Available 99.9%

---

## Step 2: Capacity Estimation

**Write:** 100M/day = 1160/sec
**Read:** 1B/day = 11600/sec
**Storage:** 100M × 500 bytes = 50GB/day → 18TB/year

---

## Step 3: System Design

### Short URL Generation

**Approach 1: MD5/SHA256 Hash**
MD5(longURL) → 128 bits → take first 6 chars of base62 → 62^6 = 56B combinations
Problem: Hash collisions possible.

**Approach 2: Counter + Base62** ← Better
Auto-increment counter (1, 2, 3...). Convert to base62 (a-z, A-Z, 0-9).
1 → "a", 62 → "B0", etc.
Problem: Sequential, predictable. Counter is a single point of failure.

**Approach 3: Snowflake ID** ← Production
Distributed unique ID (Twitter Snowflake): timestamp + machine ID + sequence.
Convert to base62 for short URL.

### Data Model
```sql
CREATE TABLE urls (
    short_code VARCHAR(10) PRIMARY KEY,
    long_url TEXT NOT NULL,
    user_id BIGINT,
    created_at TIMESTAMP,
    expires_at TIMESTAMP,
    hit_count BIGINT DEFAULT 0
);

CREATE INDEX idx_long_url ON urls(long_url);  -- dedup check
```

### Flow
**Write:**
1. Validate URL
2. Check if long URL already exists (return existing short code)
3. Generate unique short code
4. Store in DB
5. Return short URL

**Read:**
1. Get short code from URL
2. Check Redis cache (key: short_code, value: long_url)
3. Cache hit → 301 redirect
4. Cache miss → query DB → store in cache → redirect

### Architecture
```
Client → Load Balancer → Write Service → DB + Cache
                      → Read Service → Cache → DB (fallback)
```

---

## Step 4: Deep Dives

**301 vs 302:**
- 301 Permanent Redirect: Browser caches. Faster repeat visits. No analytics.
- 302 Temporary Redirect: Every request hits your server. You see analytics.
**→ Use 302 if analytics needed.**

**Cache:** Redis with TTL = 24h. Cache most popular URLs. LRU eviction.

**Analytics (async):** On redirect, push {short_code, timestamp, IP} to Kafka. Consumer updates analytics DB asynchronously. Don't block the redirect.

**Custom aliases:** Allow user to specify short code. Check for collision in DB before accepting.

**Cleanup:** Background job deletes expired URLs daily.`,
  },
  {
    id: 'design-twitter',
    title: 'Design: Twitter / Social Feed',
    tag: 'Interview Problem',
    desc: 'News feed generation, fan-out strategies, timelines at scale.',
    content: `# Design Twitter (Social Feed)

## Core Features
- Post tweets (≤280 chars)
- Follow/unfollow users
- View home timeline (tweets from followed users, reverse chronological)
- Search tweets

## Scale
- 500M tweets/day (6000 tweets/sec)
- 300M daily active users
- Timeline loads → read-heavy

---

## Timeline Generation Approaches

### Push (Fan-Out on Write) — For users with few followers
When user posts tweet:
1. Get all followers
2. Push tweet to each follower's timeline cache

**Read is O(1)** — timeline is precomputed.
**Write is expensive** if you have 10M followers (Lady Gaga problem).

### Pull (Fan-In on Read) — For celebrities
When user opens timeline:
1. Get list of who user follows
2. Fetch recent tweets from each
3. Merge and sort by timestamp

**Write is O(1).**
**Read is expensive** — N database queries merged.

### Hybrid (Twitter's Actual Approach) ← Use This
- Regular users (< 1M followers): Fan-out on write to timeline caches
- Celebrities (> 1M followers): Excluded from fan-out. Fetched at read time and merged.

---

## Data Model

```sql
-- Tweets
CREATE TABLE tweets (
    tweet_id BIGINT PRIMARY KEY,   -- Snowflake ID
    user_id BIGINT,
    content VARCHAR(280),
    created_at TIMESTAMP,
    like_count INT,
    retweet_count INT
);

-- Follows (graph)
CREATE TABLE follows (
    follower_id BIGINT,
    followee_id BIGINT,
    PRIMARY KEY (follower_id, followee_id)
);

-- Home Timeline (cache in Redis)
-- Redis Sorted Set: key="timeline:{user_id}", score=tweet_timestamp, member=tweet_id
```

---

## System Components

```
Tweet POST:
User → API → Fanout Service → Redis (follower timelines)
                            → Cassandra (permanent storage)
                            → Kafka (analytics, notifications)

Timeline GET:
User → API → Redis (sorted set of tweet IDs)
           → Tweet Service (fetch tweet data by IDs)
           → [Merge celebrity tweets at read time]
           → Return sorted timeline
```

---

## Key Design Decisions

**Storage:**
- Tweets: Cassandra (write-heavy, append-only, time-series)
- Media (photos/video): S3 + CDN
- Timeline: Redis Sorted Set (tweet_id sorted by timestamp)
- Graph (follows): MySQL (relatively small, structured)

**Read path:**
1. Fetch up to 200 tweet IDs from Redis Sorted Set (fast)
2. Batch fetch tweet content from Cassandra or cache by tweet IDs
3. Hydrate with user profile data
4. Return

**Search:** Elasticsearch for full-text search. Tweets indexed asynchronously via Kafka consumer.

**Trending:** Count hashtag occurrences in a sliding 24h window using Redis counters. Top-N via Redis Sorted Set.`,
  },
  {
    id: 'design-netflix',
    title: 'Design: Netflix / Video Streaming',
    tag: 'Interview Problem',
    desc: 'Video encoding pipeline, CDN distribution, adaptive bitrate, recommendation.',
    content: `# Design Netflix

## Core Requirements
- Upload and store videos (admin)
- Stream video to users with adaptive quality
- Search for content
- Recommendations

## Scale
- 220M subscribers, 100M+ hours streamed daily
- Global distribution
- Video files: 4K file = 50GB+

---

## Video Upload Pipeline

```
Raw Video → Upload Service → S3 (raw)
                           → Transcoding Service (parallelized)
                           ↓
                     Multiple Formats:
                     - 240p, 360p, 480p, 720p, 1080p, 4K
                     - H.264, H.265, AV1
                     - HLS / DASH (chunked)
                           ↓
                     CDN (CloudFront / Netflix Open Connect)
```

**Transcoding:** Video split into segments (2-4 sec each). Each segment transcoded independently in parallel. Reassembled after.

**HLS (HTTP Live Streaming):** 
- Video split into .ts segments
- .m3u8 manifest file lists all segments and bitrates
- Client downloads manifest, picks bitrate, streams segments

---

## Adaptive Bitrate Streaming (ABR)

Client monitors:
- Current download speed
- Buffer level

If buffer drops low → switch to lower quality to prevent buffering.
If speed is high → switch to higher quality.

Player downloads segment list at each quality level. Switches between quality levels between segments.

---

## CDN Strategy

Netflix uses their own CDN: **Open Connect Appliances (OCA)** placed in ISP data centers.

- Popular content pre-positioned on nearby OCA at night
- User request → nearest OCA → serves from cache → no internet transit
- ~90% of Netflix traffic served from OCAs (never touches Netflix data centers)

For cache miss: fallback to Netflix origin servers in AWS.

---

## Database Choices

| Data | Storage |
|------|---------|
| User accounts | MySQL (structured, ACID) |
| Video metadata | Cassandra (scale, availability) |
| View history, ratings | Cassandra (time-series) |
| Search index | Elasticsearch |
| Recommendations | Offline ML pipeline → DynamoDB |
| Session/token | Redis |

---

## Recommendation System
1. **Offline (batch):** Collaborative filtering on viewing history. Run daily. Export results to DB.
2. **Near-real-time:** Session signals (what you just watched) → lightweight model → update recommendations.
3. **Online A/B testing:** Multiple ranking models tested simultaneously on user buckets.`,
  },
  {
    id: 'design-whatsapp',
    title: 'Design: WhatsApp / Messaging',
    tag: 'Interview Problem',
    desc: 'Real-time messaging, WebSockets, message delivery guarantees, presence, encryption.',
    content: `# Design WhatsApp

## Core Features
- 1:1 messaging
- Group chat (up to 256 members)
- Online presence (last seen, typing indicators)
- Message delivery receipts (sent ✓, delivered ✓✓, read ✓✓ blue)
- End-to-end encryption

## Scale
- 2B users, 100B messages/day
- 1M+ messages/sec

---

## Real-Time Messaging: WebSocket

Why WebSocket over HTTP?
- HTTP: Client must poll server (new request every N seconds). Wasteful.
- **WebSocket:** Persistent bidirectional connection. Server can PUSH messages to client instantly.

**Connection Management:**
- Each user connects to a Chat Service instance via WebSocket
- A connection manager (Redis) maps user_id → server instance
- Load balancer uses consistent hashing to route users to same server

---

## Message Flow: Send Message

```
Sender → Chat Server A (via WebSocket)
  ↓
1. Chat Server A checks: is recipient online?
   → Query connection manager: which server is recipient on?
   
2a. Recipient ONLINE (on Server B):
    Chat Server A → Message Queue (Kafka) → Chat Server B → Recipient
    
2b. Recipient OFFLINE:
    Chat Server A → Message DB (Cassandra) → Push Notification (FCM/APNS)
    → Recipient comes online → Message Server fetches pending → deliver
```

---

## Message Storage

**Cassandra** for messages:
```
Table: messages
  Partition key: conversation_id
  Clustering key: message_id (Snowflake, time-ordered)
  
Table: user_conversations
  Partition key: user_id
  Clustering key: last_message_time (DESC for latest first)
```

Store messages for N days (or indefinitely for users who haven't seen them).

---

## Delivery Receipts

1. **Sent (✓):** Server ACKs receipt of message. Client marks as sent.
2. **Delivered (✓✓):** Recipient's app sends delivery receipt when message received from server.
3. **Read (blue ✓✓):** Recipient's app sends read receipt when user opens conversation.

Receipts sent back via same WebSocket channel.

---

## Presence (Online/Typing)

**Online status:** 
- User connects WebSocket → mark online in Redis (key: user:{id}:online, TTL=30s)
- Heartbeat every 15s to renew TTL
- User disconnects / heartbeat stops → key expires → offline

**Typing indicator:**
- User starts typing → send "typing" event via WebSocket → server forwards to conversation members
- Auto-cancel after 5s or on send/backspace-to-empty

---

## End-to-End Encryption (E2EE)

**Signal Protocol** (used by WhatsApp, Signal, Facebook Messenger):
- Each device has a public/private key pair
- Messages encrypted with recipient's public key
- Only recipient's private key (on their device) can decrypt
- Server never sees plaintext

Key management: WhatsApp servers store public keys. Private keys NEVER leave device.`,
  },
];
