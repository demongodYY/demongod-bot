# 用Node.js开发

## 关键概念

## 对话

### 对话概念

................

### 定义会话的步骤

​	一个会话是用户与机器人的一系列信息交互。当需要机器人对象去引导用户进行一系列步骤，你可以用瀑布流来定义会话中的步骤。

​	瀑布流是对话的一个特定执行方式，它通常用于收集用户的信息或者指引用户完成一系列任务。这些任务是通过一个函数数组来执行的，前一个函数的结果将作为下一个函数的输入，以此类推。每个函数一般代表整个任务中的一个步骤。在每一步中，机器人提示用户进行输入，等待获取的响应，并将其传给下一步。

​	这一章将会帮助你了解瀑布流的工作方式，并且让你了解如何运用它去管理会话流。

#### **会话步骤**

​	一个会话通常包括一些在用户与机器人之间的提示/响应交互，每个提示/响应交互都是会话中的一步。你最少可以用2步的瀑布流来创建一个会话。

​	用以下`greetings`这个对话来举例，瀑布流的第一步提示用户输入名字，第二步则使用用户的名字来回复了一个问候语。
```javascript
bot.dialog('greetings', [
    // Step 1
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    // Step 2
    function (session, results) {
        session.endDialog(`Hello ${results.response}!`);
    }
]);
```
​	使用提示使这成为了可能，Bot Builder SDK for Node.js 提供了一些内置的提示，你可以用此来询问用户的各种信息。

​	下面的示例代码通过一个4步的瀑布流，展示了一个运用提示来收集用户的各种信息的对话。

```javascript
// This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to the dinner reservation.");
        builder.Prompts.time(session, "Please provide a reservation date and time (e.g.: June 6th at 5pm)");
    },
    function (session, results) {
        session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.text(session, "How many people are in your party?");
    },
    function (session, results) {
        session.dialogData.partySize = results.response;
        builder.Prompts.text(session, "Who's name will this reservation be under?");
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;

        // Process request and display reservation details
        session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
        session.endDialog();
    }
]);
```

​	在这个例子中，默认对话拥有4个函数，每一个函数都代表了瀑布流中的一步。每一步都提示用户进行输入，并且将结果传输给下一步执行。这个过程会持续进行直到执行到最后一步，从而确认`dinner reservation`并结束对话。

​	下面的截图展示了上面代码在 [Bot Framework Emulator](https://docs.microsoft.com/en-us/bot-framework/debug-bots-emulator) 中的运行效果。

![Manage conversation flow with waterfall](https://docs.microsoft.com/en-us/bot-framework/media/bot-builder-nodejs-dialog-manage-conversation/waterfall-results.png)

#### **用多个瀑布流来创建会话**

​	你可以按照你的机器人的需求，运用多个瀑布流来自定义一个会话结构。举个例子，你可以用一个瀑布流来管理会话流程，然后添加一个瀑布流来收集用户的信息。每个瀑布流都是封装在对话里，并且可以通过`session.beginDialog`函数来调用。

​	下面的代码示例展示了如何在一个会话里运用多个瀑布流。在`greetings`对话中的瀑布流管理会话的进程，而在`askName`对话中的瀑布流来收集用户的信息。

```javascript
bot.dialog('greetings', [
    function (session) {
        session.beginDialog('askName');
    },
    function (session, results) {
        session.endDialog('Hello %s!', results.response);
    }
]);
bot.dialog('askName', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
```

#### **进行瀑布流**

​	一个瀑布流中的步骤序列是由一个函数数组来定义的。瀑布流中的第一个函数可以接受对话传过来的参数。瀑布流中每一个函数都可以用`next`函数来执行下一步，而不用提示用户进行输入。

​	下面的代码片段展示了如何使用对话中的`next`函数来引导用户提供信息以完成其配置文件。在瀑布流中的每一步，机器人提示用户输入一部分信息（如果需要），并且用户（如果有）的回复会在下一步中处理。在`ensureProfile`对话中的最后一步会结束这个对话，并返回完整的配置信息给用于给用户发送信息的上层对话。

```javascript
// This bot ensures user's profile is up to date.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.beginDialog('ensureProfile', session.userData.profile);
    },
    function (session, results) {
        session.userData.profile = results.response; // Save user profile.
        session.send(`Hello ${session.userData.profile.name}! I love ${session.userData.profile.company}!`);
    }
]);
bot.dialog('ensureProfile', [
    function (session, args, next) {
        session.dialogData.profile = args || {}; // Set the profile or create the object.
        if (!session.dialogData.profile.name) {
            builder.Prompts.text(session, "What's your name?");
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function (session, results, next) {
        if (results.response) {
            // Save user's name if we asked for it.
            session.dialogData.profile.name = results.response;
        }
        if (!session.dialogData.profile.company) {
            builder.Prompts.text(session, "What company do you work for?");
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function (session, results) {
        if (results.response) {
            // Save company name if we asked for it.
            session.dialogData.profile.company = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);
```

#### **结束瀑布流**

​	用瀑布流创建的对话必须显式标明结尾，不然机器人会无限循环这个瀑布流。你可以用以下任一种方法结束瀑布流：	

- `session.endDialog` :使用此方法结束瀑布流，不会返回数据给上层对话。

- `sessio.endDialogWithResult`: 如果需要返回数据给上层对话，使用此方法。`response` 参数可以是一个 JSON 对象或者任何 JavaScript 的原始数据类型。举例来说：

```javascript
  session.endDialogWithResult({
    response: { name: session.dialogData.name, company: session.dialogData.company }
  });
```

- `session.endConversation` 当需要结束整个会话的时候，使用此方法。

  ​

  除此以外，你还可以给对话连接`endConversationAction`开关来结束瀑布流。举例来说:

  ```javascript
  bot.dialog('dinnerOrder', [
      //...waterfall steps...,
      // Last step
      function(session, results){
          if(results.response){
              session.dialogData.room = results.response;
              var msg = `Thank you. Your order will be delivered to room #${session.dialogData.room}`;
              session.endConversation(msg);
          }
      }
  ])
  .endConversationAction(
      "endOrderDinner", "Ok. Goodbye.",
      {
          matches: /^cancel$|^goodbye$/i,
          confirmPrompt: "This will cancel your order. Are you sure?"
      }
  );
  ```

#### **下一步**

  使用瀑布流，你可以利用提示来收集用户信息。接下来让我们来接着了解如何使用提示来使用户进行输入。

### 提示用户进行输入






