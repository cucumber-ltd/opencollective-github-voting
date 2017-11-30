const Event = require('../cqrs-lite/Event')

class AccountAssignedToUserEvent extends Event {
}

class AccountCreatedEvent extends Event {
}

class AccountCreditedEvent extends Event {
}

class AccountDebitedEvent extends Event {
}

class UserCreatedEvent extends Event {
}

module.exports = {
  AccountAssignedToUserEvent,
  AccountCreatedEvent,
  AccountCreditedEvent,
  AccountDebitedEvent,
  UserCreatedEvent,
}