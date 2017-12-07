# PubSub

Simple implementation of Publish-Subscribe. The API for subscription is simple:

```javascript
await pubSub.subscribe('some-signal', async () => {
  console.log('received some-signal')
})
```

The API for publishing too:

```javascript
pubSub.publish('some-signal')
await pubSub.flush()
```

This is similar to Node's `EventEmitter`, but there are some subtle differences:

* Deferred/Scheduled publishing
* Asynchronous subscription and publishing (using `Promise`)

This has several benefits for testing.

## Deferred/Scheduled publishing

When a publisher wants to publish something, they call `publish`. This schedules the signal for delivery
to subscribers, but it doesn't deliver them (yet).

Scheduled signals are only delivered after calling `flush`.

So what's the point in that? It simplifies testing.

When a test wants to make an assertion that a certain message was published, they can do that after the message has
been scheduled for delivery:

```
// When

doSomethingThatPublishes(pubSub)

// Then

const subscription = await pubSub.subscribe('some-signal', async () => {
  console.log('received some-signal')
})
await pubSub.flush()
await subscription.delivered(1)
```

## Asynchronous subscription and publishing


Because the API is asynchronous, it can be implemented to use networking. This library has two implementations (and more can be added easily):

* `PubSub`
* `EventSourceSub`

A web application would typically use `EventSourceSub`, but during testing it can be assembled to use
the in-memory `PubSub` for faster tests.