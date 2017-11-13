const Event = require('../cqrs-lite/Event')

class AccountCreatedEvent extends Event {
}

class AccountCreditedEvent extends Event {
}

class AccountDebitedEvent extends Event {
}

module.exports = {
  AccountCreatedEvent,
  AccountCreditedEvent,
  AccountDebitedEvent
}