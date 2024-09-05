class: center middle

.font-size-5[.tc-highlight[Scaling] GraphQL for 500,000,000 req/min]

GraphQL Conf 2024

---

# Who am I?

--

1. Founder of Tailcall

--

2. VP of Engineering at Dream11

--

3. Open Source Author and Maintainer

---

# Agenda

1. GraphQL Journey

2. Challenges & Resolutions

3. Learnings of the last 8 years

4. Applying learnings today

5. Key Takeaway

---

# .font-size-5.tc-highlight[\#TailcallHack]

Fastest Server Wins!

- TODO: Add QR Code

---

class: middle, center

# 1. GraphQL Journey

---

# .tc-highlight[2016] Dream11

.stat[

.stat-item[10 .title[Full Stack Engineers]]

.stat-item[100,000 .title[Concurrency]]

.stat-item[1,000,000 .title[Users]]

]

---

.block.center[ .font-size-5[💰 .weight-700[Series B]]]

--

- Android

- iOS

- PWA

- Microservices

--

.block.center[ .font-size-5[🧐 .weight-700[GraphQL?]]]

---

# .tc-highlight[2024] Dream11

.stat[

.stat-item[500 .title[Engineers]]

.stat-item[10,000,000 .title[Concurrency]]

.stat-item[200,000,000 .title[Users]]

]

---

![Architecture](./img/architecture.svg)

--

.block.center[ .font-size-5[🙌 .weight-700[GraphQL]]]

---

class: middle center

# 2. Challenges & Resolutions

---

class: middle

.font-size-3[
.custom-underline[
❌ .weight-700[Speculative Performance]
]
]

.font-size-3[🛠️] .font-grey[ Benchmarking Infrastructure]

---

class: middle

.font-size-3[
.custom-underline[
❌ .weight-700[Highly Specialized]
]
]

.font-size-3[🛠️] .font-grey[ Declarative Design]

---

class: middle

.font-size-3[
.custom-underline[
❌ .weight-700[Fragile]
]
]

.font-size-3[🛠️] .font-grey[Generalize Runtime]

---

class: middle

.font-size-3[
.custom-underline[
❌ .weight-700[Caching]
]
]

.font-size-3[🛠️] .font-grey[ On Services]

---

class: middle

.font-size-3[
.custom-underline[
❌ .weight-700[Resiliency]
]
]

.font-size-3[🛠️] .font-grey[ Follow Traditions]

---

class: middle

.font-size-3[
.custom-underline[
❌ .weight-700[Maintenance]
]
]

.block[.center[.font-size-3[🤷]]]

---

class: middle

# 3. Learnings of 8 Years

---

class:middle center

.font-size-3.weight-700[
🕊️ Liberties Constraint and Constraint Liberate 🕊️]

---

class:middle custom-background-image
background-image: url(./img/rush-hour.png)

.font-size-3.weight-500[🚦 Traffic Signal]

.font-size-3.weight-500[👮 Fine]

.font-size-3.weight-500[🛣 Marking]

---

class: middle custom-table

.block.half[![GraphQL Logo](img/graphql-logo-white.png)]

| 🚧 Constraint   | 🕊️ Liberty        |
| :-------------- | :---------------- |
| Schema          | Type System       |
| Query           | Efficiency        |
| Single Endpoint | Unification       |
| DSL             | Language Agnostic |

---

class: two-columns

.column[
.font-size-3[
.custom-underline[
🕊️ .weight-500[Liberties]
]
]

- Type System

- Efficiency

- Unification

- Language Agnostic

]

--

.column[
.font-size-3[
.custom-underline[
🚧 .weight-500[Constraint]
]
]

- Learning Curve

- Complexity

- Reliability

- Interoperability

]

---

class: middle

.font-size-3[
.custom-underline[
📌 .weight-700[Two Pass Executor]
]
]

---

class: middle

.font-size-3[
.custom-underline[
🙅‍♂️ .weight-700[Handwritten GraphQL]
]
]

---

class: middle

.font-size-3[
.custom-underline[
🤔 .weight-700[Learn from SQL]
]
]

---

class: middle

.font-size-3[
.custom-underline[
✋ .weight-700[Avoid Business Logic]
]
]

---

class:middle

# 4. Applying Learnings

---

# 2020 .tc-highlight[Rewrite] GraphQL

1. High performance & reliability

2. Declarative, extendable & modular Design

3. Connect to any data-source

---

# 2021 .tc-highlight[Launch]

--

- Before `40,000` cores
- After `6,400` cores

--

.stat[

.stat-item[🚀 7x .title[Performance]]

.stat-item[💵 85% .title[Cost]]

.stat-item[💪 3 .title[Team]]

]

---

# 2022 .tc-highlight[Open Source]

--

- Battle tested it

--

- Before open sourcing:

--

- Port from JS to .tc-highlight[Rust]

--

- Configuration Based

---

class: center flex-col flex-top

# Tailcall

<!-- TODO add Logo -->

--

A high-performance, general-purpose GraphQL runtime written in Rust.

---

<!-- TODO: add a more Dream11 Example -->

### Write your schema

```graphql
schema {
  query: Query
}

type Query {
  posts: [Post]
}

type Post {
  id: ID
  title: String
  body: String
}
```

---

### Describe your .tc-highlight[resolvers]

```graphql
schema @upstream(baseURL: "https://api.d11.local") {
  query: Query
}

type Query {
  posts: [Post] @http(path: "/posts")
}

type Post {
  id: ID
  title: String
  body: String
}
```

--

### Start the server

```bash
tailcall start ./config.graphql
```

---

```js
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const express = require("express");
const fetch = require("node-fetch");

const schema = buildSchema(`
  type Query {
    posts: [Post]
  }

  type Post {
    id: ID
    title: String
    body: String
  }
`);

const root = {
  posts: async () => {
    try {
      const response = await fetch("https://api.d11.local/posts");
      return await response.json();
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  },
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
  })
);

app.listen(4000, () => {
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
```

---

class: middle

# How does it works?

---

# Initialization

<!-- TODO: add an excalidraw visual  -->

- Read the configuration

- Attach Resolvers

- Initialize HTTP Server

---

# Execution

<!-- TODO: add an excalidraw visual  -->

- Parse the incoming request

- Create Execution Plan

- Optimize the Plan

- Execute the Plan

- Create Response Body

- Send Response

---
