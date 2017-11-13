const Event = require('../infrastructure/Event')

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