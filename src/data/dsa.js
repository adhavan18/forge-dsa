export const DSA_TOPICS = [
  {
    id: 'arrays', phase: 1, week: 1, title: 'Arrays & Hashing', color: 'var(--p1)',
    lesson: {
      overview: 'The hashmap is the most powerful single tool in a FAANG interview. Almost every O(n²) brute-force has a hidden O(n) hashmap solution. Before writing any nested loop, ask: "Can I trade space for time with a map?"',
      patterns: [
        {
          name: 'Frequency Map',
          signal: 'Count occurrences · group by property · check equal composition · anagram check',
          approach: 'Use Counter(arr) or defaultdict(int). Keys = elements, values = counts. O(n) time, O(n) space.',
          trace: `arr = [1, 1, 2, 3, 3, 3]
freq = Counter(arr)  →  {3:3, 1:2, 2:1}

# Anagram check — same frequency map
Counter("listen") == Counter("silent")   # True
sorted("listen") == sorted("silent")     # True (slower: O(n log n))`,
          time: 'O(n)', space: 'O(n)',
        },
        {
          name: 'Complement Lookup — Two Sum pattern',
          signal: 'Two elements sum to target · find pair with property',
          approach: 'For each x, store x in seen map. Check if (target−x) already in seen. One pass, O(n).',
          trace: `arr=[2, 7, 11, 15], target=9
seen={}
x=2: need 7? No  →  seen={2:0}
x=7: need 2? YES in seen[2]=0  →  return [0, 1]`,
          time: 'O(n)', space: 'O(n)',
        },
        {
          name: 'Prefix Sum',
          signal: 'Subarray sum = k · range sum query · number of subarrays with sum k',
          approach: 'prefix[i+1] = prefix[i] + arr[i]. Range [l..r] = prefix[r+1] - prefix[l]. For subarray sum = k: count += seen[prefix - k], init seen={0:1}.',
          trace: `arr=[1, 2, 3, 4]
prefix=[0, 1, 3, 6, 10]
sum(arr[1..2]) = prefix[3]-prefix[1] = 6-1 = 5 ✓

# Subarray sum = k  →  init seen={0:1}
prefix=0
x=1: prefix=1, count += seen[1-k], seen={0:1,1:1}
x=2: prefix=3, count += seen[3-k], seen[3]=1...`,
          time: 'O(n)', space: 'O(n)',
        },
      ],
      decisions: [
        { see: 'Find duplicates in array', think: 'HashSet: add each, return True if already present' },
        { see: 'Count / frequency of elements', think: 'Counter(arr) or defaultdict(int)' },
        { see: 'Two numbers sum to target', think: 'HashMap: for each x, check if (target-x) in seen' },
        { see: 'Subarray sum equals k', think: 'Prefix sum + HashMap {prefix: count}, init {0:1}' },
        { see: 'Missing number in 1..n', think: 'XOR all 1..n and all values, or Gauss: n(n+1)/2 - sum' },
        { see: 'Longest consecutive sequence', think: 'HashSet: only extend from sequence starts (no prev)' },
      ],
      pitfalls: [
        'Two Sum: check complement BEFORE inserting current element. Handles [3,3] target=6 correctly.',
        'Prefix sum is 1-indexed: prefix has n+1 elements, prefix[0]=0. Range [l,r] = prefix[r+1]-prefix[l].',
        'Subarray Sum=k: initialise seen={0:1} BEFORE the loop or you miss subarrays starting at index 0.',
      ],
    },
    template: `from collections import Counter, defaultdict

# ── Frequency Map ──────────────────────────
freq = Counter(arr)
freq = defaultdict(int)
for x in arr: freq[x] += 1

# ── Two Sum (HashMap) ──────────────────────
seen = {}
for i, num in enumerate(nums):
    if target - num in seen:
        return [seen[target-num], i]
    seen[num] = i

# ── Prefix Sum ─────────────────────────────
prefix = [0] * (len(arr) + 1)
for i, v in enumerate(arr):
    prefix[i+1] = prefix[i] + v
# Range [l, r] (0-indexed, inclusive):
range_sum = prefix[r+1] - prefix[l]

# ── Subarray Sum = k ───────────────────────
from collections import defaultdict
count = 0
prefix = 0
seen = defaultdict(int)
seen[0] = 1                         # empty prefix
for num in nums:
    prefix += num
    count += seen[prefix - k]       # subarrays ending here
    seen[prefix] += 1
return count`,
    problems: [
      { id: 'dup', name: 'Contains Duplicate', diff: 'Easy', url: 'https://leetcode.com/problems/contains-duplicate/', pat: 'HashSet' },
      { id: 'anagram', name: 'Valid Anagram', diff: 'Easy', url: 'https://leetcode.com/problems/valid-anagram/', pat: 'Counter compare' },
      { id: 'twosum', name: 'Two Sum', diff: 'Easy', url: 'https://leetcode.com/problems/two-sum/', pat: 'Complement lookup' },
      { id: 'ga', name: 'Group Anagrams', diff: 'Medium', url: 'https://leetcode.com/problems/group-anagrams/', pat: 'sorted() as dict key' },
      { id: 'topk', name: 'Top K Frequent Elements', diff: 'Medium', url: 'https://leetcode.com/problems/top-k-frequent-elements/', pat: 'Bucket sort' },
      { id: 'prod', name: 'Product of Array Except Self', diff: 'Medium', url: 'https://leetcode.com/problems/product-of-array-except-self/', pat: 'Prefix × suffix pass' },
      { id: 'vsdk', name: 'Valid Sudoku', diff: 'Medium', url: 'https://leetcode.com/problems/valid-sudoku/', pat: 'Set per row/col/box' },
      { id: 'subk', name: 'Subarray Sum Equals K', diff: 'Medium', url: 'https://leetcode.com/problems/subarray-sum-equals-k/', pat: 'Prefix sum + HashMap' },
      { id: 'lcs', name: 'Longest Consecutive Sequence', diff: 'Medium', url: 'https://leetcode.com/problems/longest-consecutive-sequence/', pat: 'HashSet, extend from starts' },
      { id: 'enc', name: 'Encode and Decode Strings', diff: 'Medium', url: 'https://leetcode.com/problems/encode-and-decode-strings/', pat: 'Length-delimited' },
    ],
  },
  {
    id: 'two-ptr', phase: 1, week: 1, title: 'Two Pointers', color: 'var(--p1)',
    lesson: {
      overview: 'Two pointers reduce O(n²) nested loops to O(n) by maintaining two indices that move intelligently. The invariant — what the two pointers guarantee at every step — is the key insight to understand.',
      patterns: [
        {
          name: 'Opposite Ends',
          signal: 'Sorted array · pair/triple summing to target · palindrome check · move shorter/larger boundary',
          approach: 'l=0, r=n-1. Evaluate at (l,r). Move l right if result too small, r left if too big. For 3Sum: fix i, run opposite-ends on [i+1..n-1].',
          trace: `arr = [-4,-1,-1,0,1,2], find triplets summing to 0
Fix i=0 (-4): l=1(-1), r=5(2), sum=-3 < 0, l++
Fix i=0 (-4): l=2(-1), r=5(2), sum=-3 < 0, l++
...
Fix i=1 (-1): l=2(-1), r=5(2), sum=0 ✓ record [-1,-1,2]
  skip dups on l and r
  l=3(0), r=4(1), sum=0 ✓ record [-1,0,1]`,
          time: 'O(n) pair, O(n²) 3Sum', space: 'O(1)',
        },
        {
          name: 'Slow / Fast (Same Direction)',
          signal: 'Remove elements in-place · partition array · find middle of linked list',
          approach: 'slow = write position. fast scans ahead. When fast finds valid element, write to slow and advance slow.',
          trace: `Remove duplicates from [0,1,1,2,3,3]:
slow=0
fast=0: arr[0]=0, valid → arr[slow]=0, slow=1
fast=1: arr[1]=1 ≠ arr[slow-1]=0, valid → arr[1]=1, slow=2
fast=2: arr[2]=1 == arr[slow-1]=1, SKIP
fast=3: arr[3]=2 ≠ arr[slow-1]=1, valid → arr[2]=2, slow=3
fast=4: arr[4]=3, valid → arr[3]=3, slow=4
fast=5: arr[5]=3 == arr[slow-1]=3, SKIP
Result: [0,1,2,3,_,_], length=4`,
          time: 'O(n)', space: 'O(1)',
        },
      ],
      decisions: [
        { see: 'Sorted array + pair sum to target', think: 'Opposite ends: l=0, r=n-1, move based on sum' },
        { see: '3Sum / 4Sum', think: 'Sort first, fix outer element(s), opposite-ends inside' },
        { see: 'Check if string is palindrome', think: 'l from start, r from end, compare and converge' },
        { see: 'Remove elements / duplicates in-place', think: 'Slow/fast: slow = valid write position' },
        { see: 'Container water / trap rainwater', think: 'Move the shorter boundary inward' },
      ],
      pitfalls: [
        '3Sum dedup: skip arr[i]==arr[i-1] (when i>0) for outer AND after recording a triple, skip dups on both l and r.',
        'Use while l<r (not <=) to avoid using same element twice.',
        'Trapping Rain Water: water[i]=min(maxL[i], maxR[i])-height[i]. Precompute maxL and maxR in two passes.',
      ],
    },
    template: `# Opposite ends — pair sum in sorted
l, r = 0, len(arr)-1
while l < r:
    s = arr[l] + arr[r]
    if s == target: return [l, r]
    elif s < target: l += 1
    else: r -= 1

# 3Sum (sort first)
arr.sort()
res = []
for i in range(len(arr)-2):
    if i > 0 and arr[i] == arr[i-1]: continue     # skip dup outer
    l, r = i+1, len(arr)-1
    while l < r:
        s = arr[i]+arr[l]+arr[r]
        if s == 0:
            res.append([arr[i],arr[l],arr[r]])
            while l<r and arr[l]==arr[l+1]: l+=1   # skip dup l
            while l<r and arr[r]==arr[r-1]: r-=1   # skip dup r
            l+=1; r-=1
        elif s < 0: l += 1
        else: r -= 1

# Slow/Fast — remove val in-place
slow = 0
for fast in range(len(arr)):
    if arr[fast] != val:
        arr[slow] = arr[fast]
        slow += 1
return slow    # new length`,
    problems: [
      { id: 'vpal', name: 'Valid Palindrome', diff: 'Easy', url: 'https://leetcode.com/problems/valid-palindrome/', pat: 'Opposite ends' },
      { id: 'ts2', name: 'Two Sum II', diff: 'Medium', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', pat: 'Opposite ends' },
      { id: '3s', name: '3Sum', diff: 'Medium', url: 'https://leetcode.com/problems/3sum/', pat: 'Sort + two pointer' },
      { id: 'cmw', name: 'Container With Most Water', diff: 'Medium', url: 'https://leetcode.com/problems/container-with-most-water/', pat: 'Move shorter wall' },
      { id: 'trw', name: 'Trapping Rain Water', diff: 'Hard', url: 'https://leetcode.com/problems/trapping-rain-water/', pat: 'Precompute L/R max' },
      { id: 'rdsa', name: 'Remove Duplicates Sorted Array', diff: 'Easy', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', pat: 'Slow/fast' },
      { id: 'mvz', name: 'Move Zeroes', diff: 'Easy', url: 'https://leetcode.com/problems/move-zeroes/', pat: 'Slow/fast' },
      { id: '4s', name: '4Sum', diff: 'Medium', url: 'https://leetcode.com/problems/4sum/', pat: 'Fix two + two pointer' },
    ],
  },
  {
    id: 'sliding', phase: 1, week: 2, title: 'Sliding Window', color: 'var(--p1)',
    lesson: {
      overview: 'Expand the right edge greedily. Shrink from the left when the window becomes invalid. The inner while-loop looks O(n²) but each element enters and exits the window at most once — total O(n). The key: define "valid" precisely before coding.',
      patterns: [
        {
          name: 'Variable Window',
          signal: 'Longest/shortest subarray/substring satisfying condition · at most k distinct elements',
          approach: 'Expand r, update window. While invalid: shrink l, update. After shrink loop: window is valid, update answer.',
          trace: `s="abcabcbb", longest with no repeats
window={}, l=0
r=0 'a': {a:1}, len=1
r=1 'b': {a:1,b:1}, len=2
r=2 'c': {a:1,b:1,c:1}, len=3
r=3 'a': {a:2,...} INVALID
  shrink l=0('a'): {a:1,...} l=1, valid, len=3
r=4 'b': {a:1,b:2,...} INVALID
  shrink 'a'(l=1): {b:2,c:1} l=2, invalid
  shrink 'b'(l=2): {a:1,b:1,c:1} l=3, valid, len=3
answer = 3`,
          time: 'O(n)', space: 'O(k)',
        },
        {
          name: 'Fixed Window',
          signal: 'Subarray of exactly size k · sliding sum or average',
          approach: 'Build initial window of size k. For each new element: add arr[r], subtract arr[r-k]. Update answer.',
          trace: `arr=[2,1,5,1,3,2], k=3, max subarray sum
window = 2+1+5 = 8
slide: 8-2+1=7, 7-1+3=9 ← max, 9-5+2=6
Answer: 9`,
          time: 'O(n)', space: 'O(1)',
        },
      ],
      decisions: [
        { see: 'Longest subarray with condition', think: 'Variable window: expand r, shrink l when invalid' },
        { see: 'Shortest subarray containing all target chars', think: 'Variable window: shrink l while still valid' },
        { see: 'Subarray of exactly size k', think: 'Fixed window: add right, subtract left element' },
        { see: 'At most k distinct elements', think: 'Variable window + HashMap for char counts' },
        { see: 'Maximum in every window of size k', think: 'Monotonic deque (front = max, O(n) total)' },
      ],
      pitfalls: [
        'Min Window Substring: update have only when window[c]==need[c], not every increment. Otherwise over-count.',
        'Longest Repeating Char Replacement: window valid iff (r-l+1) - max_freq ≤ k. Do not update max_freq on shrink.',
        'Sliding Window Max: pop from BACK when new val ≥ back (≥ not >). Pop from FRONT when out of window.',
      ],
    },
    template: `from collections import defaultdict

# Variable window (general template)
l = 0
window = defaultdict(int)
res = 0
for r in range(len(s)):
    window[s[r]] += 1                      # expand right
    while is_invalid(window):             # shrink left
        window[s[l]] -= 1
        if window[s[l]] == 0: del window[s[l]]
        l += 1
    res = max(res, r - l + 1)             # window is valid here
return res

# Fixed window of size k
curr = sum(arr[:k])
res = curr
for i in range(k, len(arr)):
    curr += arr[i] - arr[i-k]
    res = max(res, curr)

# Min Window Substring (full template)
from collections import Counter
need = Counter(t)
have, total = 0, len(need)
window = {}; l = 0
res_len, res_l = float('inf'), 0
for r, c in enumerate(s):
    window[c] = window.get(c, 0) + 1
    if c in need and window[c] == need[c]: have += 1
    while have == total:
        if r-l+1 < res_len: res_len, res_l = r-l+1, l
        window[s[l]] -= 1
        if s[l] in need and window[s[l]] < need[s[l]]: have -= 1
        l += 1
return s[res_l:res_l+res_len] if res_len != float('inf') else ""`,
    problems: [
      { id: 'bts', name: 'Best Time to Buy and Sell Stock', diff: 'Easy', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', pat: 'Track running min' },
      { id: 'lsnr', name: 'Longest Substring Without Repeating', diff: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', pat: 'Variable window' },
      { id: 'mws', name: 'Minimum Window Substring', diff: 'Hard', url: 'https://leetcode.com/problems/minimum-window-substring/', pat: 'Variable + freq map' },
      { id: 'lrcr', name: 'Longest Repeating Character Replacement', diff: 'Medium', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/', pat: 'max_freq trick' },
      { id: 'pis', name: 'Permutation in String', diff: 'Medium', url: 'https://leetcode.com/problems/permutation-in-string/', pat: 'Fixed window + freq' },
      { id: 'swmx', name: 'Sliding Window Maximum', diff: 'Hard', url: 'https://leetcode.com/problems/sliding-window-maximum/', pat: 'Monotonic deque' },
      { id: 'fb', name: 'Fruit Into Baskets', diff: 'Medium', url: 'https://leetcode.com/problems/fruit-into-baskets/', pat: 'At most 2 distinct' },
    ],
  },
  {
    id: 'stack', phase: 1, week: 2, title: 'Stack & Queue', color: 'var(--p1)',
    lesson: {
      overview: 'Stack = LIFO. Deque = both ends. The FAANG pattern is the Monotonic Stack — solves "next greater/smaller" in O(n) that would otherwise be O(n²). Memorise this template cold.',
      patterns: [
        {
          name: 'Monotonic Decreasing Stack — Next Greater',
          signal: 'Next/previous greater or smaller element · daily temperatures · stock span · histogram',
          approach: 'Stack stores INDICES in decreasing order of values. When arr[i] > arr[stack.top()], pop — the popped index\'s next greater is arr[i].',
          trace: `arr=[2,1,3,4,1], find next greater
stack=[]
i=0: push 0          → stack=[0]  (val=2)
i=1: 1<2, push       → stack=[0,1]
i=2: 3>arr[1]=1 → pop 1, res[1]=3
     3>arr[0]=2 → pop 0, res[0]=3
     push 2          → stack=[2]
i=3: 4>arr[2]=3 → pop 2, res[2]=4; push 3 → stack=[3]
i=4: 1<4, push       → stack=[3,4]
remaining stack → res[3]=res[4]=-1
Result: [3, 3, 4, -1, -1]`,
          time: 'O(n) — each index pushed and popped at most once', space: 'O(n)',
        },
      ],
      decisions: [
        { see: 'Next/previous greater or smaller element', think: 'Monotonic stack storing indices — O(n)' },
        { see: 'Valid parentheses / balanced brackets', think: 'Stack: push opens, pop and check on close' },
        { see: 'Evaluate RPN / calculator expression', think: 'Stack: push numbers, pop and compute on operator' },
        { see: 'Max in every window of size k', think: 'Monotonic deque: front = max, pop when out of window' },
        { see: 'Largest rectangle in histogram', think: 'Monotonic increasing stack + sentinel 0 at end' },
      ],
      pitfalls: [
        'Monotonic stack stores INDICES not values — you need indices to compute distances (Daily Temperatures) or widths (Histogram).',
        'Histogram: append a sentinel 0 to heights so the stack is fully flushed at the end of the array.',
        'Decode String: use two stacks — one for multipliers, one for accumulated strings.',
      ],
    },
    template: `# Monotonic Decreasing Stack — next greater
stack = []      # stores indices, values decreasing
res = [-1] * n
for i in range(n):
    while stack and arr[i] > arr[stack[-1]]:
        res[stack.pop()] = arr[i]
    stack.append(i)

# Valid Parentheses
match = {')':'(', ']':'[', '}':'{'}
stack = []
for c in s:
    if c in '([{': stack.append(c)
    elif not stack or stack[-1] != match[c]: return False
    else: stack.pop()
return not stack

# Sliding Window Maximum — monotonic deque
from collections import deque
dq = deque()    # indices, values decreasing (front = max)
res = []
for i in range(len(nums)):
    while dq and nums[dq[-1]] <= nums[i]: dq.pop()
    dq.append(i)
    if dq[0] <= i-k: dq.popleft()     # expired
    if i >= k-1: res.append(nums[dq[0]])

# Largest Rectangle in Histogram
stack = []
heights.append(0)    # sentinel
res = 0
for i, h in enumerate(heights):
    while stack and heights[stack[-1]] > h:
        height = heights[stack.pop()]
        width = i if not stack else i - stack[-1] - 1
        res = max(res, height * width)
    stack.append(i)`,
    problems: [
      { id: 'vp', name: 'Valid Parentheses', diff: 'Easy', url: 'https://leetcode.com/problems/valid-parentheses/', pat: 'Stack' },
      { id: 'mnstk', name: 'Min Stack', diff: 'Medium', url: 'https://leetcode.com/problems/min-stack/', pat: 'Dual stack (val, min)' },
      { id: 'rpn', name: 'Evaluate Reverse Polish Notation', diff: 'Medium', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', pat: 'Stack' },
      { id: 'gp', name: 'Generate Parentheses', diff: 'Medium', url: 'https://leetcode.com/problems/generate-parentheses/', pat: 'Backtracking' },
      { id: 'dt', name: 'Daily Temperatures', diff: 'Medium', url: 'https://leetcode.com/problems/daily-temperatures/', pat: 'Monotonic stack' },
      { id: 'lrh', name: 'Largest Rectangle in Histogram', diff: 'Hard', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', pat: 'Monotonic + sentinel' },
      { id: 'ds', name: 'Decode String', diff: 'Medium', url: 'https://leetcode.com/problems/decode-string/', pat: 'Two stacks' },
      { id: 'cf', name: 'Car Fleet', diff: 'Medium', url: 'https://leetcode.com/problems/car-fleet/', pat: 'Sort + stack' },
    ],
  },
  {
    id: 'bsearch', phase: 2, week: 3, title: 'Binary Search', color: 'var(--p2)',
    lesson: {
      overview: 'Binary search works on any MONOTONIC predicate — not just sorted arrays. "Binary search on the answer": if you can define feasible(x) that is False for small x and True for large x (or vice versa), binary search on x. This pattern solves ~30% of Hard problems.',
      patterns: [
        {
          name: 'Classic — Find Exact Target',
          signal: 'Sorted array · find target or return -1',
          approach: 'while l ≤ r. Mid = (l+r)//2. Move l or r based on comparison. Return -1 if loop ends.',
          trace: `arr=[1,3,5,7,9], target=7
l=0,r=4 → mid=2, arr[2]=5 < 7 → l=3
l=3,r=4 → mid=3, arr[3]=7 == 7 → return 3`,
          time: 'O(log n)', space: 'O(1)',
        },
        {
          name: 'Binary Search on the Answer',
          signal: '"Find minimum X that satisfies condition" · "Minimize the maximum" · "Maximize the minimum"',
          approach: 'Define feasible(x). while l < r: mid=(l+r)//2. If feasible: r=mid. Else: l=mid+1. Return l.',
          trace: `Koko Eating Bananas: piles=[3,6,7,11], h=8
feasible(speed) = can eat all piles in h hours?

feasible(4): ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3=8 ≤ 8 ✓
feasible(3): 1+2+3+4=10 > 8 ✗

Binary search on [1..11]:
l=1,r=11→mid=6: feasible→r=6
l=1,r=6→mid=3: ✗→l=4
l=4,r=6→mid=5: feasible→r=5
l=4,r=5→mid=4: feasible→r=4
l=r=4 → answer=4`,
          time: 'O(n log(max))', space: 'O(1)',
        },
      ],
      decisions: [
        { see: 'Sorted array + find exact target', think: 'Classic BS: while l≤r, return -1 at end' },
        { see: '"Find minimum X satisfying condition"', think: 'BS on answer: while l<r, feasible(), return l' },
        { see: 'Search in rotated sorted array', think: 'Determine which half is sorted, search there' },
        { see: 'First or last occurrence of target', think: 'BS with bias: record mid, keep searching one direction' },
        { see: '"Minimize maximum" / "Maximize minimum"', think: 'BS on the answer value' },
      ],
      pitfalls: [
        'Template choice: while l≤r for exact match; while l<r for boundary search. Return l at end for boundary.',
        'Rotated array: check if left is sorted with arr[l]≤arr[mid]. Target in sorted half → search there, else other half.',
        'BS on answer: bounds must be exact. For Koko: l=1, r=max(piles). For shipping: l=max(weights), r=sum(weights).',
      ],
    },
    template: `# Classic — find exact value
l, r = 0, len(arr)-1
while l <= r:
    mid = (l+r)//2
    if arr[mid] == target: return mid
    elif arr[mid] < target: l = mid+1
    else: r = mid-1
return -1

# First occurrence (leftmost)
l, r, ans = 0, n-1, -1
while l <= r:
    mid = (l+r)//2
    if arr[mid] == target: ans = mid; r = mid-1   # record, go left
    elif arr[mid] < target: l = mid+1
    else: r = mid-1

# Binary Search on the Answer — minimum valid
def feasible(val) -> bool:
    # O(n) check: can we achieve val?
    ...

l, r = min_possible, max_possible
while l < r:
    mid = (l+r)//2
    if feasible(mid): r = mid       # valid, try smaller
    else: l = mid+1                 # invalid, must be larger
return l

# Rotated Sorted Array
l, r = 0, len(nums)-1
while l <= r:
    mid = (l+r)//2
    if nums[mid] == target: return mid
    if nums[l] <= nums[mid]:        # left half sorted
        if nums[l] <= target < nums[mid]: r = mid-1
        else: l = mid+1
    else:                           # right half sorted
        if nums[mid] < target <= nums[r]: l = mid+1
        else: r = mid-1`,
    problems: [
      { id: 'bs', name: 'Binary Search', diff: 'Easy', url: 'https://leetcode.com/problems/binary-search/', pat: 'Classic' },
      { id: 's2m', name: 'Search a 2D Matrix', diff: 'Medium', url: 'https://leetcode.com/problems/search-a-2d-matrix/', pat: 'Flatten to 1D' },
      { id: 'koko', name: 'Koko Eating Bananas', diff: 'Medium', url: 'https://leetcode.com/problems/koko-eating-bananas/', pat: 'BS on answer' },
      { id: 'fmr', name: 'Find Min in Rotated Sorted Array', diff: 'Medium', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', pat: 'Which half sorted' },
      { id: 'srsa', name: 'Search in Rotated Sorted Array', diff: 'Medium', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', pat: 'Modified BS' },
      { id: 'tbkv', name: 'Time Based Key-Value Store', diff: 'Medium', url: 'https://leetcode.com/problems/time-based-key-value-store/', pat: 'BS on timestamps' },
      { id: 'm2sa', name: 'Median of Two Sorted Arrays', diff: 'Hard', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', pat: 'BS partition' },
      { id: 'sals', name: 'Split Array Largest Sum', diff: 'Hard', url: 'https://leetcode.com/problems/split-array-largest-sum/', pat: 'BS on answer' },
      { id: 'ctsd', name: 'Capacity to Ship in D Days', diff: 'Medium', url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/', pat: 'BS on answer' },
    ],
  },
  {
    id: 'linked', phase: 2, week: 3, title: 'Linked Lists', color: 'var(--p2)',
    lesson: {
      overview: 'Linked list problems are pointer manipulation. Draw the before/after state BEFORE writing a single line. The dummy node eliminates 80% of head-manipulation edge cases.',
      patterns: [
        {
          name: 'Fast / Slow (Floyd\'s)',
          signal: 'Find middle · detect cycle · find cycle entry · kth from end',
          approach: 'slow moves 1, fast moves 2. They meet iff cycle exists. Reset one to head, move both at speed 1 to find cycle entry.',
          trace: `Find middle of 1→2→3→4→5:
slow=1,fast=1
step1: slow=2,fast=3
step2: slow=3,fast=5  ← fast.next=null, stop
slow=3 is the middle ✓

Cycle entry: after slow==fast meet
reset slow=head
move both 1 step until slow==fast → entry`,
          time: 'O(n)', space: 'O(1)',
        },
        {
          name: 'Reverse In-Place',
          signal: 'Reverse list · reverse subrange · palindrome linked list',
          approach: 'prev=None, curr=head. Loop: save next, point curr.next=prev, advance both. Return prev.',
          trace: `1→2→3→None  →  3→2→1→None
prev=None, curr=1
  nxt=2, 1.next=None, prev=1, curr=2
  nxt=3, 2.next=1, prev=2, curr=3
  nxt=None, 3.next=2, prev=3, curr=None
return prev=3  →  3→2→1→None ✓`,
          time: 'O(n)', space: 'O(1)',
        },
      ],
      decisions: [
        { see: 'Find middle of list', think: 'Slow/fast: when fast hits null, slow = middle' },
        { see: 'Detect cycle', think: "Floyd's: slow/fast meet iff cycle. Find entry: reset one to head" },
        { see: 'Reverse list (full or range)', think: 'Iterative prev/curr/next swap' },
        { see: 'Remove nth from end', think: 'Gap of n between two pointers' },
        { see: 'Merge or modify list head', think: 'Dummy node: return dummy.next at end' },
      ],
      pitfalls: [
        'Always use a dummy node for operations that might change the head (merge, remove nth). Return dummy.next.',
        'Cycle entry: after meeting, reset ONE pointer to head, move both at speed 1 until they meet — that is the entry.',
        'Reverse K Group: reverse k nodes, link tail to recursive call on remainder. Handle when remaining < k.',
      ],
    },
    template: `# Reverse Linked List (iterative)
prev, curr = None, head
while curr:
    nxt = curr.next
    curr.next = prev
    prev, curr = curr, nxt
return prev

# Find middle (slow/fast)
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
return slow   # left-middle for even length

# Detect cycle + find entry (Floyd's)
slow = fast = head
while fast and fast.next:
    slow, fast = slow.next, fast.next.next
    if slow == fast: break
else: return None          # no cycle
slow = head
while slow != fast:
    slow, fast = slow.next, fast.next
return slow                # cycle entry

# Remove nth from end (dummy node + gap)
dummy = ListNode(0, head)
l, r = dummy, head
for _ in range(n): r = r.next
while r:
    l, r = l.next, r.next
l.next = l.next.next
return dummy.next

# Merge two sorted lists (dummy)
dummy = ListNode(0)
curr = dummy
while l1 and l2:
    if l1.val <= l2.val: curr.next=l1; l1=l1.next
    else: curr.next=l2; l2=l2.next
    curr = curr.next
curr.next = l1 or l2
return dummy.next`,
    problems: [
      { id: 'rll', name: 'Reverse Linked List', diff: 'Easy', url: 'https://leetcode.com/problems/reverse-linked-list/', pat: 'Iterative reverse' },
      { id: 'm2l', name: 'Merge Two Sorted Lists', diff: 'Easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', pat: 'Dummy + merge' },
      { id: 'llc', name: 'Linked List Cycle', diff: 'Easy', url: "https://leetcode.com/problems/linked-list-cycle/", pat: "Floyd's" },
      { id: 'reord', name: 'Reorder List', diff: 'Medium', url: 'https://leetcode.com/problems/reorder-list/', pat: 'Middle + reverse + merge' },
      { id: 'rnte', name: 'Remove Nth Node From End', diff: 'Medium', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', pat: 'Gap of n' },
      { id: 'clrp', name: 'Copy List with Random Pointer', diff: 'Medium', url: 'https://leetcode.com/problems/copy-list-with-random-pointer/', pat: 'HashMap old→new' },
      { id: 'a2n', name: 'Add Two Numbers', diff: 'Medium', url: 'https://leetcode.com/problems/add-two-numbers/', pat: 'Carry simulation' },
      { id: 'lruc', name: 'LRU Cache', diff: 'Medium', url: 'https://leetcode.com/problems/lru-cache/', pat: 'DLL + HashMap' },
      { id: 'mkl', name: 'Merge K Sorted Lists', diff: 'Hard', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', pat: 'Min-heap or D&C' },
    ],
  },
  {
    id: 'trees', phase: 2, week: 4, title: 'Trees', color: 'var(--p2)',
    lesson: {
      overview: 'For every tree problem ask: "What does left subtree tell me? Right? How do I combine at this node?" Usually a postorder DFS. Use BFS only when you need level-by-level information.',
      patterns: [
        {
          name: 'Postorder DFS — Compute Bottom Up',
          signal: 'Max depth · diameter · path sum · balance check · LCA · anything where parent needs child info first',
          approach: 'Recurse left, recurse right, compute answer at node. Keep a global variable for cross-subtree answers (diameter, max path sum).',
          trace: `Diameter of Binary Tree:
dfs(node) returns height of subtree
  dfs(null) = 0
  For each node:
    lh = dfs(left)
    rh = dfs(right)
    diameter_candidate = lh + rh
    global_max = max(global_max, lh+rh)
    return 1 + max(lh, rh)   ← propagate height up`,
          time: 'O(n)', space: 'O(h) recursion',
        },
        {
          name: 'BFS — Level Order',
          signal: 'Level-by-level processing · right side view · zigzag · max per level',
          approach: 'Queue starts with root. Each iteration, process exactly len(queue) nodes (one full level). Add children for next level.',
          trace: `       1
      / \\
     2   3
    / \\
   4   5

Level 0: pop 1 → add 2,3
Level 1: pop 2(add 4,5), pop 3
Level 2: pop 4, pop 5
Right side view: last of each level = [1, 3, 5]`,
          time: 'O(n)', space: 'O(w) max width',
        },
      ],
      decisions: [
        { see: 'Max depth / height of tree', think: 'Postorder: return 1+max(left,right)' },
        { see: 'Level-by-level / right side view', think: 'BFS: process len(queue) nodes per level' },
        { see: 'Path sum root to leaf', think: 'DFS with running sum as parameter' },
        { see: 'Validate BST', think: 'DFS with (lo,hi) bounds passed down' },
        { see: 'Lowest Common Ancestor', think: 'DFS: if both sides non-null, current = LCA' },
      ],
      pitfalls: [
        'Max Path Sum: at each node compute max gain going DOWN only. Update global with left+node+right but return node+max(one side,0).',
        'Validate BST: pass lo/hi bounds, not just compare left<root<right. The entire left subtree must be < root.',
        'LCA: return the node if it equals p or q. If left AND right both return non-null, current node is LCA.',
      ],
    },
    template: `# Postorder DFS (most common)
def dfs(node):
    if not node: return 0    # base case
    left  = dfs(node.left)
    right = dfs(node.right)
    # compute answer at this node
    nonlocal ans
    ans = max(ans, left + right)    # e.g. diameter
    return 1 + max(left, right)     # propagate height up

# BFS — level order
from collections import deque
result = []
q = deque([root])
while q:
    level = []
    for _ in range(len(q)):    # exactly one level
        node = q.popleft()
        level.append(node.val)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)
    result.append(level)

# Validate BST (with bounds)
def valid(node, lo=float('-inf'), hi=float('inf')):
    if not node: return True
    if not (lo < node.val < hi): return False
    return (valid(node.left, lo, node.val) and
            valid(node.right, node.val, hi))

# LCA general binary tree
def lca(root, p, q):
    if not root or root == p or root == q: return root
    left  = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right: return root   # p,q in different subtrees
    return left or right`,
    problems: [
      { id: 'ibt', name: 'Invert Binary Tree', diff: 'Easy', url: 'https://leetcode.com/problems/invert-binary-tree/', pat: 'Postorder swap' },
      { id: 'mxd', name: 'Maximum Depth of Binary Tree', diff: 'Easy', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', pat: 'Postorder height' },
      { id: 'diam', name: 'Diameter of Binary Tree', diff: 'Easy', url: 'https://leetcode.com/problems/diameter-of-binary-tree/', pat: 'Postorder + global max' },
      { id: 'bbt', name: 'Balanced Binary Tree', diff: 'Easy', url: 'https://leetcode.com/problems/balanced-binary-tree/', pat: 'Postorder height check' },
      { id: 'stree', name: 'Same Tree', diff: 'Easy', url: 'https://leetcode.com/problems/same-tree/', pat: 'DFS compare' },
      { id: 'blot', name: 'Level Order Traversal', diff: 'Medium', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', pat: 'BFS' },
      { id: 'rsv', name: 'Right Side View', diff: 'Medium', url: 'https://leetcode.com/problems/binary-tree-right-side-view/', pat: 'BFS last per level' },
      { id: 'lcab', name: 'LCA of BST', diff: 'Medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', pat: 'BST property' },
      { id: 'ps3', name: 'Path Sum III', diff: 'Medium', url: 'https://leetcode.com/problems/path-sum-iii/', pat: 'Prefix sum DFS' },
      { id: 'cpoi', name: 'Construct Tree Preorder+Inorder', diff: 'Medium', url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', pat: 'D&C' },
      { id: 'mxps', name: 'Binary Tree Max Path Sum', diff: 'Hard', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', pat: 'Global max DFS' },
      { id: 'sebt', name: 'Serialize and Deserialize BT', diff: 'Hard', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', pat: 'Preorder + null markers' },
    ],
  },
  {
    id: 'heap', phase: 2, week: 4, title: 'Heap / Priority Queue', color: 'var(--p2)',
    lesson: {
      overview: 'Heap = O(log n) insert/remove, O(1) peek at min or max. Python heapq is min-heap. Negate values for max-heap. Know these two patterns: Top-K and Two-Heaps for median.',
      patterns: [
        {
          name: 'Top K Pattern',
          signal: 'K largest · K smallest · K most frequent · K closest',
          approach: 'For K largest: maintain a MIN-heap of size k. When size > k, pop the minimum. Remaining k elements are the answer. Counterintuitive but correct.',
          trace: `nums=[3,1,4,1,5,9,2,6], k=3, find 3 largest
heap=[]
push 3→[3], push 1→[1,3], push 4→[1,3,4]  size=k
push 1: size>k, pop min(1)→[1,3,4]  still [1,3,4]? No:
  actual: push then pop if size>k
  after push 1: [1,1,3,4] pop→[1,3,4]
  after push 5: [1,3,4,5] pop 1→[3,4,5]
  after push 9: [3,4,5,9] pop 3→[4,5,9]
  after push 2: pop 2→[4,5,9]
  after push 6: pop 4→[5,6,9]
Answer: [5,6,9] ✓`,
          time: 'O(n log k)', space: 'O(k)',
        },
        {
          name: 'Two Heaps — Running Median',
          signal: 'Median from a data stream · split data into equal halves',
          approach: 'small (max-heap, lower half) + large (min-heap, upper half). Keep sizes balanced: |small|-|large| ≤ 1.',
          trace: `Add 5: push to small → small=[-5]
Add 3: push to small → small=[-5,-3]
  len(small)>len(large)+1: move top to large
  small=[-3], large=[5]  median=(3+5)/2=4
Add 8: 8>-small[0]=3, push to large → large=[5,8]
  len(large)>len(small): move top to small
  small=[-5,-3], large=[8]  median=5`,
          time: 'O(log n) add, O(1) median', space: 'O(n)',
        },
      ],
      decisions: [
        { see: 'K largest elements', think: 'Min-heap of size k (pop smallest when size > k)' },
        { see: 'K smallest elements', think: 'Max-heap of size k (negate values)' },
        { see: 'K closest points', think: 'Max-heap of size k by distance' },
        { see: 'Merge k sorted sources', think: 'Min-heap with (val, source_idx, elem_idx)' },
        { see: 'Median from stream', think: 'Two heaps: max-heap lower half + min-heap upper half' },
      ],
      pitfalls: [
        'For max-heap in Python: push -val, pop and negate. For tuples: (-priority, other).',
        'Top K Largest uses a MIN-heap. Pop the min when size > k, keeping the k largest.',
        'Two-heap median: after each insert, rebalance sizes. If |small|-|large|>1, move top of small to large.',
      ],
    },
    template: `import heapq

# Min-heap basics
heap = []
heapq.heappush(heap, val)
top = heap[0]               # peek O(1)
val = heapq.heappop(heap)   # remove min O(log n)
heapq.heapify(arr)          # build heap O(n)

# Max-heap (negate)
heapq.heappush(heap, -val)
val = -heapq.heappop(heap)

# Top K Largest — min-heap of size k
heap = []
for num in nums:
    heapq.heappush(heap, num)
    if len(heap) > k:
        heapq.heappop(heap)     # remove smallest
return list(heap)               # k largest remain

# Two Heaps — running median
small = []    # max-heap (negate), lower half
large = []    # min-heap, upper half

def add_num(num):
    if not small or num <= -small[0]:
        heapq.heappush(small, -num)
    else:
        heapq.heappush(large, num)
    # Rebalance
    if len(small) > len(large) + 1:
        heapq.heappush(large, -heapq.heappop(small))
    elif len(large) > len(small):
        heapq.heappush(small, -heapq.heappop(large))

def find_median():
    if len(small) > len(large): return -small[0]
    return (-small[0] + large[0]) / 2`,
    problems: [
      { id: 'kls', name: 'Kth Largest in Stream', diff: 'Easy', url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', pat: 'Min-heap size k' },
      { id: 'lsw', name: 'Last Stone Weight', diff: 'Easy', url: 'https://leetcode.com/problems/last-stone-weight/', pat: 'Max-heap' },
      { id: 'kcp', name: 'K Closest Points to Origin', diff: 'Medium', url: 'https://leetcode.com/problems/k-closest-points-to-origin/', pat: 'Max-heap size k' },
      { id: 'klae', name: 'Kth Largest in Array', diff: 'Medium', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', pat: 'Min-heap or Quickselect' },
      { id: 'tsk', name: 'Task Scheduler', diff: 'Medium', url: 'https://leetcode.com/problems/task-scheduler/', pat: 'Max-heap + greedy' },
      { id: 'dstw', name: 'Design Twitter', diff: 'Medium', url: 'https://leetcode.com/problems/design-twitter/', pat: 'Min-heap merge feeds' },
      { id: 'fmds', name: 'Find Median from Data Stream', diff: 'Hard', url: 'https://leetcode.com/problems/find-median-from-data-stream/', pat: 'Two heaps' },
    ],
  },
  {
    id: 'graphs', phase: 3, week: 5, title: 'Graphs', color: 'var(--p3)',
    lesson: {
      overview: 'Algorithm choice is determined by graph properties: BFS for unweighted shortest path, DFS for components/cycles/topo, Union-Find for dynamic connectivity, Dijkstra for weighted non-negative paths.',
      patterns: [
        {
          name: 'BFS — Shortest Path in Unweighted Graph',
          signal: 'Shortest path, unweighted · minimum steps · word ladder · rotting oranges (multi-source)',
          approach: 'Level = distance. Mark visited BEFORE adding to queue. Return distance when target found.',
          trace: `Word Ladder hit→cog (change 1 char/step)
Level 0: {hit}
Level 1: {hot, ...} (1 change)
Level 2: {dot, lot, hot} (2 changes)
Level 3: {dog, log, ...}
Level 4: {cog} ← target! return 5`,
          time: 'O(V+E)', space: 'O(V)',
        },
        {
          name: 'Topological Sort — Kahn\'s BFS',
          signal: 'Course prerequisites · task ordering · detect cycle in directed graph',
          approach: 'Compute in-degrees. Queue all nodes with in-degree 0. Pop, add to order, decrement neighbors. If len(order)<n: cycle exists.',
          trace: `Courses: 0←1, 0←2 (1 and 2 must before 0)
indegree: {0:2, 1:0, 2:0}
queue: [1, 2]
pop 1: order=[1], decrement 0 → indeg[0]=1
pop 2: order=[1,2], decrement 0 → indeg[0]=0, queue 0
pop 0: order=[1,2,0]
len=3=n → no cycle, valid order ✓`,
          time: 'O(V+E)', space: 'O(V)',
        },
      ],
      decisions: [
        { see: 'Shortest path, unweighted', think: 'BFS — each level = +1 distance' },
        { see: 'Number of islands / components', think: 'DFS/BFS with visited set, iterate all nodes' },
        { see: 'Course schedule / task ordering', think: "Topological sort — Kahn's BFS" },
        { see: 'Cycle in undirected graph / connectivity', think: 'Union-Find' },
        { see: 'Shortest path, weighted non-negative', think: 'Dijkstra (priority queue)' },
      ],
      pitfalls: [
        'Grid BFS: mark visited BEFORE appending to queue, not after popping. Prevents duplicates.',
        'Topo sort: if len(order) < n after Kahn\'s, a cycle exists. Return [] or False.',
        'Dijkstra: skip if current distance > recorded distance (stale entry in heap).',
      ],
    },
    template: `# BFS — shortest path
from collections import deque
visited = {start}
q = deque([(start, 0)])
while q:
    node, dist = q.popleft()
    if node == target: return dist
    for nei in graph[node]:
        if nei not in visited:
            visited.add(nei)    # mark BEFORE append
            q.append((nei, dist+1))

# Grid BFS (4 directions)
DIRS = [(0,1),(0,-1),(1,0),(-1,0)]
def bfs(grid, r, c):
    q = deque([(r,c)])
    grid[r][c] = '0'    # mark visited in-place
    while q:
        r,c = q.popleft()
        for dr,dc in DIRS:
            nr,nc = r+dr, c+dc
            if 0<=nr<len(grid) and 0<=nc<len(grid[0]) and grid[nr][nc]=='1':
                grid[nr][nc]='0'
                q.append((nr,nc))

# Union-Find (path compression + rank)
class UF:
    def __init__(self,n): self.p=list(range(n)); self.rank=[0]*n
    def find(self,x):
        if self.p[x]!=x: self.p[x]=self.find(self.p[x])
        return self.p[x]
    def union(self,x,y):
        px,py=self.find(x),self.find(y)
        if px==py: return False
        if self.rank[px]<self.rank[py]: px,py=py,px
        self.p[py]=px
        if self.rank[px]==self.rank[py]: self.rank[px]+=1
        return True

# Kahn's Topological Sort
from collections import deque
indeg = {u:0 for u in graph}
for u in graph:
    for v in graph[u]: indeg[v]+=1
q = deque(u for u in indeg if indeg[u]==0)
order = []
while q:
    u=q.popleft(); order.append(u)
    for v in graph[u]:
        indeg[v]-=1
        if indeg[v]==0: q.append(v)
return order if len(order)==len(graph) else []

# Dijkstra
import heapq
dist={u:float('inf') for u in graph}; dist[src]=0
pq=[(0,src)]
while pq:
    d,u=heapq.heappop(pq)
    if d>dist[u]: continue
    for v,w in graph[u]:
        if dist[u]+w<dist[v]:
            dist[v]=dist[u]+w; heapq.heappush(pq,(dist[v],v))`,
    problems: [
      { id: 'nis', name: 'Number of Islands', diff: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/', pat: 'DFS/BFS grid' },
      { id: 'clgr', name: 'Clone Graph', diff: 'Medium', url: 'https://leetcode.com/problems/clone-graph/', pat: 'DFS + HashMap' },
      { id: 'maio', name: 'Max Area of Island', diff: 'Medium', url: 'https://leetcode.com/problems/max-area-of-island/', pat: 'DFS return count' },
      { id: 'pawf', name: 'Pacific Atlantic Water Flow', diff: 'Medium', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', pat: 'Reverse BFS' },
      { id: 'crs', name: 'Course Schedule', diff: 'Medium', url: 'https://leetcode.com/problems/course-schedule/', pat: 'Cycle detection' },
      { id: 'crs2', name: 'Course Schedule II', diff: 'Medium', url: "https://leetcode.com/problems/course-schedule-ii/", pat: "Kahn's topo sort" },
      { id: 'rdco', name: 'Redundant Connection', diff: 'Medium', url: 'https://leetcode.com/problems/redundant-connection/', pat: 'Union-Find' },
      { id: 'ndtm', name: 'Network Delay Time', diff: 'Medium', url: 'https://leetcode.com/problems/network-delay-time/', pat: 'Dijkstra' },
      { id: 'wdlr', name: 'Word Ladder', diff: 'Hard', url: 'https://leetcode.com/problems/word-ladder/', pat: 'BFS + word transform' },
      { id: 'alnd', name: 'Alien Dictionary', diff: 'Hard', url: 'https://leetcode.com/problems/alien-dictionary/', pat: 'DAG + topo sort' },
      { id: 'chfl', name: 'Cheapest Flights K Stops', diff: 'Medium', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', pat: 'Bellman-Ford k iters' },
    ],
  },
  {
    id: 'dp1d', phase: 3, week: 6, title: 'DP — 1D', color: 'var(--p3)',
    lesson: {
      overview: 'Before writing any DP code, write this sentence: "dp[i] is the ___ for ___." A vague dp definition always leads to a wrong recurrence. The definition is the hardest part — everything else follows.',
      patterns: [
        {
          name: 'Decision at Each Step (House Robber family)',
          signal: 'Max value without adjacent · circular array · stock with cooldown',
          approach: 'dp[i] = max(skip: dp[i-1], take: dp[i-2]+arr[i]). Space-optimize to two variables.',
          trace: `nums=[2,7,9,3,1]
dp[0]=2, dp[1]=max(2,7)=7
dp[2]=max(7, 2+9)=11
dp[3]=max(11, 7+3)=11
dp[4]=max(11, 11+1)=12  ← answer`,
          time: 'O(n)', space: 'O(1)',
        },
        {
          name: 'Unbounded Knapsack (Coin Change)',
          signal: 'Minimum coins · count ways to make sum · items can be reused',
          approach: 'dp[i] = min coins to make amount i. For each coin, update dp[i] = min(dp[i], dp[i-coin]+1). Iterate coins outer, amounts inner FORWARD.',
          trace: `coins=[1,2,5], amount=11
dp=[0,inf,inf,...,inf] (size 12)
coin=1: dp=[0,1,2,3,4,5,6,7,8,9,10,11]
coin=2: dp=[0,1,1,2,2,3,3,4,4,5,5,6]
coin=5: dp=[0,1,1,2,2,1,2,2,3,3,2,3]
answer: dp[11]=3  (5+5+1)`,
          time: 'O(amount × |coins|)', space: 'O(amount)',
        },
      ],
      decisions: [
        { see: 'Count ways to reach end (stair-like)', think: 'Fibonacci: dp[i]=dp[i-1]+dp[i-2]' },
        { see: 'Max value, cannot take adjacent', think: 'House Robber: dp[i]=max(dp[i-1], dp[i-2]+arr[i])' },
        { see: 'Minimum coins / cost with reuse', think: 'Unbounded knapsack: dp[i]=min(dp[i-coin]+1)' },
        { see: 'Count partitions / decode ways', think: 'dp[i] = sum of valid previous states' },
        { see: 'Split string into dictionary words', think: 'Word break: dp[i] = any dp[j] where s[j:i] in word set' },
      ],
      pitfalls: [
        'House Robber II (circular): run linear solution TWICE — once skip nums[0], once skip nums[-1]. Take max.',
        'Coin Change: init dp[0]=0 and dp[1..amount]=infinity. answer=-1 if dp[amount] still infinity.',
        'Word Break: init dp[0]=True (empty string is always valid). For each i check ALL j<i.',
      ],
    },
    template: `# House Robber — O(1) space
prev2, prev1 = 0, 0
for num in nums:
    curr = max(prev1, prev2 + num)
    prev2, prev1 = prev1, curr
return prev1

# House Robber II (circular)
def rob_linear(arr):
    a, b = 0, 0
    for n in arr:
        a, b = b, max(b, a+n)
    return b
return max(rob_linear(nums[1:]), rob_linear(nums[:-1]))

# Coin Change (min coins) — unbounded knapsack
dp = [float('inf')] * (amount+1)
dp[0] = 0
for coin in coins:
    for i in range(coin, amount+1):       # FORWARD
        dp[i] = min(dp[i], dp[i-coin]+1)
return dp[amount] if dp[amount] != float('inf') else -1

# Word Break
dp = [False] * (n+1)
dp[0] = True                    # empty prefix always valid
word_set = set(wordDict)
for i in range(1, n+1):
    for j in range(i):
        if dp[j] and s[j:i] in word_set:
            dp[i] = True; break

# Decode Ways
dp = [0] * (n+1)
dp[0] = 1
dp[1] = 0 if s[0] == '0' else 1
for i in range(2, n+1):
    if s[i-1] != '0': dp[i] += dp[i-1]
    if 10 <= int(s[i-2:i]) <= 26: dp[i] += dp[i-2]`,
    problems: [
      { id: 'cls', name: 'Climbing Stairs', diff: 'Easy', url: 'https://leetcode.com/problems/climbing-stairs/', pat: 'Fibonacci' },
      { id: 'mcls', name: 'Min Cost Climbing Stairs', diff: 'Easy', url: 'https://leetcode.com/problems/min-cost-climbing-stairs/', pat: '1D DP' },
      { id: 'hr1', name: 'House Robber', diff: 'Medium', url: 'https://leetcode.com/problems/house-robber/', pat: 'Skip adjacent' },
      { id: 'hr2', name: 'House Robber II', diff: 'Medium', url: 'https://leetcode.com/problems/house-robber-ii/', pat: 'Run twice' },
      { id: 'lps', name: 'Longest Palindromic Substring', diff: 'Medium', url: 'https://leetcode.com/problems/longest-palindromic-substring/', pat: 'Expand center' },
      { id: 'dcw', name: 'Decode Ways', diff: 'Medium', url: 'https://leetcode.com/problems/decode-ways/', pat: '1D DP' },
      { id: 'cch', name: 'Coin Change', diff: 'Medium', url: 'https://leetcode.com/problems/coin-change/', pat: 'Unbounded knapsack' },
      { id: 'mxprd', name: 'Maximum Product Subarray', diff: 'Medium', url: 'https://leetcode.com/problems/maximum-product-subarray/', pat: 'Track min and max' },
      { id: 'wdbk', name: 'Word Break', diff: 'Medium', url: 'https://leetcode.com/problems/word-break/', pat: '1D DP + set' },
      { id: 'jmpg', name: 'Jump Game', diff: 'Medium', url: 'https://leetcode.com/problems/jump-game/', pat: 'Greedy / DP' },
    ],
  },
  {
    id: 'dp2d', phase: 3, week: 7, title: 'DP — 2D', color: 'var(--p3)',
    lesson: {
      overview: '2D DP: dp[i][j] encodes TWO dimensions of state. Two strings → LCS/Edit Distance. Index + weight → Knapsack. Row + col → Grid paths. Always initialise first row and column as base cases.',
      patterns: [
        {
          name: 'LCS / Edit Distance Family',
          signal: 'Longest common subsequence · edit distance · interleaving strings · distinct subsequences',
          approach: 'dp[i][j] = answer for s1[0..i-1] and s2[0..j-1]. If match: dp[i-1][j-1]+1. Else: best of skip s1, skip s2.',
          trace: `LCS("abcde","ace"):
     ""  a  c  e
""  [0   0  0  0]
a   [0   1  1  1]
b   [0   1  1  1]
c   [0   1  2  2]
d   [0   1  2  2]
e   [0   1  2  3]  ← answer = 3`,
          time: 'O(m×n)', space: 'O(m×n) or O(n) rolling',
        },
        {
          name: '0/1 Knapsack',
          signal: 'Subset sum · partition equal subsets · target sum · each item used at most once',
          approach: 'dp[j] = can we form sum j. Iterate items outer, weights REVERSE inner (prevents reuse).',
          trace: `Partition Equal Subset Sum: [1,5,11,5], target=11
dp = [T,F,F,...,F]  (size 12)
item=1: dp[1]=True
item=5: dp[6]=True, dp[5]=True
item=11: dp[11]=True ← YES, can partition
item=5: ...
answer: dp[11]=True`,
          time: 'O(n×W)', space: 'O(W)',
        },
      ],
      decisions: [
        { see: 'Two strings, find common or transform cost', think: 'LCS/Edit Distance: dp[i][j] on both lengths' },
        { see: 'Paths in grid from top-left to bottom-right', think: 'dp[i][j] = dp[i-1][j]+dp[i][j-1]' },
        { see: 'Subset sum, each item once', think: '0/1 Knapsack: iterate weights REVERSE' },
        { see: 'Count ways to form sum (reuse items)', think: 'Unbounded: iterate amounts FORWARD' },
        { see: 'Stock buy/sell with cooldown/fee', think: 'State machine DP: hold/cooldown/ready' },
      ],
      pitfalls: [
        '0/1 Knapsack 1D: iterate weights in REVERSE (high to low). Forward would allow using same item twice.',
        'Unbounded Knapsack: iterate amounts FORWARD. Allows same item multiple times.',
        'Edit Distance vs LCS: LCS dp[i][j] = dp[i-1][j-1]+1 on match. Edit: no match = 1+min(insert, delete, replace).',
      ],
    },
    template: `# LCS
m, n = len(s1), len(s2)
dp = [[0]*(n+1) for _ in range(m+1)]
for i in range(1, m+1):
    for j in range(1, n+1):
        if s1[i-1]==s2[j-1]: dp[i][j]=dp[i-1][j-1]+1
        else: dp[i][j]=max(dp[i-1][j], dp[i][j-1])
return dp[m][n]

# Edit Distance
dp=[[0]*(n+1) for _ in range(m+1)]
for i in range(m+1): dp[i][0]=i
for j in range(n+1): dp[0][j]=j
for i in range(1,m+1):
    for j in range(1,n+1):
        if s1[i-1]==s2[j-1]: dp[i][j]=dp[i-1][j-1]
        else: dp[i][j]=1+min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])

# 0/1 Knapsack (1D) — iterate REVERSE
dp = [False]*(target+1); dp[0]=True
for num in nums:
    for j in range(target, num-1, -1):   # REVERSE
        dp[j] = dp[j] or dp[j-num]

# Coin Change II (unbounded) — iterate FORWARD
dp = [0]*(amount+1); dp[0]=1
for coin in coins:
    for i in range(coin, amount+1):       # FORWARD
        dp[i] += dp[i-coin]`,
    problems: [
      { id: 'unp', name: 'Unique Paths', diff: 'Medium', url: 'https://leetcode.com/problems/unique-paths/', pat: 'Grid DP' },
      { id: 'lcss', name: 'Longest Common Subsequence', diff: 'Medium', url: 'https://leetcode.com/problems/longest-common-subsequence/', pat: '2D DP' },
      { id: 'edst', name: 'Edit Distance', diff: 'Hard', url: 'https://leetcode.com/problems/edit-distance/', pat: '2D DP' },
      { id: 'tsum', name: 'Target Sum', diff: 'Medium', url: 'https://leetcode.com/problems/target-sum/', pat: '0/1 Knapsack' },
      { id: 'cc2', name: 'Coin Change II', diff: 'Medium', url: 'https://leetcode.com/problems/coin-change-ii/', pat: 'Unbounded knapsack' },
      { id: 'pess', name: 'Partition Equal Subset Sum', diff: 'Medium', url: 'https://leetcode.com/problems/partition-equal-subset-sum/', pat: '0/1 Knapsack' },
      { id: 'btsc', name: 'Buy/Sell Stock with Cooldown', diff: 'Medium', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', pat: 'State machine' },
      { id: 'ilst', name: 'Interleaving String', diff: 'Medium', url: 'https://leetcode.com/problems/interleaving-string/', pat: '2D DP' },
    ],
  },
  {
    id: 'backtrack', phase: 3, week: 8, title: 'Backtracking', color: 'var(--p3)',
    lesson: {
      overview: 'Backtracking = DFS + undo. Every backtracking problem has the same structure. Memorise ONE template. Adapt the base case and prune condition. Sort input first to enable duplicate skipping and early termination.',
      patterns: [
        {
          name: 'Universal Backtracking Template',
          signal: 'All subsets · all combinations · all permutations · constraint satisfaction · word search',
          approach: 'Base case → record. Loop from start. Prune. Push. Recurse(i+1 no-reuse, i reuse). Pop.',
          trace: `Subsets of [1,2,3]:
backtrack(0, []):
  record []
  i=0: push 1, backtrack(1,[1])
    record [1]
    i=1: push 2, backtrack(2,[1,2])
      record [1,2]
      i=2: push 3, backtrack(3,[1,2,3]) record [1,2,3], pop 3
      pop 2
    i=2: push 3, backtrack(3,[1,3]) record [1,3], pop 3
    pop 1
  i=1: push 2... [2],[2,3]
  i=2: push 3... [3]
All subsets: [],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]`,
          time: 'O(2^n × n) subsets, O(n! × n) perms', space: 'O(n)',
        },
      ],
      decisions: [
        { see: 'All subsets (power set)', think: 'Backtrack: record at every call, i+1 to avoid reuse' },
        { see: 'All combinations summing to target (reuse ok)', think: 'Backtrack with i (not i+1) to allow reuse' },
        { see: 'All permutations', think: 'Backtrack with used[] array, iterate all indices each call' },
        { see: 'Remove duplicates from result', think: 'Sort first, skip i>start and nums[i]==nums[i-1]' },
        { see: 'Word search in 2D grid', think: 'DFS with visited mark, 4 dirs, unmark on return' },
      ],
      pitfalls: [
        'Dedup: skip nums[i]==nums[i-1] only when i>start (not i>0). Otherwise you skip valid first choices.',
        'Combination Sum I (reuse) vs II (no reuse): I uses i not i+1. II uses i+1 AND skips dups.',
        'Permutations with dups: sort first, skip if used[i] OR (i>0 AND nums[i]==nums[i-1] AND NOT used[i-1]).',
      ],
    },
    template: `result = []

# Subsets / Combinations
def backtrack(start, path):
    result.append(path[:])           # record at every step (subsets)
    # OR: if len(path)==k: ... (k-length combos)
    for i in range(start, len(nums)):
        if i > start and nums[i]==nums[i-1]: continue  # dedup (after sort)
        path.append(nums[i])
        backtrack(i+1, path)         # i+1: no reuse
        # backtrack(i, path)         # i: allow reuse (Combination Sum I)
        path.pop()

nums.sort()
backtrack(0, [])

# Permutations
used = [False]*n
def backtrack(path):
    if len(path)==n: result.append(path[:]); return
    for i in range(n):
        if used[i]: continue
        # Dedup for duplicates:
        # if i>0 and nums[i]==nums[i-1] and not used[i-1]: continue
        used[i]=True; path.append(nums[i])
        backtrack(path)
        path.pop(); used[i]=False

# Word Search (grid DFS + undo)
DIRS = [(0,1),(0,-1),(1,0),(-1,0)]
def dfs(r, c, i):
    if i==len(word): return True
    if r<0 or r>=R or c<0 or c>=C: return False
    if board[r][c]!=word[i]: return False
    board[r][c]='#'    # mark visited
    found=any(dfs(r+dr,c+dc,i+1) for dr,dc in DIRS)
    board[r][c]=word[i]  # restore (backtrack)
    return found`,
    problems: [
      { id: 'subs', name: 'Subsets', diff: 'Medium', url: 'https://leetcode.com/problems/subsets/', pat: 'Backtrack all' },
      { id: 'csum', name: 'Combination Sum', diff: 'Medium', url: 'https://leetcode.com/problems/combination-sum/', pat: 'Backtrack + reuse' },
      { id: 'cs2', name: 'Combination Sum II', diff: 'Medium', url: 'https://leetcode.com/problems/combination-sum-ii/', pat: 'Sort + skip dups' },
      { id: 'perm', name: 'Permutations', diff: 'Medium', url: 'https://leetcode.com/problems/permutations/', pat: 'used[] array' },
      { id: 'sbs2', name: 'Subsets II', diff: 'Medium', url: 'https://leetcode.com/problems/subsets-ii/', pat: 'Sort + skip dups' },
      { id: 'wsrch', name: 'Word Search', diff: 'Medium', url: 'https://leetcode.com/problems/word-search/', pat: 'Grid DFS + undo' },
      { id: 'palp', name: 'Palindrome Partitioning', diff: 'Medium', url: 'https://leetcode.com/problems/palindrome-partitioning/', pat: 'Backtrack + palindrome' },
      { id: 'ltph', name: 'Letter Combinations Phone Number', diff: 'Medium', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', pat: 'Backtrack on map' },
      { id: 'nqn', name: 'N-Queens', diff: 'Hard', url: 'https://leetcode.com/problems/n-queens/', pat: 'Backtrack + col/diag' },
    ],
  },
  {
    id: 'tries', phase: 3, week: 9, title: 'Tries', color: 'var(--p3)',
    lesson: {
      overview: 'Trie = prefix tree. Each node: children map + is_end flag. O(k) per operation where k = word length. Use over HashSet when you need prefix operations, autocomplete, or multiple simultaneous word lookups.',
      patterns: [
        {
          name: 'Standard Trie Insert/Search/StartsWith',
          signal: 'Prefix queries · autocomplete · longest prefix match',
          approach: 'Walk char by char. Create child if missing (insert). Check path exists (startsWith). Check path exists AND is_end (search).',
          trace: `Insert "apple", "app":
root→a→p→p→l→e (is_end=True at e, also at second p)

search("apple") → walk to e, is_end=True ✓
search("app")   → walk to 3rd p, is_end=True ✓
search("ap")    → walk to 2nd p, is_end=False ✗
startsWith("ap")→ walk to 2nd p, path exists ✓`,
          time: 'O(k) per op', space: 'O(total chars)',
        },
      ],
      decisions: [
        { see: 'Prefix search / autocomplete', think: 'Trie: O(k) vs O(n·k) scanning all words' },
        { see: "Wildcard '.' matches any character", think: 'Trie + DFS through all children for wildcard' },
        { see: 'Find all words in a grid', think: 'Trie + grid backtracking (Word Search II)' },
        { see: 'Maximum XOR of two numbers', think: 'Binary Trie, bit by bit from MSB' },
        { see: 'Insert / search / startsWith design', think: 'Classic Trie implementation' },
      ],
      pitfalls: [
        'Word Search II: store the complete word in TrieNode.word (not just is_end). Remove found words to prevent duplicates.',
        'Wildcard: when char is \'.\', recurse into ALL children nodes, not just one.',
        'Trie vs HashSet: if only exact match, use HashSet. Trie is worth the complexity only for prefix ops.',
      ],
    },
    template: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self): self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True

    def search(self, word):
        node = self.root
        for c in word:
            if c not in node.children: return False
            node = node.children[c]
        return node.is_end

    def starts_with(self, prefix):
        node = self.root
        for c in prefix:
            if c not in node.children: return False
            node = node.children[c]
        return True

# Wildcard search ('.' = any char)
def search_wild(root, word):
    def dfs(node, i):
        if i == len(word): return node.is_end
        c = word[i]
        if c == '.':
            return any(dfs(child, i+1) for child in node.children.values())
        if c not in node.children: return False
        return dfs(node.children[c], i+1)
    return dfs(root, 0)`,
    problems: [
      { id: 'itrp', name: 'Implement Trie (Prefix Tree)', diff: 'Medium', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', pat: 'Trie' },
      { id: 'dasw', name: 'Design Add and Search Words', diff: 'Medium', url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', pat: 'Trie + DFS wildcard' },
      { id: 'ws2', name: 'Word Search II', diff: 'Hard', url: 'https://leetcode.com/problems/word-search-ii/', pat: 'Trie + grid backtrack' },
    ],
  },
  {
    id: 'intervals', phase: 3, week: 9, title: 'Intervals', color: 'var(--p3)',
    lesson: {
      overview: 'Sort first. The direction of the sort (by start or by end) determines the algorithm. Sort by start for merging. Sort by end for greedy selection.',
      patterns: [
        {
          name: 'Merge Overlapping Intervals',
          signal: 'Merge overlapping · union of intervals · coverage',
          approach: 'Sort by start. Iterate: if current start ≤ last merged end, extend. Else, add new interval.',
          trace: `[[1,3],[2,6],[8,10],[15,18]]
merged=[[1,3]]
[2,6]: 2≤3, extend → [[1,6]]
[8,10]: 8>6, new → [[1,6],[8,10]]
[15,18]: 15>10, new → [[1,6],[8,10],[15,18]]`,
          time: 'O(n log n)', space: 'O(n)',
        },
        {
          name: 'Minimum Rooms (Min-Heap of End Times)',
          signal: 'Meeting rooms needed · minimum resources · overlapping tasks',
          approach: 'Sort by start. Min-heap of end times. If heap top ≤ current start: reuse (replace). Else: add new room (push). Answer = heap size.',
          trace: `[[0,30],[5,10],[15,20]] sorted by start
[0,30]: heap=[30]
[5,10]: 5>30? No → new room. heap=[10,30]
[15,20]: 15>heap[0]=10? Yes → reuse! heap=[20,30]
answer = len(heap) = 2`,
          time: 'O(n log n)', space: 'O(n)',
        },
      ],
      decisions: [
        { see: 'Merge overlapping intervals', think: 'Sort by start, linear scan, extend if overlap' },
        { see: 'Minimum rooms / platforms / servers', think: 'Sort + min-heap of end times' },
        { see: 'Remove minimum to make non-overlapping', think: 'Sort by END time, greedy keep earliest end' },
        { see: 'Insert new interval into sorted list', think: 'Collect non-overlapping before/after, merge all overlapping' },
        { see: 'Number of overlaps at any point', think: 'Events: +1 at start, -1 at end, sort and scan' },
      ],
      pitfalls: [
        'Non-overlapping: sort by END (not start). Keep the interval with earliest end to leave most room.',
        'Insert Interval: handle before non-overlapping, then merge all overlapping, then after non-overlapping.',
        'Meeting Rooms I (just check feasibility): sort by start, check if any consecutive pair overlaps.',
      ],
    },
    template: `# Merge Intervals
intervals.sort()
merged = [intervals[0]]
for s, e in intervals[1:]:
    if s <= merged[-1][1]: merged[-1][1] = max(merged[-1][1], e)
    else: merged.append([s, e])

# Minimum Meeting Rooms
import heapq
intervals.sort()
heap = []    # end times
for s, e in intervals:
    if heap and heap[0] <= s: heapq.heapreplace(heap, e)   # reuse
    else: heapq.heappush(heap, e)                           # new room
return len(heap)

# Non-overlapping Intervals — minimum removals
intervals.sort(key=lambda x: x[1])   # sort by END
count = 0; end = float('-inf')
for s, e in intervals:
    if s >= end: end = e              # keep
    else: count += 1                  # remove

# Insert Interval
res = []; i = 0; n = len(intervals)
# Non-overlapping before
while i<n and intervals[i][1]<newInterval[0]:
    res.append(intervals[i]); i+=1
# Merge all overlapping
while i<n and intervals[i][0]<=newInterval[1]:
    newInterval[0]=min(newInterval[0],intervals[i][0])
    newInterval[1]=max(newInterval[1],intervals[i][1]); i+=1
res.append(newInterval)
res.extend(intervals[i:])`,
    problems: [
      { id: 'mrgiv', name: 'Merge Intervals', diff: 'Medium', url: 'https://leetcode.com/problems/merge-intervals/', pat: 'Sort + merge' },
      { id: 'insiv', name: 'Insert Interval', diff: 'Medium', url: 'https://leetcode.com/problems/insert-interval/', pat: 'Find overlap, merge' },
      { id: 'noiv', name: 'Non-overlapping Intervals', diff: 'Medium', url: 'https://leetcode.com/problems/non-overlapping-intervals/', pat: 'Sort by end, greedy' },
      { id: 'mtii', name: 'Meeting Rooms II', diff: 'Medium', url: 'https://leetcode.com/problems/meeting-rooms-ii/', pat: 'Min-heap end times' },
      { id: 'mniq', name: 'Min Interval per Query', diff: 'Hard', url: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/', pat: 'Sort + heap' },
    ],
  },
  {
    id: 'adv-dp', phase: 4, week: 10, title: 'Advanced DP', color: 'var(--p4)',
    lesson: {
      overview: 'Hard-level DP. Interval DP for "last operation" problems (burst balloons, matrix chain). LIS in O(n log n) with patience sort. Bitmask DP for small-n subset enumeration. These appear in FAANG Hard rounds.',
      patterns: [
        {
          name: 'Interval DP — Fill by Increasing Length',
          signal: 'Burst balloons · stone game · matrix chain · optimal BST · palindrome partitioning cost',
          approach: 'dp[i][j] = optimal answer for subarray [i..j]. Outer loop = length 2..n. Inner: start i. k = split point. Key question: "What is the LAST operation on [i..j]?"',
          trace: `Burst Balloons (padded: [1,3,1,6,8,1])
dp[i][j] = max coins from balloons strictly between i and j
dp[i][j] = max over k: dp[i][k]+nums[i]*nums[k]*nums[j]+dp[k][j]

Fill by length=2:
  dp[0][2]=nums[0]*nums[1]*nums[2]=1*3*1=3
Fill length=3,4,...
Answer: dp[0][n-1]`,
          time: 'O(n³)', space: 'O(n²)',
        },
        {
          name: 'LIS in O(n log n) — Patience Sort',
          signal: 'Longest increasing subsequence · longest chain · Russian doll envelopes',
          approach: 'Maintain tails[]: smallest tail of all increasing subsequences of each length. Binary search for position. If ≥ all tails: extend. Else: replace.',
          trace: `nums=[10,9,2,5,3,7,101,18]
tails=[]
10→[10]
9→[9]     (replace 10)
2→[2]     (replace 9)
5→[2,5]   (extend)
3→[2,3]   (replace 5)
7→[2,3,7] (extend)
101→[2,3,7,101]
18→[2,3,7,18]  (replace 101)
len(tails)=4 ✓`,
          time: 'O(n log n)', space: 'O(n)',
        },
      ],
      decisions: [
        { see: 'Burst balloons / stone game / matrix chain', think: 'Interval DP: fill by length, split point k' },
        { see: 'Longest increasing/decreasing subsequence', think: 'LIS: O(n²) DP or O(n log n) patience sort' },
        { see: 'TSP / visit all nodes (n≤20)', think: 'Bitmask DP: dp[mask][i]' },
        { see: 'Minimax game / two players', think: 'Interval DP or game DP alternating' },
        { see: 'Russian doll / 2D version of LIS', think: 'Sort one dim, LIS on other (handle ties carefully)' },
      ],
      pitfalls: [
        'Interval DP fill order: outer = LENGTH (2 to n), inner = START i, j = i+length-1. Never iterate by i or j directly.',
        'LIS tails array: does NOT represent an actual subsequence. Only its length is meaningful.',
        'Russian Doll: sort by width ASCENDING, height DESCENDING for same width. Prevents using two same-width boxes.',
      ],
    },
    template: `# Interval DP — fill by length
n = len(arr)
dp = [[0]*n for _ in range(n)]
for length in range(2, n+1):           # window size
    for i in range(n-length+1):
        j = i + length - 1
        for k in range(i+1, j):        # split point
            dp[i][j] = max(dp[i][j], dp[i][k]+dp[k][j]+cost(i,k,j))

# LIS in O(n log n) — patience sort
import bisect
tails = []
for num in nums:
    pos = bisect.bisect_left(tails, num)   # first >= num
    if pos == len(tails): tails.append(num)  # new length
    else: tails[pos] = num                    # replace (smaller tail)
return len(tails)

# Bitmask DP — TSP (n ≤ 20)
INF = float('inf')
n = len(dist)
dp = [[INF]*n for _ in range(1<<n)]
dp[1<<0][0] = 0    # start at node 0
for mask in range(1<<n):
    for u in range(n):
        if not (mask>>u&1) or dp[mask][u]==INF: continue
        for v in range(n):
            if mask>>v&1: continue
            new_mask = mask|(1<<v)
            dp[new_mask][v] = min(dp[new_mask][v], dp[mask][u]+dist[u][v])`,
    problems: [
      { id: 'lisq', name: 'Longest Increasing Subsequence', diff: 'Medium', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', pat: 'DP + BS patience sort' },
      { id: 'brstb', name: 'Burst Balloons', diff: 'Hard', url: 'https://leetcode.com/problems/burst-balloons/', pat: 'Interval DP' },
      { id: 'mxsq', name: 'Maximal Square', diff: 'Medium', url: 'https://leetcode.com/problems/maximal-square/', pat: '2D DP min-of-3' },
      { id: 'rdev', name: 'Russian Doll Envelopes', diff: 'Hard', url: 'https://leetcode.com/problems/russian-doll-envelopes/', pat: 'Sort + LIS' },
      { id: 'wldm', name: 'Wildcard Matching', diff: 'Hard', url: 'https://leetcode.com/problems/wildcard-matching/', pat: '2D DP' },
      { id: 'stng', name: 'Stone Game', diff: 'Medium', url: 'https://leetcode.com/problems/stone-game/', pat: 'Interval DP' },
      { id: 'ckp2', name: 'Cherry Pickup II', diff: 'Hard', url: 'https://leetcode.com/problems/cherry-pickup-ii/', pat: '3D DP two agents' },
    ],
  },
];

export const PHASES = [
  { id: 1, title: 'Foundation', color: 'var(--p1)', weeks: 'Weeks 1–2' },
  { id: 2, title: 'Core', color: 'var(--p2)', weeks: 'Weeks 3–4' },
  { id: 3, title: 'Advanced', color: 'var(--p3)', weeks: 'Weeks 5–9' },
  { id: 4, title: 'Elite', color: 'var(--p4)', weeks: 'Week 10+' },
];

export const TOTAL_PROBLEMS = DSA_TOPICS.reduce((s, t) => s + t.problems.length, 0);
