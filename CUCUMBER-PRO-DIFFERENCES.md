# Differences from Cucumber Pro

This application is based on the architecture from Cucumber Pro (closed source) with some notable changes.
This document is primarily for the Cucumber Pro team.

## Several UI ports

Rather than having a single `UICorePort` that defines the UI-facing API, there are several smaller ports, with a more
focussed responsibility. These are `AccountCommands`, `TransferCommands` and `AccountQueries`.

## Separation of commands and queries

Cucumber Pro's `UICorePort` acts as a facade for both commands and queries. In this app they are separated.

The `*Commands` components are facades that dispatch commands on the internal command bus.
The `*Queries` components provide access to the read models.

## Tests use app component contracts

Cucumber Pro's Cucumber scenarios interacts with the application via a `BusinessAnalyst`. In this application, the
scenarios only interact with the `*Commands` and `*Queries` APIs.

This leads to less duplication of code and better composability as these small components are easier to implement
at various layers of the stack (`Dom*Commands`, `Http*Queries` etc).

## Tiny Express routers

Every `*Commands` and `*Queries` component is wrapped by a tiny Express router, which is easy to reason about.
There is a `makeWebApp` function that builds the entire webapp.

The Web Server (http) is extracted to a framework component.

## Explicit subscription

In order to receive signals (over eventsource), a client first needs to subscribe. No signals flow without a subscription.
This simplifies access control, since it can be done at the time of subscription.

Subscription can be done at two levels:
- As a command, going through the whole CQRS pipeline
- Against the read-model only
Not sure what's best

https://groups.google.com/forum/#!topic/dddcqrs/Pwow6c0cqec
https://www.bouvet.no/bouvet-deler/utbrudd/a-simple-todo-application-a-comparison-on-traditional-vs-cqrs-es-architecture