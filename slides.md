class: center middle

.font-size-6[
Scaling GraphQL <br/> for .custom-underline[500,000,000] req/min
]
GraphQL Conf 2024

---

# Who am I?

- GraphQL Enthusiast

- Open Source Contributor

- Functional Programmer

- Passionate about DevEx

- Based out of Bangalore (India)

---

class: middle

# GraphQL Journey

## .font-grey[Section 1]

---

# 2016 Dream11

--

.stat[

.stat-item[100,000 .title[Concurrency]]

.stat-item[1,000,000 .title[Users]]

.stat-item[10 .title[Full-Stack Engineers]]

]

---

.block.center[.font-size-5[💰 .weight-700.custom-underline[Series B]]]

--

- Android

- iOS

- PWA

- Microservices

--

## .block.center[.font-size-5[🧐 .weight-700.custom-underline[GraphQL?]]]

---

## .custom-underline[Architecture]

.block.center[.size-75[![Architecture](./img/architecture.svg)]]

--

.block.center[{ Microservices + Apps }]

---

# 2024 Dream11

.stat[

.stat-item[500 .title[Engineers]]

.stat-item[100 .title[Microservices]]

.stat-item[10,000,000 .title[Concurrency]]

.stat-item[200,000,000 .title[Users]]

]

--

## .block.center[.font-size-5[🙌 .weight-700.custom-underline[GraphQL]]]

---

.block.center[![Not so fast](https://media1.tenor.com/m/UB_adCAGhUQAAAAd/baby-cute.gif)]

---

class: middle

# Challenges & Workarounds

## .font-grey[Section 2]

---

.font-size-3[👉 .weight-700.custom-underline[Speculative Performance]]

--

.font-size-3[🚀] .font-grey[System]

.font-size-3[💔] .font-grey[Internal]

.font-size-3[🏭] .font-grey[Benchmarking Infrastructure]

---

.font-size-3[👉 .weight-700.custom-underline[Highly Specialized]]

--

.font-size-3[🎯] .font-grey[Dedicated Team]

---

.font-size-3[👉 .weight-700.custom-underline[Fragile]]

--

.font-size-3[🌀] .font-grey[Processes]

.font-size-3[🧪] .font-grey[Testing Infrastructure]

---

.font-size-3[👉 .weight-700.custom-underline[Caching]]

--

.font-size-3[⚡] .font-grey[On Services]

---

.font-size-3[👉 .weight-700.custom-underline[Resiliency]]

--

.font-size-3[🛡️] .font-grey[API Gateway]

---

.font-size-3[👉 .weight-700.custom-underline[Maintenance]]

--

.block[.center[.font-size-5[🤷]]]

---

class: middle

# Learnings of 8 Years

## .font-grey[Section 3]

---

class:middle center

.font-size-3.weight-700[🕊️ Liberties Constraint and Constraints Liberate🕊️]

---

# GraphQL

--

### 🔒 .custom-underline[Schema]

### 🔒 .custom-underline[Query]

### 🕊️ .custom-underline[Resolver]

---

class: middle center

![Dreaming](https://i.giphy.com/o5ht0KxTJDAS90MNWI.webp)

---

class: middle

.font-size-3[🙅‍♂️ .weight-700.custom-underline[Handwritten GraphQL]]

---

class: middle

.font-size-3[🤔 .weight-700.custom-underline[Learn from SQL]]

---

class: middle

.font-size-3[✋ .weight-700.custom-underline[Avoid Business Logic]]

---

class:middle

# .custom-underline[Default Runtime for GraphQL]

## .font-grey[Section 4]

---

class: middle center flex-col

.logo[![Tailcall Logo](./img/taicall.svg)]

---

class: middle flex-row

.col-40[
.custom-underline[GraphQL Schema 👉]
]
.col-60[

```graphql
schema {
  query: Query
}

type Query {
  posts: [Post]
}

type Post {
  id: ID!
  title: String!
  body: String
  userId: ID!
  user: User
}

type User {
  id: ID!
  name: String!
  email: String!
}
```

]

---

class: middle flex-row

.col-40[
.custom-underline[Annotations 👉]
]
.col-60[

```graphql
schema @upstream(baseURL: "https://api.d11.local") {
  query: Query
}

type Query {
  posts: [Post] @http(path: "/posts")
}

type Post {
  id: ID!
  title: String!
  body: String
  userId: ID!
  user: User @http(path: "/users/{{value.userId}}")
}

type User {
  id: ID!
  name: String!
  email: String!
}
```

]

---

# Start the server

![Tailcall Start](./img/tailcall-start.png)

---

class: middle flex-row

.col-50[

## Comparison

.size-75[![Tailcall Version](./img/tailcall-graphql-server.png)]

]
.col-50[
.size-75[![JS Version](./img/js-graphql-server.png)]
]

---

class: middle

# How it works

---

# Initialization

<!-- TODO: add an excalidraw visual  -->

- Read the configuration

- Attach Resolvers

- Initialize HTTP Server

---

# Query Execution

![Query Engine](./img/query-engine.svg)

---

# Upstream

- REST

- gRPC

- GraphQL

--

.block.center[.font-size-4[🎨 .weight-700.custom-underline[Router]]]

---

class: middle

.center[![Relaxed Baby](https://media1.tenor.com/m/57Cq5qVvgTUAAAAC/lil-kid-chilling-chilling-on-couch.gif)]

---

## .custom-underline[Revisiting the Challenges]

--

1. Predictable Performance

--

2. Generalized GraphQL Runtime

--

3. Robust Foundations

--

4. Resilient to Errors

--

5. Configuration Driven

---

<!-- TODO: @amitksingh1490 Add Tailcall Logo On the Right -->

## .custom-underline[Awesome Community 🙌]

## ![Contributors](https://contrib.rocks/image?repo=tailcallhq/tailcall)

class: flex-row middle
.col-50[
.font-size-3[Built with 💗 using]
]
--
.col-50[
.logo[![Rust Logo](https://www.rust-lang.org/logos/rust-logo-blk.svg)]
]

---

- Repo: https://github.com/tailcallhq/tailcall

- RUST > Performance
- Try it Out | Feedback
- Github
- Binary Size
- Contributors
- Releases
- Commits

<!-- Github Repo -->
<!-- Contributors + Releases + Commits -->
<!-- Looking for Contributors and Feedback! -->

---

class: middle

# Takeaway

## .font-grey[Section 5]

---

## .custom-underline[Takeaway]

1. Innovation on GraphQL performance is necessary.

2. Handwritten GraphQL is difficult to maintain.

3. Library authors should take inspiration from SQL engines.

---

class: middle

## .custom-underline[Official Introduction]

1. Founder of Tailcall

2. Ex VP of Engineering at Dream11

.flex-row[

.col-33[
.icon[![Twitter](./img/x-logo.svg)]
@tusharmath
]
.col-33[
.icon[![LinkedIn](./img/In-White-128@2x.png)]
@tusharmath
]
.col-33[
.icon[![Github](./img/github-logo.svg)]
@tusharmath
]
]

---

class: flex-row middle

.col-60[

# .custom-underline[\#TailcallHack]

- Build the GraphQL Server

- 2,000 USD Prize

- Checkout - tailcallhq/hackathon

]

.col-40.center[
.middle.size-50[![Tailcall Hack](./img/hackathon-repo-qr.png)]
]

---

class: flex-col center

# Thank You!

.font-size-5[❤️]

---
