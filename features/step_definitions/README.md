# Step Definition conventions

Step definitions follow strict guidelines inspired by:

* https://lizkeogh.com/2014/09/02/a-little-tense/
* https://www.youtube.com/watch?v=BCziqo1HZsE
  * f(event history, command) -> new events # Can be fed into same function
* http://verraes.net/2014/05/functional-foundation-for-cqrs-event-sourcing/

In particular:

* `Given` steps can only store *events*
  * Informational messages
  * This is how we set up "what's happened in the past"
* `When` steps can only dispatch *commands*
  * Imperative messages
  * This is how we represent "intent"
* `Then` steps can only consult *projections* (read models)
  * Query message
  * This is the only observable outcome