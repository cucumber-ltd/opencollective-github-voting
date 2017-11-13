module.exports = class UserProjection {
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