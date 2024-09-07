class: center middle

.font-size-6.weight-500[
Scaling GraphQL for .tc-underline[500,000,000] req/min
]

GraphQL Conf 2024

---

class: middle

# Who am I?

- GraphQL Enthusiast

- Open Source Contributor

- Passionate about DevEx

.img-fixed-right[![Tushar Mathur](./img/profile-picture.jpg)]

---

class: middle

## .font-grey[Part 1]

# GraphQL Journey

---

# 2016 Dream11

- Fantasy Gaming Platform

- Monolith to Microservices

--

## .block.center[.font-size-5[🧐 .weight-700.tc-underline[GraphQL?]]]

---

## .tc-underline[Architecture]

.block.center[.size-75[![Architecture](./img/architecture.svg)]]

--

.block.center[{ Microservices + Apps }]

---

# 2022 Dream11

.stat[

.stat-item[500 .title[Engineers]]

.stat-item[150 .title[Microservices]]

.stat-item[10,000,000 .title[Concurrency]]

.stat-item[200,000,000 .title[Users]]

]

--

## .block.center[.font-size-5[🙌 .weight-700.tc-underline[GraphQL]]]

---

class: middle

# Thank you!

.img-fixed-right[![Relaxed Baby](https://media1.tenor.com/m/57Cq5qVvgTUAAAAC/lil-kid-chilling-chilling-on-couch.gif)]

---

class: middle

# .tc-underline[Not so fast!]

.img-fixed-right[![Not so fast](https://media1.tenor.com/m/UB_adCAGhUQAAAAd/baby-cute.gif)]

---

class: middle

## .font-grey[Part 2]

# Challenges

---

.font-size-3[👉 .weight-700.tc-underline[Speculative Performance]]

--

.font-size-3[🚀] .font-grey[End-to-End]

.font-size-3[💔] .font-grey[Internal]

--

.font-size-3[🏭] .font-grey[Benchmarking Infrastructure]

---

.font-size-3[👉 .weight-700.tc-underline[Highly Specialized]]

--

.font-size-3[🎯] .font-grey[Dedicated Team]

---

.font-size-3[👉 .weight-700.tc-underline[Fragility]]

--

.font-size-3[🌀] .font-grey[Processes]

.font-size-3[🧪] .font-grey[Testing Infrastructure]

---

.font-size-3[👉 .weight-700.tc-underline[Caching]]

--

.font-size-3[⚡] .font-grey[On Services]

---

.font-size-3[👉 .weight-700.tc-underline[Resiliency]]

--

.font-size-3[🛡️] .font-grey[API Gateway]

---

class:middle

# 👉 .weight-700.tc-underline[Maintainability]

--

.img-fixed-right[![Maintenance](https://media1.tenor.com/m/aIVC4JjqorYAAAAC/frustrating-frustrated.gif)]

---

## .tc-underline[Challenges]

|                            | Workarounds |
| -------------------------- | :---------: |
| 1. Speculative Performance |    ⭐️✩✩    |
| 2. Highly Specialized      |     ✩✩✩     |
| 3. Fragile                 |    ⭐️✩✩    |
| 4. Caching                 |    ⭐️✩✩    |
| 5. Resiliency              |    ⭐️✩✩    |
| 6. Maintenance             |     ✩✩✩     |

---

class: middle

## .font-grey[Part 3]

# Learnings of 8 Years

---

class:middle center

.font-size-3.weight-700[🕊️ Liberties Constraint and Constraints Liberate🕊️]

---

class: middle

# .tc-underline[Without Constraints]

--

.img-fixed-right[![Busy Road](https://media.tenor.com/jOqY21jgeuYAAAAM/traffic-jam-unlined-vehicles.gif)]

---

# GraphQL

## 1. Schema

## 2. Query

## 3. Resolver

---

class: center middle

## .block.center[.font-size-5[🕊️ .weight-700.tc-underline[Resolver] 🕊️]]

![GraphQL Spec Screenshot](./img/spec-screenshot.png)

---

class: middle

.font-grey[Step 1]

## ✋ .weight-700.tc-underline[Avoid Business Logic]

## 👍 .weight-700.tc-underline[Allow only Orchestration Logic]

---

class: middle

.font-grey[Step 2]

## 🙅‍♂️ .weight-700.tc-underline[Handwritten Resolver]

## 🤔 .weight-700.tc-underline[Declarative Approach]

---

class: middle

.font-grey[Step 3]

.font-size-3[🤔 .weight-700.tc-underline[Learn from SQL]]

.size-25[![Apache Calcite](https://calcite.apache.org/img/logo.svg)]

---

class:middle

## .font-grey[Part 4]

# .tc-underline[Generalized Runtime for GraphQL]

---

class: middle center flex-col

.invert[![Tailcall Logo](./img/taicall.svg)]

---

class: middle flex-row

.col-60[
.tc-underline[## GraphQL Schema 👉]
]
.col-40[

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
.tc-underline[## Annotate 👉]
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

## Start the server

![Tailcall Start](./img/tailcall-start.png)

---

# .tc-underline[First Class Support]

&nbsp;

- REST

- gRPC

- GraphQL

--

.block.center[.font-size-4[🎨 .weight-700.tc-underline[Router]]]

---

class: middle

# .tc-underline[2 Key Capabilities]

---

# .tc-underline[AOT Analyzer]

&nbsp;

![Tailcall Start](./img/tailcall-error.png)

---

# .tc-underline[JIT Optimizer]

&nbsp;

![Query Engine](./img/query-engine.svg)

---

class: middle

## .tc-underline[100 lines Javascript 👉]

--

.img-fixed-right[![JS Version](./img/js-graphql-server.png)]

---

class: middle

|                       |  Before   | .invert.size-50[![tailcall logo](./img/taicall.svg)] |
| --------------------- | :-------: | :--------------------------------------------------: |
| 1. Flexibility        | ⭐️⭐️⭐️ |                       ⭐️ ✩ ✩                        |
| 2. Performance        |   ⭐️✩✩   |                      ⭐️⭐️⭐️                       |
| 3. Highly Specialized |    ✩✩✩    |                      ⭐️⭐️⭐️                       |
| 4. Fragile            |   ⭐️✩✩   |                      ⭐️⭐️⭐️                       |
| 5. Caching            |   ⭐️✩✩   |                      ⭐️⭐️⭐️                       |
| 6. Resiliency         |   ⭐️✩✩   |                      ⭐️⭐️⭐️                       |
| 7. Maintenance        |    ✩✩✩    |                      ⭐️⭐️⭐️                       |

.center[Revisiting the Challenges]

---

class: middle

.invert.right-50.rust-logo[![Rust Logo](https://www.rust-lang.org/logos/rust-logo-blk.svg)]

.font-size-3.weight-500[Built with 💗 using]

.font-size-3.weight-500.tc-underline[Apache 2.0 License]

---

## .tc-underline[Awesome Community 🙌]

## ![Contributors](https://contrib.rocks/image?repo=tailcallhq/tailcall)

.block.center.weight-500[Please Share Feedback!]

---

class: middle

## .font-grey[Part 5]

# Takeaway

---

class: middle

## .tc-underline[Takeaway]

1. Innovation on GraphQL performance is necessary.

2. Handwritten GraphQL is difficult to maintain.

3. Library authors should take inspiration from SQL engines.

---

class: flex-row middle

.col-60[

# .tc-underline[\#TailcallHack]

- Build the GraphQL Server

- 2,000 USD Prize

- Checkout - tailcallhq/hackathon

]

.col-40.center[
.middle.size-50[![Tailcall Hack](./img/hackathon-repo-qr.png)]
]

---

class: middle

## .tc-underline[Thank You! ❤️]

&nbsp;

1. Founder of Tailcall

2. Ex VP of Engineering at Dream11 (2016-2022)

.flex-row[

.col-grow[
.icon[![Twitter](./img/x-logo.svg)]
@tusharmath
]
.col-grow[
.icon[![LinkedIn](./img/In-White-128@2x.png)]
@tusharmath
]
.col-grow[
.icon[![Github](./img/github-logo.svg)]
@tusharmath
]
]
