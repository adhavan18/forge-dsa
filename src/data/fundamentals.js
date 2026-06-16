export const FUNDAMENTALS = [
  {
    id: 'os',
    title: 'Operating Systems',
    color: 'var(--p6)',
    sections: [
      {
        title: 'Processes vs Threads',
        content: `**Process:** Independent program with its own memory space, file handles, and resources.
**Thread:** Lightweight unit within a process. Shares memory, code, and file handles with other threads in the same process.

| | Process | Thread |
|---|---|---|
| Memory | Separate | Shared |
| Communication | IPC (pipes, sockets) | Shared memory |
| Overhead | High (fork) | Low |
| Crash impact | Isolated | Can crash whole process |

**Context Switch:** Saving process state (registers, PC, stack) and restoring another's. More expensive for processes than threads.`,
      },
      {
        title: 'CPU Scheduling Algorithms',
        content: `**FCFS (First Come First Served):** Simple queue. Convoy effect — short jobs wait behind long ones.

**SJF (Shortest Job First):** Optimal average waiting time. Requires knowing burst time in advance (hard in practice).

**Round Robin:** Each process gets a time quantum (e.g., 10ms). Preemptive. Good for interactive systems.
- Large quantum → behaves like FCFS
- Small quantum → high context switch overhead

**Priority Scheduling:** Each process has a priority. Starvation problem: low-priority processes may never run. Solution: **Aging** (increase priority over time).

**Multilevel Queue:** Processes grouped into queues by type (foreground/background). Each queue has its own scheduling algorithm.`,
      },
      {
        title: 'Deadlock',
        content: `**Four Necessary Conditions (Coffman):**
1. **Mutual Exclusion:** At least one resource is non-shareable
2. **Hold and Wait:** Process holds resource while waiting for another
3. **No Preemption:** Resources cannot be forcibly taken
4. **Circular Wait:** P1 waits for P2, P2 waits for P3, P3 waits for P1

**Prevention:** Break one of the four conditions.
**Avoidance:** **Banker's Algorithm** — grant resource only if safe state maintained.
**Detection:** Allow deadlock, detect via resource allocation graph, recover by killing processes.

**Deadlock vs Starvation:**
- Deadlock: circular dependency, processes blocked PERMANENTLY
- Starvation: low-priority process waits INDEFINITELY (but no cycle)`,
      },
      {
        title: 'Memory Management & Paging',
        content: `**Virtual Memory:** Allows processes to use more memory than physically available. OS swaps pages to/from disk.

**Paging:** Memory divided into fixed-size blocks:
- Physical: **Frames**
- Logical: **Pages**
- Page Table: maps logical page number → physical frame number

**Page Fault:** Requested page not in RAM. OS must:
1. Pause process
2. Load page from disk
3. Update page table
4. Resume process

**Page Replacement Algorithms:**
- **FIFO:** Replace oldest page. Simple. Belady's anomaly (more frames → more faults).
- **LRU:** Replace least recently used. No Belady's. Hard to implement perfectly.
- **Optimal:** Replace page not used for longest time. Theoretical best. Not feasible (future unknown).

**Thrashing:** Process spends more time paging than executing. Caused by too many processes / too little RAM.`,
      },
      {
        title: 'Synchronisation & Semaphores',
        content: `**Race Condition:** Multiple processes access shared data concurrently → unpredictable result.

**Critical Section:** Code that accesses shared resources. Must be executed atomically.

**Mutex (Mutual Exclusion Lock):**
- lock() before entering critical section
- unlock() after
- Only one thread can hold the lock at a time

**Semaphore:**
- Counting semaphore: allows N concurrent accesses
- Binary semaphore: 0 or 1 (like mutex)
- wait() (P): decrement, block if 0
- signal() (V): increment, wake blocked process

**Monitor:** High-level synchronization construct. Methods are implicitly mutual exclusive. Java synchronized keyword.

**Classic Problems:**
- Producer-Consumer: buffer shared between producer and consumer threads
- Readers-Writers: multiple readers OK, writers need exclusive access
- Dining Philosophers: 5 philosophers, 5 forks, eat with 2 adjacent forks → deadlock risk`,
      },
    ],
  },
  {
    id: 'networks',
    title: 'Computer Networks',
    color: 'var(--p6)',
    sections: [
      {
        title: 'OSI Model',
        content: `**7 Layers (top to bottom):**

| Layer | Name | Protocols | Device |
|---|---|---|---|
| 7 | Application | HTTP, FTP, SMTP, DNS | — |
| 6 | Presentation | SSL/TLS, JPEG, MP4 | — |
| 5 | Session | NetBIOS, RPC | — |
| 4 | Transport | TCP, UDP | — |
| 3 | Network | IP, ICMP, ARP | Router |
| 2 | Data Link | Ethernet, WiFi (802.11) | Switch |
| 1 | Physical | Cables, Radio | Hub |

**Mnemonic:** "All People Seem To Need Data Processing" (top to bottom).

**TCP/IP Model (4 layers):** Application (OSI 5-7), Transport (OSI 4), Internet (OSI 3), Network Access (OSI 1-2).`,
      },
      {
        title: 'TCP vs UDP',
        content: `**TCP (Transmission Control Protocol):**
- Connection-oriented: 3-way handshake (SYN → SYN-ACK → ACK)
- Reliable: acknowledgments, retransmission
- Ordered: sequence numbers
- Flow control: sliding window
- Congestion control: slow start, AIMD
- Use: HTTP, HTTPS, FTP, SMTP, SSH

**UDP (User Datagram Protocol):**
- Connectionless: no handshake
- Unreliable: no acknowledgments
- Unordered: no sequence numbers
- Fast: minimal overhead
- Use: DNS, DHCP, video streaming, online gaming, VoIP

**3-Way Handshake:**
1. Client → SYN (seq=x)
2. Server → SYN-ACK (seq=y, ack=x+1)
3. Client → ACK (ack=y+1)

**4-Way Teardown (FIN):**
FIN → FIN-ACK → FIN → FIN-ACK`,
      },
      {
        title: 'HTTP & HTTPS',
        content: `**HTTP (HyperText Transfer Protocol):**
- Stateless request-response protocol
- Default port: 80
- Text-based headers

**HTTP/1.1 vs HTTP/2 vs HTTP/3:**
| | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| Multiplexing | No (one req/connection or pipelining) | Yes | Yes |
| Header compression | No | HPACK | QPACK |
| Server push | No | Yes | Yes |
| Transport | TCP | TCP | UDP (QUIC) |
| Binary | No | Yes | Yes |

**HTTPS:** HTTP + TLS (Transport Layer Security).
TLS Handshake:
1. Client Hello (supported ciphers, TLS version)
2. Server Hello + Certificate
3. Client verifies cert with CA
4. Key exchange (asymmetric → shared symmetric key)
5. Encrypted communication

**Status Codes:** 1xx=Info, 2xx=Success, 3xx=Redirect, 4xx=Client Error, 5xx=Server Error.

**Cookies vs Sessions:**
- Cookie: data stored CLIENT-side. Sent with every request.
- Session: data stored SERVER-side. Session ID sent in cookie.`,
      },
      {
        title: 'DNS & IP',
        content: `**DNS (Domain Name System):** Translates domain names to IP addresses.

**DNS Resolution (iterative):**
1. Browser cache → OS cache → Resolver cache
2. If not found: Resolver queries Root DNS (.) 
3. Root → points to TLD nameserver (.com)
4. TLD → points to Authoritative nameserver (google.com)
5. Authoritative → returns IP address
6. Cached at each step with TTL

**Record Types:**
- A: domain → IPv4 address
- AAAA: domain → IPv6 address
- CNAME: domain → another domain (alias)
- MX: mail server
- TXT: verification, SPF, DKIM

**IPv4 vs IPv6:**
- IPv4: 32 bits, ~4.3B addresses
- IPv6: 128 bits, 340 undecillion addresses

**Subnetting:** Divide network into smaller subnets.
CIDR notation: 192.168.1.0/24 → /24 means 24 bits for network, 8 for hosts.
/24 → 256 hosts, /16 → 65536 hosts.`,
      },
      {
        title: 'WebSockets & Long Polling',
        content: `**Short Polling:** Client sends request every N seconds.
- Wasteful (most responses are empty)

**Long Polling:** Client sends request, server holds it open until data is available.
- Better than short polling
- Each response requires new request

**WebSocket:** Persistent bidirectional connection.
1. HTTP Upgrade request
2. Server responds 101 Switching Protocols
3. Bidirectional frames over same TCP connection

**Use WebSocket when:** Chat, live notifications, collaborative editing, real-time dashboards.

**Server-Sent Events (SSE):** One-directional (server → client). Simpler than WebSocket. Good for news feeds, stock tickers.`,
      },
    ],
  },
  {
    id: 'dbms',
    title: 'Database Management Systems',
    color: 'var(--p6)',
    sections: [
      {
        title: 'Normalization',
        content: `**Purpose:** Reduce data redundancy, improve data integrity.

**1NF (First Normal Form):**
- No repeating groups
- Each column has atomic values
- Each row is unique

**2NF (Second Normal Form):**
- Must be 1NF
- Every non-key attribute fully depends on the PRIMARY KEY
- No partial dependency (applies to composite keys)

**3NF (Third Normal Form):**
- Must be 2NF
- No transitive dependency: non-key attribute → non-key attribute

**BCNF (Boyce-Codd):** Stricter version of 3NF. Every determinant must be a candidate key.

**Denormalization:** Intentional redundancy for query performance. Trade-off: faster reads, harder updates.`,
      },
      {
        title: 'Transactions & ACID',
        content: `**Transaction:** Logical unit of work that must be all-or-nothing.

**ACID Properties:**
- **Atomicity:** All operations succeed or all roll back
- **Consistency:** DB moves from one valid state to another
- **Isolation:** Concurrent transactions appear sequential
- **Durability:** Committed changes survive crashes (written to disk/WAL)

**Isolation Levels (weakest to strongest):**
1. **Read Uncommitted:** Can read uncommitted changes. Dirty reads possible.
2. **Read Committed:** Only committed data. No dirty reads. Non-repeatable reads possible.
3. **Repeatable Read:** Same query returns same data within transaction. Phantom reads possible.
4. **Serializable:** Full isolation. Slowest.

**Concurrency Problems:**
- **Dirty Read:** Read uncommitted data that later rolls back
- **Non-repeatable Read:** Same row read twice gives different values
- **Phantom Read:** Same query returns different ROWS (insert/delete between reads)`,
      },
      {
        title: 'Indexing',
        content: `**Primary Index:** On primary key. Always exists. Unique.
**Unique Index:** Enforces uniqueness. Like primary but can have NULLs.
**Non-Unique Index:** Speeds up queries on non-key columns. Multiple rows can have same value.
**Composite Index:** On multiple columns. Order matters!

**B-Tree (default):** Balanced tree. Supports =, <, >, BETWEEN, ORDER BY.
**Hash Index:** Only supports =. Very fast exact lookups. No range queries.
**Full-Text Index:** For LIKE '%word%' style searches.
**Bitmap Index:** For low-cardinality columns (gender, status). Good for analytics.

**Index Selection:**
- Index columns in WHERE clauses
- Index JOIN columns
- Index columns in ORDER BY / GROUP BY
- Composite index: put most selective column FIRST
- Too many indexes slow down writes (every insert updates all indexes)

**EXPLAIN:** Use EXPLAIN/EXPLAIN ANALYZE to see query plan and index usage.`,
      },
      {
        title: 'SQL Queries',
        content: `**Essential SQL Patterns:**

\`\`\`sql
-- Window Functions (FAANG favourite)
SELECT name, salary,
  RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as rank,
  LAG(salary) OVER (ORDER BY hire_date) as prev_salary
FROM employees;

-- Second highest salary
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- Duplicate detection
SELECT email, COUNT(*) FROM users
GROUP BY email HAVING COUNT(*) > 1;

-- Running total
SELECT date, amount,
  SUM(amount) OVER (ORDER BY date) as running_total
FROM sales;

-- Department with highest avg salary
SELECT dept, AVG(salary) as avg_sal
FROM employees
GROUP BY dept
ORDER BY avg_sal DESC
LIMIT 1;

-- Employees who earn more than their manager
SELECT e.name FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;
\`\`\`

**JOIN types:** INNER (intersection), LEFT (all left + matching right), RIGHT (all right + matching left), FULL OUTER (union).`,
      },
    ],
  },
  {
    id: 'oop',
    title: 'OOP & Design Patterns',
    color: 'var(--p6)',
    sections: [
      {
        title: 'OOP Pillars',
        content: `**Encapsulation:** Bundle data and methods that operate on it. Hide internal state. Access via public interface.
\`\`\`python
class BankAccount:
    def __init__(self): self.__balance = 0  # private
    def deposit(self, amt):
        if amt > 0: self.__balance += amt
    def get_balance(self): return self.__balance
\`\`\`

**Abstraction:** Expose only necessary details. Hide complexity.
\`\`\`python
class Car:
    def accelerate(self): ...  # user doesn't know HOW engine works
\`\`\`

**Inheritance:** Child class inherits from parent. Promotes reuse. "is-a" relationship.
\`\`\`python
class Animal:
    def speak(self): print("...")
class Dog(Animal):
    def speak(self): print("Woof")  # override
\`\`\`

**Polymorphism:** Same interface, different behavior. Method overriding (runtime) and overloading (compile-time).`,
      },
      {
        title: 'SOLID Principles',
        content: `**S — Single Responsibility:** Class should have one reason to change. One job only.

**O — Open/Closed:** Open for extension, closed for modification. Add new behavior by extending, not changing existing code.

**L — Liskov Substitution:** Subclass objects should be substitutable for parent class objects without breaking the program.

**I — Interface Segregation:** Many specific interfaces > one general interface. Clients should not be forced to implement methods they don't use.

**D — Dependency Inversion:** Depend on abstractions, not concretions. High-level modules should not depend on low-level modules.

\`\`\`python
# Violates DIP (depends on concrete EmailService):
class OrderService:
    def __init__(self): self.email = EmailService()

# Follows DIP (depends on abstraction):
class OrderService:
    def __init__(self, notifier: Notifier): self.notifier = notifier
\`\`\``,
      },
      {
        title: 'Design Patterns',
        content: `**Creational:**
- **Singleton:** Only one instance. Shared resource (DB connection, logger).
- **Factory:** Create objects without specifying exact class.
- **Builder:** Construct complex objects step by step. Fluent interface.

**Structural:**
- **Adapter:** Convert interface of a class into another interface expected by clients.
- **Decorator:** Add behavior to objects at runtime without subclassing.
- **Proxy:** Placeholder that controls access to another object. Used for lazy loading, caching, access control.

**Behavioral:**
- **Observer:** Subject notifies all observers of state changes. Event systems.
- **Strategy:** Define a family of algorithms, make them interchangeable. Sort strategy, payment strategy.
- **Command:** Encapsulate a request as an object. Undo/redo, queuing operations.

\`\`\`python
# Strategy Pattern
class Sorter:
    def __init__(self, strategy): self.strategy = strategy
    def sort(self, data): return self.strategy.sort(data)

class QuickSort:
    def sort(self, data): ...

class MergeSort:
    def sort(self, data): ...

sorter = Sorter(QuickSort())
\`\`\``,
      },
    ],
  },
];
