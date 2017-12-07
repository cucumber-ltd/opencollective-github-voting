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

These routes can be displayed with:

    node scripts/routes.js

## Explicit subscription

In order to receive signals (over eventsource), a client first needs to subscribe. No signals flow without a subscription.
This simplifies access control, since it can be done at the time of subscription.

When new data is saved in a `*Queries` store, it *schedules* signals to be sent to subscribers.
The scheduled signals will be flushed when `flush` is called.

This allows `Then` steps to explicitly flush the signals, and querying the `*Queries` only after receiving
the signal. This verifies that both the signal part and the query part works as expected, and no
polling is required -> fast, predictable tests.

## Assemblies

Each Assembly represents a hexagon (both the outer and inner part). There are three assemblies:

* `ServerAssembly`
* `ClientAssebly`
* `TestAssembly`

There are several implementations of `TestAssembly`, and they are responsible for building both the
`ServerAssembly` and `ClientAssembly`

## Dom*Queries

If it feels complicated to implement certain methods from the domain-lavel *Queries APIs as Dom*Queries,
this is an indication that the *Queries API should change to be more similar to what's rendered on the screen.

After all, the *Queries provide a service to the UI. Changing the *Queries API to reflect the UI *simplifies*
the UI (less processing of the data), and that makes it trivial to implement an equivalent Dom*Queries API.
Making this change may affect projectors too.

## No projector tests

Instead of testing projectors in isolation, they are tested in conjunction with its associated `*Queries`
implementation. Those tests are written as contract tests, allowing testing of several `*Queries`
implementations as well. This approach has some benefits:

* Store tests are not "accidentally" storing different data from what a projection would do
* Setup is (maybe?) more straightforward - just fire some events at the projector

# DX

## No Webpack, no Babel

The app doesn't use JSX, but a more lightweight alternative ([hyperx](https://github.com/substack/hyperx)).
This allows writing JSX-like templates without the need for (slow) Babel transpilation.

UI test use Cucumber-Electron running in the same process as the server, so no Webpack is needed for tests.

Webpack is only used for production.

TODO: Write a decent webpack middleware