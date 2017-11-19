
# Background

This patterns in this applications should be generally usable in other domains. They enable:

* Sub-second acceptance test feedback
* In-process UI testing
* Testing in an asynchronous environment
* Testing CQRS/EventSourced systems
* Contract testing
* Simulators
* Server-push (WebSocket/EventSource)
* Immediate consistency

# Architecture

This is braindump of the architecture design decisions that went into the app and its tests.

# AppAssembly

The `AppAssembly` is the class where all the components are created and composed into
a [graph](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)).

More specifically, the graph is a [connected](https://en.wikipedia.org/wiki/Connectivity_(graph_theory)),
[directed](https://en.wikipedia.org/wiki/Directed_graph) graph.

The graph may or may not have [cycles](https://en.wikipedia.org/wiki/Cycle_(graph_theory)).

Typically, a web application will have a cycle (browser to server and back again).
Some applications (such as batch jobs and microservices) often have no cycles, and form a
[directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph).

## Ports

Port components are exposed to `TestAssemblies`. They represent "ports" in the
[hexagonal architecture](http://alistair.cockburn.us/Hexagonal+architecture) terminology.

Example: `VotingPort`

## Adapters

Adapter components are also exposed to `TestAssemblies`. They represent "adapters" in the
[hexagonal architecture](http://alistair.cockburn.us/Hexagonal+architecture) terminology.

Example: `WebApp`

## Inner components

Inner components are not exposed. This is where the domain logic is implemented. Acceptance tests can only
access the domain logic through ports and adapters.

## TestAssembly

The `TestAssembly` is the class where test components are composed and connected to the `AppAssembly`.
It extends the `AppAssembly` by creating additional components for testing.

Those components become part of the connected, directed graph, and *always* has one or more [cycles](https://en.wikipedia.org/wiki/Cycle_(graph_theory)). This is required so that the test can make assertsions on the application's behaviour.

There are two distinct kinds of components in test assemblies and they have different purposes.

### Primary Test components

Primary test components implement the *logical* parts of the tests. They describe the desired behaviour from a
functional perspective without specifying *how*.

A primary test component can be connected to components in the `AppAssembly` in two ways:

* Directly. Test components interact with outer components via function calls, in the same process.
* Via secondary components (see below).

### Secondary Test components

Secondary test components implement the *same* API/contract as AppAssembly ports. They communicate with AppAssembly
adapters (such as the `WebApp`) via the external API offered by the adapter.

Example: `HttpVotingPort`. (Plays the role of 2ndary comp in some tests, but also used in the Browser app!)