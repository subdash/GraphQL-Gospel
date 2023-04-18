# GraphQL-Gospel

```
 __
/_/\/\
\_\  /
/_/  \
\_\/\ \
   \_\/
```

This is an Apollo GraphQL Server that provides a GraphQL interface to the [ESV API](https://api.esv.org/),
which itself is an API interface over the bible.

Here I've leveraged TypeScript and Apollo's code-generation tools to generate TypeScript resolver classes based off my schema.

Currently there is only one query, which is `gospel`, allowing you to fetch a single verse from the Gospel of Jesus Christ.
![ss1](https://user-images.githubusercontent.com/40185584/232886769-f89e80a0-857c-4b04-80c3-756d0a736822.png)
