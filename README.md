# OpenCollective GitHub Voting

This is a microservice for voting on GitHub issues.

People are allotted a certain number of votes based on:

* How long they have been contributing to the GitHub project
* How much they have paid to the open collective

The idea is to give financial backers and sponsors a better return on their
investment by allowing them to influence priorities of the project they
are supporting.

The idea is inspired by [WebPack's voting](https://webpack.js.org/vote/).

The application exposes a HTTP API that can be used from any web page. In more detail:

* A list of issues that can be voted on
* The number of votes that have been cast on each issue

Logged-in users have additional functionality:

* See how many votes they have left
* See their own cast votes
* Cast (or uncast) votes

Administrators can configure what GitHub issues are votable (this will probably be done by tagging issues on GitHub)

It's not a goal to update issues on GitHub - seeing what people have voted on will happen on a system
outside of GitHub.

## Software Architecture

The application is based on [Event Sourcing](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing)
and [CQRS](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs).

The software components are decoupled using the [Hexagonal Architecture](http://alistair.cockburn.us/Hexagonal+architecture)
(aka Ports and Adapters) pattern.

The tests are inspired by [todo-subsecond](https://github.com/subsecondtdd/todo-subsecond), a small application
that introduces some conventions for running the same tests in different configurations, taking advantage of
ports and adapters.

## Domain model

Voting is similar to banking. Casting a vote is similar to transferring money from one account (the user)
to another account (the issue). The only difference is that we're transferring votes, not money.

Both issues and users are modelled as `Account`s. Voting is modelled as `Transaction`s.

## TODO

* [ ] Plug assemblies directly into each other, like hexagonal legos.
* [x] Delegate assemblies (no inheritance)
* [x] Rename pubsub to sigsub everywhere
* [ ] Group code+tests by concept rather than technicalities
* [ ] Add back UnitOfWork (but only expose add method)
* [x] Create a HTTP adapter
* [x] UI
  * [ ] Styling
  * [ ] Autoreload
    * [ ] Webpack middleware
    * [ ] Reload page on change
* [ ] GitHub OAuth
  * Use a separate route
* [ ] Access Control
* [ ] Account imports
  * [ ] OpenCollective donations
    * [x] Importer
    * [ ] Batch job/fetcher
  * [ ] GitHub activity
    * [ ] Importer (trigger on first login)
    * [ ] Batch job/fetcher
  * Transfer job (USD-> votes, GitHub activity -> votes)
* [ ] Link imported accounts to logged in user
* [ ] Persist events
* [ ] Replay events on startup