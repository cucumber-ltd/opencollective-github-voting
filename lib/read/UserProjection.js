module.exports = class UserProjector {
  onAccountCreatedEvent(event) {
    console.log(event)
  }

  onAccountCreditedEvent(event) {
    console.log(event)
  }

  onAccountDebitedEvent(event) {
    console.log(event)
  }
}