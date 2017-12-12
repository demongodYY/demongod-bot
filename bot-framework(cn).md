# 用Node.js开发

## 关键概念

### Node.js 版机器人 SDK 的关键概念

​	这一节概述了Node.js版机器人SDK的关键概念。关于机器人框架的概述，请看 **机器人框架概述**

#### 连接器

​	机器人框架连接器是一个连接你的机器人到各类频道的服务，比如说 Skype, Facebook, Slack, SMS 等。连接器中继频道与机器人之间的消息，来使用户方便的于机器人交流。你的机器人逻辑托管在一个Web服务商，通过连接器的服务来接收用户的消息，而你的机器人的回复是通过 HTTP POST 发送给连接器的。

​	Node.js版的SDK提供了 `UniversalBot` 和 `ChatConnector` 类来配置机器人，使其通过机器人框架连接器来收发消息。`UniversalBot` 类形成了你的机器人的大脑。它主管你的机器人对用户所有的会话。`ChatConnector` 类连接你的机器人到机器人框架连接器服务。关于演示这些类的例子，请看  [Create a bot with the Bot Builder SDK for Node.js](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-quickstart)

​	连接器也规范机器人给频道发送的消息，这样你就可以在各类平台上开发你的机器人。规范消息包括将机器人框架的模式转换成频道的模式。在频道不支持框架所有的模式的情况下，连接器会试图将消息装换成频道支持的格式。举个例子，如果机器人发送了一个包括拥有动作按钮的卡片给 SMS 频道，连接器可能会将这个卡片渲染成一个图片与包括动作连接的文本消息。**频道检测器** 是一个告诉你连接器在不同频道上如何渲染消息的 Web 工具。

​	`ChatConnector` 需要在你的机器人中设置一个 API 端点。在 Node.js SDK 中，这通常是由 安装 `restify` Node 模块来完成的。机器人也可以通过 `ConsoleConnector` 来构建命令行模式，而不需要 API 端点。

#### 消息

​	消息可以由文字，语音，附件，富文本卡片或者支持的操作来组成。你可以使用 `session.send` 方法来发送用于响应用户的消息。你的机器人可以会根据用户的消息，多次调用 `send` 方法来响应。关于这个的例子，请看 [Respond to user messages](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-use-default-message-handler).

​	关于发送包括交互式按钮的富文本卡片的例子，请看 [Add rich cards to messages](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-rich-cards)。关于如何收发附件的例子，请看  [Send attachments](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-receive-attachments)  。关于如何发送语音，请看 [Add speech to messages](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-text-to-speech). 关于如何发送能被支持的动作，请看 [Send suggested actions](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-suggested-actions).

#### 对话框

​	对话框帮助你在你的机器人中组织会话逻辑，同时它也是**设计会话流程** 的基础。关于对话框的介绍，请看[Manage a conversation with dialogs](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-manage-conversation).

#### 动作

​	你设计的机器人会需要处理中断，比如说在对话中随时会发出的退出或者帮助请求。Node.js机器人SDK提供了全局消息处理用来触发类似退出或者调用其他对话框的动作。请看   [Handle user actions](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-actions)  里的关于如何使用  [triggerAction](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.dialog.html#triggeraction) 的例子。

#### 识别器

​	当用户问你的机器人一些问题，比如说 "help" 或者 "find news" ， 你的机器人需要懂得用户正在问什么，然后进行适当的动作。你可以设计你的机器人识别用户输入的意图，并且关联对应的动作。

​	你可以使用 Bot Builder SDK 提供的内置正则表达式，或者使用类似 LUIS API 这类的外部服务，又或者实现一个自定义的识别器来判断用户的意图。关于如何在你的机器人中添加识别器，并且用他们来触发动作的例子，请看 [Recognize user intent](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-messages) 。

#### 存储状态

​	好的机器人设计的关键是跟踪会话的上下文，这样你的机器人可以记住类似用户最后一个问题的事情。使用Bot Builder SDK构建的机器人被设计为无状态的，因此可以轻松地将它们扩展，以便于在多个计算节点上运行。机器人框架提供了一个存储系统存储机器人的数据，所以机器人的网页服务可以被扩展。因此，你通常应当避免使用全局变量或者闭包来存储状态，这样会在你对机器人进行扩展时产生问题。用于替代的，你的机器人的 `session` 下的属性来存储相关数据到你的用户或者会话：

- **userData** 存储了用户在所有会话的全局信息。
- **conversationData** 存储一个会话的全局信息。这个数据在会话中对每个人可见，所以讲数据存储到这个属性时需要谨慎。它默认是开启的，你可以使用  [persistConversationData](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.iuniversalbotsettings.html#persistconversationdata) 操作来关闭它
- **privateConversationData** 存储了一个对话的全局信息，但是它是针对当前用户的私有数据。这个数据包括了所有对话框，所以它在会话结束时存储临时状态非常有用。
- **dialogData** 保存单个对话框实例的信息。这个属性在对话框瀑布流的步骤之间存储临时信息是非常必需的。

  ​关于如何使用这些属性存储或者取用数据，请看 [Manage state data](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-state).

#### 自然语言理解

​	Bot Builder 让你使用 LUIS 中的 [LuisRecognizer](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.luisrecognizer)  类来在你的机器人中添加自然语言理解。你可以添加 `LuisRecoGnizer` 实例，引用你的发布语言的模型，用于响应用户的话语。请看下面 LUIS 动作的10分钟教程：

- [Microsoft LUIS Tutorial](https://vimeo.com/145499419) (视频)

## 对话

### 对话概述

​	在Node.js版机器人SDK中的 **对话** 允许你设计并且管理一个会话流。机器人和用户之间的沟通是通过会话来进行的。会话由一些对话框组成。对话框可以包含瀑布流的步骤，以及提示。当用户和机器人交互的时候，机器人会开始，停止，或者响应用户的消息在不同的对话框之间切换。理解对话框是如何工作的是成功设计和创建一个好机器人的关键

​	这个章节概括了对话框的概念。在读过这章之后，后面的 *下一步* 链接会让你更深入的理解这些概念。

#### 通过对话框进行会话

​	Node.js版的SDK通过一个或多个对话框来定义一个会话，用于机器人和用户之间的交流。一个对话框，在最基本的层面上，它是一个可重复使用的，用于执行操作或收集用户信息的模块。你可以在你的机器人的可复用的对话框代码里封装复杂的逻辑。

​	一个会话可以由许多方法构建或者改变：

- 它可以开始于你的默认对话框
- 它可以从一个对话框重定向至另外一个
- 它可以被恢复
- 它可以遵循一个瀑布流模型，用来指导用户通过一系列的步骤或者提示用户回答一系列问题
- 它可以使用动作来监听一些关键词或短语来触发不同的对话框

  ​你可以认为一个会话是对话框的父。像这样，一个会话包含一个对话框栈并维护自己的一组状态数据； 也就是`conversationData` 和 `priateConversationData` 。另一方面，一个对话框维护着 `dialogData` 。关于状态信息的更多细节，请看 *管理状态数据*  一章。

#### 对话框栈

​	一个机器人和用户的交回是通过一系列在对话框栈中维护的对话框来进行的。对话框在会话过程中被压入或弹出对话框栈。对话框栈和普通的 LIFO 堆栈的工作方式类似；也就是说，最后加入的对话框会最新被完成。当一个对话框完成的时候，控制就会返回对战上的前一个对话框。

​	当一个机器人会话开始或者结束的时候，对话框栈是空的。在这个时候，当用户输入一个消息给机器人，机器人会用 *默认对话框* 进行响应。

#### 默认对话框

​	在 Bot Framework version 3.5 以前，一个根对话框通过添加一个命为 `/` 的对话框来定义，这样的命名和URL更为接近。这个命名的会话不适合命名对话框。

​	从3.5版本开始，默认对话框的注册使用了一个2个参数的构造函数 `UniversalBot` 

​	下面的代码片段展示了如何在创建一个 `UniversalBot` 对象的时候定义一个默认对话框。

```javascript
var bot = new builder.UniversalBot(connector, [
    //...Default dialog waterfall steps...
    ]);
```

​	默认对话框在对话框栈为空并且没有其他对话框被触发的时候运行。默认对话框作为给用户的第一个回应，应当提供一些上下文信息给用户，比如说可用的命令列表或者机器人的概述。

#### 对话框处理

​	对话框处理管理了会话的流程。对话框操作通过开始和结束对话框来改变流程，用于推动会话的流程。

#### 开始和结束对话框

​	开始一个对话框（并且将它压入栈中），使用 `session.beginDialog()` 。结束一个对话框（并将它从栈中移除，回到上一层对话框），使用 `session.endDialog()` 或者 `session.endDialogWithResult()` 

#### 使用瀑布流和提示

​	瀑布流是一个简单的设计和管理会话流的方式。一个瀑布流包括一些序列步骤。在每一步中，你可以完成一个动作或提示用户输入信息。

​	一个瀑布流通过一组函数实现的对话框来实现的。每一个函数定义了瀑布流中的一个步骤。下面的代码例子展示了一个简单的会话，使用了一个2步的瀑布流来提示用户输入他们的名字并且用名字来进行问候 。

```javascript
// Ask the user for their name and greet them by name.
bot.dialog('greetings', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.endDialog(`Hello ${results.response}!`);
    }
]);
```

​	当一个机器人到达瀑布流的最后，却没有结束对话框，用户的下一条信息将会重新开始瀑布流中第一步的对话框，这将会让用户觉得他们掉进了一个循环里。为了避免这种现象，当会话或者对话框结束的时候，明确地调用 `endDialog`, `endDialogWithResult` 或者 `endConversation` 会是最佳实践。

#### 下一步

​	想要对对话框了解的更深，重要的是理解瀑布流模式是如何工作的以及如何使用它知道用户进行操作。

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

​	使用瀑布流，你可以利用提示来收集用户信息。接下来让我们来接着了解如何使用提示来使用户进行输入。

### 提示用户进行输入

​	Node.js版的Bot Builder SDK提供了一套内置提示用于便捷地收集用户的输入。

​	每当机器人需要用户的输入的时候，就可以使用提示。你可以通过对用户提一系列问题使用户回答的方式来连接瀑布流中的提示。你也可以使用提示与瀑布流一起来管理你的机器人的会话流程。

​	这一章会帮助你提示是如何工作的，并且让你知道如何运用提示来收集用户的信息。

#### **提示和回复**

​	每当你需要用户的输入，你就可以发一个提示，等待用户的回复，然后处理这个输入，并给用户反馈。

​	下面这个代码例子提示用户输入名字，并且发送一个欢迎信息：

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

​	使用这个基本的结构，你可以添加更多的提示提示和反馈来模拟你的机器人的会话流程。

#### 提示结果

​	内置提示由对话执行，然后在`results.response`里返回用户的回复。在`results.response.entity`里，回复会返回成JSON对象。任何种类的对话句柄都可以接收提示返回的结果。当机器人接收了回复，它可以处理它或者通过`session.endDialogWithResult`方法将其传会给上层对话。

​	下面的代码例子展示了如何通过`session.endDialogWithResult`方法讲提示收到的结果返回给上层对话。在这个例子中，`greetings`对话使用了`askName`对话返回的提示结果，用于给用户个性的欢迎词。

```javascript
// Ask the user for their name and greet them by name.
bot.dialog('greetings', [
    function (session) {
        session.beginDialog('askName');
    },
    function (session, results) {
        session.endDialog(`Hello ${results.response}!`);
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

**提示类型**

​	Node.js 下的 Bot Builder SDK 包括了一些不同类型的内置提示。

| **Prompt type**                          | **Description**                          |
| ---------------------------------------- | ---------------------------------------- |
| [Prompts.text](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-prompt#promptstext) | Asks the user to enter a string of text. |
| [Prompts.confirm](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-prompt#promptsconfirm) | Asks the user to confirm an action.      |
| [Prompts.number](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-prompt#promptsnumber) | Asks the user to enter a number.         |
| [Prompts.time](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-prompt#promptstime) | Asks the user for a time or date/time.   |
| [Prompts.choice](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-prompt#promptschoice) | Asks the user to choose from a list of options. |
| [Prompts.attachment](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-prompt#promptsattachment) | Asks the user to upload a picture or video. |

​	接下来会对每一个类型的提示进行详细介绍。

##### Prompts.text

​	`Prompts.text()`方法用于要求用户输入一个字符串文本。这个提示返回`IPromptTextResult`格式下的用户回复。

```javascript
builder.Prompts.text(session, "What is your name?");
```

##### Prompts.confirm

​	使用`Prompts.confirm()`方法提示用户回复yes/no 来确认一个动作。这个提示返回`IPromptConfirmResult`用户回复

```javascript
builder.Prompts.confirm(session, "Are you sure you wish to cancel your order?");
```



##### Prompts.number

​	使用`Prompts.number()`方法提示用户回复一个数字,这个提示返回`IPromptNumberResult`用户回复。

```javascript
builder.Prompts.number(session, "How many would you like to order?");
```

##### Prompts.time

​	使用`Prompts.time()` 方法要求用户输入 time  或者 date/time  格式的输入。这个提示会发回`IpromptTimeResult` 格式的用户回复。框架使用  [Chrono](https://github.com/wanasit/chrono) 库来解析用户的回复，并且支持相对时间（比如："in 5 minutes"）或绝对时间 （比如 ："June 6th at 2pm"）。

​	`results.response` 代表用户的回复，包含了一个说明日期和时间的`entity` 对象。要讲这个对象解析到Javascript 的`Date` 对象里，需要使用`EntityRecognizer.resolveTime()` 方法。

```javascript
bot.dialog('createAlarm', [
    function (session) {
        session.dialogData.alarm = {};
        builder.Prompts.text(session, "What would you like to name this alarm?");
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.name = results.response;
            builder.Prompts.time(session, "What time would you like to set an alarm for?");
        } else {
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.time = builder.EntityRecognizer.resolveTime([results.response]);
        }

        // Return alarm to caller  
        if (session.dialogData.name && session.dialogData.time) {
            session.endDialogWithResult({ 
                response: { name: session.dialogData.name, time: session.dialogData.time } 
            }); 
        } else {
            session.endDialogWithResult({
                resumed: builder.ResumeReason.notCompleted
            });
        }
    }
]);
```



##### Prompts.choice

​	使用`Prompts.choice` 方法要求用户在一个列表中进行选择。用户可以通过输入选项的序号或者名字来进行选择。支持对选项名的全局匹配或局部匹配。返回一个`IPromptsChoiceResult` 结构的用户回复。

​	可以通过对`IpromptOptions.listStyle` 的设置，来指定列表呈现给用户的样式，下面的表格说明了`listStyle` 属性的枚举值：

| Index | Name   | Description                              |
| ----- | ------ | ---------------------------------------- |
| 0     | none   | No list is rendered. This is used when the list is included as part of the prompt. |
| 1     | inline | Choices are rendered as an inline list of the form "1. red, 2. green, or 3. blue". |
| 2     | list   | Choices are rendered as a numbered list. |
| 3     | button | Choices are rendered as buttons for channels that support buttons. For other channels they will be rendered as text. |
| 4     | auto   | The style is selected automatically based on the channel and number of options. |

​	你可以通过	`builder` 对象来访问这个枚举值，或者可以通过提供索引值来选择`listStyle`。下面例子中的两句代码完成了同样的事情。

```javascript
// ListStyle passed in as Enum
builder.Prompts.choice(session, "Which color?", "red|green|blue", { listStyle: builder.ListStyle.button });

// ListStyle passed in as index
builder.Prompts.choice(session, "Which color?", "red|green|blue", { listStyle: 3 });
```

​	通过竖线分隔符`|` 分开的字符串，字符串数组，或者 map 对象来指定选项：

```javascript
builder.Prompts.choice(session, "Which color?", "red|green|blue");
```

```javascript
builder.Prompts.choice(session, "Which color?", ["red","green","blue"]);
```

```javascript
var salesData = {
    "west": {
        units: 200,
        total: "$6,000"
    },
    "central": {
        units: 100,
        total: "$3,000"
    },
    "east": {
        units: 300,
        total: "$9,000"
    }
};

bot.dialog('getSalesData', [
    function (session) {
        builder.Prompts.choice(session, "Which region would you like sales for?", salesData); 
    },
    function (session, results) {
        if (results.response) {
            var region = salesData[results.response.entity];
            session.send(`We sold ${region.units} units for a total of ${region.total}.`); 
        } else {
            session.send("OK");
        }
    }
]);
```

 

##### Prompts.attachment

​	使用`prompts.attachment` 方法要求用户上传类似图像、视频等文件。这个方法返回`IPromptAttachmentResult` 的用户回复。

```javascript
builder.Prompts.attachment(session, "Upload a picture for me to transform.");
```



#### **下一步**

​	现在你已经能通过瀑布流和提示引导用户提供信息了，接下来让我们看看怎么更好的管理你的回话流

### 管理会话流

​	管理会话流是创建机器人的必要步骤。一个机器人应当能够优雅地进行任务并且处理中断。通过 Node.js 下的 Bot Builder SDK ，你可以通过对话来管理会话流。

​	一个对话相当于程序的一个函数，它通常设计用于执行某些特定的操作，并在需要的时候被调用。你可以链接起多个对话用来在机器人中操作会话流。Node.js 下的 Bot Builder SDK 内置了类似 `prompts` （提示）和 ` waterfalls`（瀑布流） 等功能来帮助你管理会话流。

​	这一章提供了一系列例子来解释怎样通过对话，来管理简单或者是可以优雅地响应中断的会话流。这些例子基于以下的场景：

1. 一个可以预订晚餐的机器人。
2. 这个机器人在预定的过程中可以随时处理 “Help” 指令。
3. 机器人可以通过上下文识别这个 "Help" 是在预订过程中的哪一步。
4. 机器人可以进行各种主题的会话。

#### **通过瀑布流来管理会话流**

​	瀑布流是一个允许机器人简单处理一系列任务的对话框。在这个例子中，预订机器人询问了用户一些列问题，以便机器人处理预订的请求。机器人会提示用户输入以下信息：

1. 预定日期/时间

2. 聚会的人数

3. 预订者的名字

   下面的代码展示了如何运用瀑布流来知道用户通过一系列提示来输入信息：

```javascript
// This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to the dinner reservation.");
        builder.Prompts.time(session, "Please provide a reservation date and time (e.g.: June 6th at 5pm)");
    },
    function (session, results) {
        session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.number(session, "How many people are in your party?");
    },
    function (session, results) {
        session.dialogData.partySize = results.response;
        builder.Prompts.text(session, "Whose name will this reservation be under?");
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;

        // Process request and display reservation details
        session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
        session.endDialog();
    }
```

​	这个机器人的核心功能在默认对话框中。默认对话框在机器人创建时定义：

```javascript
var bot = new builder.UniversalBot(connector, [..waterfall steps..]); 
```

​	默认对话框通过函数数组来创建瀑布流中的步骤。在这个例子中，4个函数代表了瀑布流中的4个步骤。每一步都执行了一个任务，并且将结果传递给下一步执行。程序会一直执行到最后一步，确认预订并结束对话框。

​	下面的截图展示了以上代码在  [Bot Framework Emulator](https://docs.microsoft.com/en-us/bot-framework/debug-bots-emulator) 中运行的结果

![Manage conversation flow with waterfall](https://docs.microsoft.com/en-us/bot-framework/media/bot-builder-nodejs-dialog-manage-conversation/waterfall-results.png)

#### **提示用户进行输入**

​	在这个例子中，每一步都使用了提示来引导用户进行输入。一个提示是一个特定的对话框来引导用户进行输入，并将用户的回复传递给瀑布流的下一步。有关提示的信息可以看之前的章节。

​	在这个例子中，机器人用`Prompts.text()` 来征求用户输入一个随意的文本回复。用户可以回复任何文本，然后机器人来处理这个回复。`Prompts.time()` 方法使用了 [Chrono](https://github.com/wanasit/chrono) 库来从字符串中解析日期和时间信息，使得你的机器人可以懂得一些特定格式的日期/时间的语言。比如说："June 6th, 2017 at 9pm", "Today at 7:30pm", "next monday at 6pm", 等等。

#### **用多个对话框来管理会话流**

​	另一种管理会话流的方式，是运用多个对话框的组合瀑布流。瀑布流允许你链接多个对话框在一起，而对话框允许你中断会话流程而进入一小段可以重复调用的功能。

​	就订餐机器人来举例，下面的代码例子展示了如何用多对话框瀑布流来重写之前的例子：

```javascript
// This is a dinner reservation bot that uses multiple dialogs to prompt users for input.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Welcome to the dinner reservation.");
        session.beginDialog('askForDateTime');
    },
    function (session, results) {
        session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
        session.beginDialog('askForPartySize');
    },
    function (session, results) {
        session.dialogData.partySize = results.response;
        session.beginDialog('askForReserverName');
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;

        // Process request and display reservation details
        session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
        session.endDialog();
    }
]);

// Dialog to ask for a date and time
bot.dialog('askForDateTime', [
    function (session) {
        builder.Prompts.time(session, "Please provide a reservation date and time (e.g.: June 6th at 5pm)");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

// Dialog to ask for number of people in the party
bot.dialog('askForPartySize', [
    function (session) {
        builder.Prompts.text(session, "How many people are in your party?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
])

// Dialog to ask for the reservation name.
bot.dialog('askForReserverName', [
    function (session) {
        builder.Prompts.text(session, "Who's name will this reservation be under?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
```

​	这个机器人的执行结果和之前的单瀑布流的机器人是一样的。然而，从编程的角度来说，主要有2个方面的不同：

1. 默认对话框专门用来管理会话流

2. 任务的每一步都用专门的对话框来管理。在这个例子中，机器人需要获取3方面的信息，所以提示了用户3次，而每个提示是组成了自己的对话框。

   使用这个技术，你可以用任务逻辑来解耦会话流。这样可以似的对话框可以在不同的对话流中重复运用。

#### **响应用户输入**

​	在引导用户进行一系列任务的时候，如果用户在回答之前提出问题或者想要更多的信息，你该怎么处理这些请求呢？

​	举例来说，无论用户在进行会话的什么时候，机器人该如何相应当用户提出了类似 “Help”, "Support" 或者 “Cancel” 这一类的输入呢？如果用户想要当前步骤更多的信息呢？如果用户改变了主意，想中止当前会话，而开始另外一个会话呢？

​	Node.js 下的 Bot Builder SDK 允许机器人监听全局或者当前对话框作用域下的关键输入。这些输入被称为动作，它允许机器人通过 `matches` 语句 来对其进行监听。

#####  响应全局动作

​	如果你想要你的机器人在会话的任意地方可以响应动作，使用 `triggerAction` 。触发器允许当输入匹配到特殊的项目时弹出指定的对话框。举例来说：如果你想要支持全局的 "Help" 设置，你可以创建一个 help 对话框绑定 `triggerAction` 来监听输入匹配到 “Help”。

​	以下的代码例子展示了如何在对话框中添加 `triggerAction`  来指定当用户输入 "help" 时弹出的对话框。

```javascript
// The dialog stack is cleared and this dialog is invoked when the user enters 'help'.
bot.dialog('help', function (session, args, next) {
    session.endDialog("This is a bot that can help you make a dinner reservation. <br/>Please say 'next' to continue");
})
.triggerAction({
    matches: /^help$/i,
});
```

​	默认情况下，当一个`triggerAction` 触发的时候，当前的对话框栈会被清除，并且触发的对话框会成为新的默认对话框。在这个例子里，当`triggerAction` 触发，对话框栈被清除，之后 `help` 对话框被加到栈内成为新的默认对话框。如果这不是期望的行为，你可以添加 `onSelectAction` 设置给 `triggerAction` 。`onSelectAction` 设置允许机器人在不清楚对话框栈的情况下开始一个新的对话框，是的会话可以临时的重定向，并在之后回到之前的地方。

​	以下的代码例子展示了如何使用`onSelectAction` 和 `triggerAction` 来将 `help` 对话框添加到已经存在的对话框栈中（对话框栈不会被清除）

```javascript
bot.dialog('help', function (session, args, next) {
    session.endDialog("This is a bot that can help you make a dinner reservation. <br/>Please say 'next' to continue");
})
.triggerAction({
    matches: /^help$/i,
    onSelectAction: (session, args, next) => {
        // Add the help dialog to the dialog stack 
        // (override the default behavior of replacing the stack)
        session.beginDialog(args.action, args);
    }
});
```

​	在这个例子中，`help` 对话框会在会话里响应当用户输入 "help" 的操作。因为`triggerAction` 包含了 `onSelectAction` 设置，`help` 对话框被压入了对话框栈的顶部，并且之前的对话框栈没有清除。当 `help` 对话框结束时，它会被从对话框栈中移除，并且会话会回到之前中断的地方。

##### 响应上下文动作

​	在上一个例子中，`help` 对话框在会话的任意时候都会响应用户输入的 "help"。因此，这个对话框只能提供总体的帮助，而不会针对上下文响应用户的 "help" 请求。但是，如果用户想要一个关于特定信息的帮助呢？在这一节中，`help` 必须根据当前对话框的上下文来进行响应。

​	以订餐机器人来举例，假设当用户回答机器人所询问派对的人数时，用户想知道支持的最大人数。对于这种情况，你可以添加 `beginDialogAction`  在 `askForPartySize` 对话框下，监听用户的 `help` 输入。

​	以下的代码示例展示了如何运用 `beginDialogAction`添加一个对上下文敏感的  "help"对话框。

```javascript
// Dialog to ask for number of people in the party
bot.dialog('askForPartySize', [
    function (session) {
        builder.Prompts.text(session, "How many people are in your party?");
    },
    function (session, results) {
       session.endDialogWithResult(results);
    }
])
.beginDialogAction('partySizeHelpAction', 'partySizeHelp', { matches: /^help$/i });

// Context Help dialog for party size
bot.dialog('partySizeHelp', function(session, args, next) {
    var msg = "Party size help: Our restaurant can support party sizes up to 150 members.";
    session.endDialog(msg);
})

```

​	在这个例子中，当用户输入“help”时，机器人会将 `partySizeHelp` 对话框压人栈中。这个对话框发送了帮助消息给用户并会自动结束，返回到上一级 `askForPartySize` 对话框，提示用户输入派对规模。

​	值得注意的时，这个上下文敏感的 help 消息只当用户在 `askForPartySize` 对话框中的时候执行。除此以外，来自 `triggerAction` 的通用 help 消息会替代它执行。换句话说，本地的 `match` 总是优先于全局的  `match` 。举例来说，如果`beginDialogAction` 匹配了 **help**  ,那么来自 `triggerAction` 的 **help** 就不会执行了。更多信息，请查看动作优先级的章节。

##### 改变会话的主题

​	默认情况下，执行 `triggerAction` 会清楚对话框栈并重置会话，然后打开一个特定的对话框。这个行为通常用于当你的机器人需要更换会话的主题，比如说一个用户在预定晚餐座位的过程中，决定要将预定的晚餐送到他们的房间里去。

​	下面的例子在之前的例子上进行了升级，使机器人允许用户选择预订晚餐的座位或者是预定一个外卖。在这个机器人中，默认的对话框发送的欢迎语中给了用户两个选项：`Dinner Reservation` 或 `Order Dinner` 。

```javascript
// This bot enables users to either make a dinner reservation or order dinner.
var bot = new builder.UniversalBot(connector, function(session){
    var msg = "Welcome to the reservation bot. Please say `Dinner Reservation` or `Order Dinner`";
    session.send(msg);
});
```

​	之前例子中的默认对话框里的订餐逻辑在这个例子成为了一个叫 `dinnerReservation` 的单独的对话框。`dinnerReservation` 的流程与之前所讲的多对话框的例子的版本是一致的。唯一的不同是，这个对话框添加了一个 `triggerAction` 。注意在这个版本中，`confirmPrompt` 会在弹出新对话框之前询问用户确认他们是否想改变会话的主题。像这样在场景中添加 `confirmPrompt` 是一个不错的实践，因为一旦对话框栈清空了，用户会重定向到一个新的会话主题，从而放弃之前的会话主题。

```javascript
// This dialog helps the user make a dinner reservation.
bot.dialog('dinnerReservation', [
    function (session) {
        session.send("Welcome to the dinner reservation.");
        session.beginDialog('askForDateTime');
    },
    function (session, results) {
        session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
        session.beginDialog('askForPartySize');
    },
    function (session, results) {
        session.dialogData.partySize = results.response;
        session.beginDialog('askForReserverName');
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;

        // Process request and display reservation details
        session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
        session.endDialog();
    }
])
.triggerAction({
    matches: /^dinner reservation$/i,
    confirmPrompt: "This will cancel your current request. Are you sure?"
});
```

​	第二个会话主题定义在 `orderDinner` 瀑布流会话框中。这个对话框简单的展示了菜单，并且在用户选择以后提示用户输入房间号。一个 `triggerAction` 添加在这个对话框上，当用户输入 “order dinner” 时提示用户确认他们的选择，然后改变会话的主题。

```javascript
// This dialog help the user order dinner to be delivered to their hotel room.
var dinnerMenu = {
    "Potato Salad - $5.99": {
        Description: "Potato Salad",
        Price: 5.99
    },
    "Tuna Sandwich - $6.89": {
        Description: "Tuna Sandwich",
        Price: 6.89
    },
    "Clam Chowder - $4.50":{
        Description: "Clam Chowder",
        Price: 4.50
    }
};

bot.dialog('orderDinner', [
    function(session){
        session.send("Lets order some dinner!");
        builder.Prompts.choice(session, "Dinner menu:", dinnerMenu);
    },
    function (session, results) {
        if (results.response) {
            var order = dinnerMenu[results.response.entity];
            var msg = `You ordered: ${order.Description} for a total of $${order.Price}.`;
            session.dialogData.order = order;
            session.send(msg);
            builder.Prompts.text(session, "What is your room number?");
        } 
    },
    function(session, results){
        if(results.response){
            session.dialogData.room = results.response;
            var msg = `Thank you. Your order will be delivered to room #${session.dialogData.room}`;
            session.endDialog(msg);
        }
    }
])
.triggerAction({
    matches: /^order dinner$/i,
    confirmPrompt: "This will cancel your order. Are you sure?"
});
```

​	在用户开始一个会话并选择 `Dinner Reservation` 或者 `Order Dinner` 后，他们随时还是可能会改变主意。举个例子，如果用户在预定晚餐座位的同时输入了 “order dinner” , 机器人会说：“This will cancel your current request. Are you sure？” 。如果用户回答 “no” ，那么请求就会退出，继续预定晚餐座位的流程，否则的话，机器人会清空对话框栈然后将会话重定向到 “orderDinner” 对话框。

#### 结束会话

​	在上面的例子中，对话框用 `session.endDialog` 或者 `session.endDialogWithResult` 来结束，这两种方法都会将对话框从栈中移出，并返回上一级对话框。在用户需要结束会话的时候，你应该使用 `session.endConversation` 来表明会话已经结束了。

​	`session.endConversation` 方法用于结束对话，并且可以在同时给用户发送消息。举个例子，在之前例子中的 `orderDinner` 对话框，可以用以下的代码来结束会话。

```javascript
bot.dialog('orderDinner', [
    //...waterfall steps...
    // Last step
    function(session, results){
        if(results.response){
            session.dialogData.room = results.response;
            var msg = `Thank you. Your order will be delivered to room #${session.dialogData.room}`;
            session.endConversation(msg);
        }
    }
]);
```

​	调用 `session.endConversation` 会结束会话，清空对话框栈，重置 `session.conversationData` 存储对象。关于存储的更多信息，请看**数据状态管理**一章

​	`session.endCOnversation` 逻辑应当在用户完成了机器人所设计的会话流程时调用。你也可以随时在用户输入了 "cancel" 或 "goodebye" 的时候调用 `session.endConversation` 来结束会话。简单地在对话框中添加 `endConversationAction` 触发器来监听用户的 "cancel" 或 "goodbye" 一类的话语就可以做到这点。

​	下面的代码例子展示了如何将 `endConversationAction` 添加到一个对话框里，当用户输入 "cancel" 或者 "goodebye" 时来结束对话。

```javascript
bot.dialog('dinnerOrder', [
    //...waterfall steps...
])
.endConversationAction(
    "endOrderDinner", "Ok. Goodbye.",
    {
        matches: /^cancel$|^goodbye$/i,
        confirmPrompt: "This will cancel your order. Are you sure?"
    }
);
```

​	当使用 `session.endConversation` 或者 `endConversationAction` 来结束会话，会清空对话框栈，并且强迫用户重新开始会话。你应当使用 `confirmPrompt` 来确认用户确实想这么做。

#### 下一步

​	在这一章中，你知道了使用自然顺序来管理会话的方法。但如果你想要使用循环模式在会话中重复一个对话框呢？接下来让我们看看怎样在栈中替换对话框。

### 替换对话框

​	当你需要在会话中验证用户的输入或者重复一个动作，替换对话框是非常有用的能力。使用 Node.js 版 Bot Builder SDK，你可以运用 `session.replaceDialog` 方法来替换对话框 。这个方法使你能够结束当前对话框，并用一个新的对话框代替它，而不会返回上层对话框。

#### 自定义用于输入验证的提示

​	Node.js 版的 Bot Builder SDK 包括了一些类型提示的输入验证，比如说 `Prompts.time` , `Prompts.choice` 等等。但如果你想对 `Prompts.text` 收到的文本输入进行验证，你必须创建你自己的验证逻辑和自定义的提示。

​	如果一个输入需要执行一个你定义的关键值，模式，范围，标准，你可能会需要进行输入验证。如果输入验证失败，可以运用 `session.replaceDialog` ,让机器人可以提示用户重新进行输入。

​	下面的代码例子展示了如何创建一个自定义的提示用于验证用户输入的电话号码。

```javascript
// This dialog prompts the user for a phone number. 
// It will re-prompt the user if the input does not match a pattern for phone number.
bot.dialog('phonePrompt', [
    function (session, args) {
        if (args && args.reprompt) {
            builder.Prompts.text(session, "Enter the number using a format of either: '(555) 123-4567' or '555-123-4567' or '5551234567'")
        } else {
            builder.Prompts.text(session, "What's your phone number?");
        }
    },
    function (session, results) {
        var matched = results.response.match(/\d+/g);
        var number = matched ? matched.join('') : '';
        if (number.length == 10 || number.length == 11) {
            session.userData.phoneNumber = number; // Save the number.
            session.endDialogWithResult({ response: number });
        } else {
            // Repeat the dialog
            session.replaceDialog('phonePrompt', { reprompt: true });
        }
    }
]);
```

​	在这个例子中，一开始提示用户输入他们的电话号码。验证逻辑使用了一个正则表达是来匹配用户输入的是数字范围。如果输入包括 10 或者 11个数字，这个数字就会在回复里返回。否则的话，`session.replaceDialog` 方法将被执行用来替代 `phonePrompt` 对话框，提示用户重新输入，并给用户提供了关于格式的指导。

​	当你调用 `session.replaceDialog` 方法，你需要指定对话框的名字和一个参数列表。在这个例子里，参数列表包括了 `{ reprompt: true }` ，使得机器人可以根据不同的情况提供不同的消息。你还可以给你的机器人指定各种你需要的参数。

#### 重复一个动作

​	在一个会话中，你可以能需要重复一个对话框多次以便用户完成某项任务。举个例子，如果你的机器人提供了一种服务，你可能在一开始展示服务的菜单，让用户通过请求的服务，然后再次显示这个菜单，以便用户可以请求另外一个服务。为了达成这样的效果，你可以在使用 `session.endConversation` 方法结束会话之前，使用 `session.replaceDialog` 方法来再次显示服务菜单。

​	下面的例子展示了如何运用 `session.replaceDialog` 方法来实现场景的类型。首先，定义一个服务的菜单：

```javascript
// Main menu
var menuItems = { 
    "Order dinner": {
        item: "orderDinner"
    },
    "Dinner reservation": {
        item: "dinnerReservation"
    },
    "Schedule shuttle": {
        item: "scheduleShuttle"
    },
    "Request wake-up call": {
        item: "wakeupCall"
    },
}
```

​	`mainMenu` 对话框被默认对话框唤醒，所以菜单将会在会话中首先显示。另外，一个  `triggerAction` 被附加在 `mainMenu` 上，以便于用户在随时输入 “main menu” 时显示。当用户看到菜单，并且选择了一个选项，对应的对话将被 `session.beginDialog` 方法唤醒。

```javascript
// This is a reservation bot that has a menu of offerings.
var bot = new builder.UniversalBot(connector, [
    function(session){
        session.send("Welcome to Contoso Hotel and Resort.");
        session.beginDialog("mainMenu");
    }
]);

// Display the main menu and start a new request depending on user input.
bot.dialog("mainMenu", [
    function(session){
        builder.Prompts.choice(session, "Main Menu:", menuItems);
    },
    function(session, results){
        if(results.response){
            session.beginDialog(menuItems[results.response.entity].item);
        }
    }
])
.triggerAction({
    // The user can request this at any time.
    // Once triggered, it clears the stack and prompts the main menu again.
    matches: /^main menu$/i,
    confirmPrompt: "This will cancel your request. Are you sure?"
});
```

​	在这个例子中，如果用户选择选项 1 要求预定一份送到房间的晚餐，`orderDinner` 对话框将会被唤醒，以便于用户预定晚餐。在这个流程的最后，机器人会确认这份订单，并使用 `session.replaceDialog` 方法再次显示主菜单。

```javascript
// Menu: "Order dinner"
// This dialog allows user to order dinner to be delivered to their hotel room.
bot.dialog('orderDinner', [
    function(session){
        session.send("Lets order some dinner!");
        builder.Prompts.choice(session, "Dinner menu:", dinnerMenu);
    },
    function (session, results) {
        if (results.response) {
            var order = dinnerMenu[results.response.entity];
            var msg = `You ordered: %(Description)s for a total of $${order.Price}.`;
            session.dialogData.order = order;
            session.send(msg);
            builder.Prompts.text(session, "What is your room number?");
        } 
    },
    function(session, results){
        if(results.response){
            session.dialogData.room = results.response;
            var msg = `Thank you. Your order will be delivered to room #${results.response}.`;
            session.send(msg);
            session.replaceDialog("mainMenu"); // Display the menu again.
        }
    }
])
.reloadAction(
    "restartOrderDinner", "Ok. Let's start over.",
    {
        matches: /^start over$/i,
        confirmPrompt: "This wil cancel your order. Are you sure?"
    }
)
.cancelAction(
    "cancelOrder", "Type 'Main Menu' to continue.", 
    {
        matches: /^cancel$/i,
        confirmPrompt: "This will cancel your order. Are you sure?"
    }
);
```

​	`orderDinner` 对话框加了两个触发器，使得用户可以在预定流程中随时 “重新开始” 或者 “退出”。

​	第一个触发器是 `reloadAction` ，允许用户在输入 “start over” 的时候重新开始预订的流程。当触发器匹配到 “start over” 输入，`reloadAction` 将从头开始对话框。

​	第二个触发器是 `cancelAction` ，允许用户在输入 “cancel” 的时候终止预定流程。这个触发器不会自动再次显示主菜单，但是可以发送一个 "Type Main Menu to continue" 消息给用户，提示用户进行下一步。

#### 对话框循环

​	在上面的例子里，用户只能在订单里选择一个选项。也就是说，如果用户想要从菜单里选择两个选项，他们得先完成一次预定流程，然后再为第二个选项重复一次整个流程。

​	下面的例子展示了如何通过重构将菜单分离，而改进上面的机器人。这样做可以使机器人的晚餐菜单在一个循环里重复，从而允许用户选择多个选项。

​	首先，添加一个 “Check out” 选项到菜单里。这个选项将会允许用户退出选择流程，并进行接下来的流程。

```javascript
// The dinner menu
var dinnerMenu = { 
    //...other menu items...,
    "Check out": {
        Description: "Check out",
        Price: 0 // Order total. Updated as items are added to order.
    }
};
```

​	接下来，重构预定对话框中的提示，使得机器人可以重复菜单，允许用户在他们的订单里添加多个选项。

```javascript
// Add dinner items to the list by repeating this dialog until the user says `check out`. 
bot.dialog("addDinnerItem", [
    function(session, args){
        if(args && args.reprompt){
            session.send("What else would you like to have for dinner tonight?");
        }
        else{
            // New order
            // Using the conversationData to store the orders
            session.conversationData.orders = new Array();
            session.conversationData.orders.push({ 
                Description: "Check out",
                Price: 0
            })
        }
        builder.Prompts.choice(session, "Dinner menu:", dinnerMenu);
    },
    function(session, results){
        if(results.response){
            if(results.response.entity.match(/^check out$/i)){
                session.endDialog("Checking out...");
            }
            else {
                var order = dinnerMenu[results.response.entity];
                session.conversationData.orders[0].Price += order.Price; // Add to total.
                var msg = `You ordered: ${order.Description} for a total of $${order.Price}.`;
                session.send(msg);
                session.conversationData.orders.push(order);
                session.replaceDialog("addDinnerItem", { reprompt: true }); // Repeat dinner menu
            }
        }
    }
])
.reloadAction(
    "restartOrderDinner", "Ok. Let's start over.",
    {
        matches: /^start over$/i,
        confirmPrompt: "This will cancel your order. Are you sure?"
    }
);
```

​	在这个例子中，订单存储在机器人的当前会话的数据存储中，叫做 `session.conversationData.orders` 。对于每个新订单，会重新初始化一个数组变量，而对于用户的每个选择，机器人会添加这个选项到 `orders` 数组，并且将总价添加上去。当用户完成选择，他们可以说 "check out" 继续他们订单其余的流程。

​	最后，将`orderDinner` 对话框瀑布流的第二步进行更新，来进行订单确认的流程。

```javascript
// Menu: "Order dinner"
// This dialog allows user to order dinner and have it delivered to their room.
bot.dialog('orderDinner', [
    function(session){
        session.send("Lets order some dinner!");
        session.beginDialog("addDinnerItem");
    },
    function (session, results) {
        if (results.response) {
            // Display itemize order with price total.
            for(var i = 1; i < session.conversationData.orders.length; i++){
                session.send(`You ordered: ${session.conversationData.orders[i].Description} for a total of $${session.conversationData.orders[i].Price}.`);
            }
            session.send(`Your total is: $${session.conversationData.orders[0].Price}`);

            // Continue with the check out process.
            builder.Prompts.text(session, "What is your room number?");
        } 
    },
    function(session, results){
        if(results.response){
            session.dialogData.room = results.response;
            var msg = `Thank you. Your order will be delivered to room #${results.response}`;
            session.send(msg);
            session.replaceDialog("mainMenu");
        }
    }
])
//...attached triggers...
;
```

#### 退出对话框

​	 `session.replaceDialog` 方法可以用于将当前对话框替换成一个新的，却不能用一个在栈中位于对话框下方的对话框来替代。要用不是当前的对话框来替代一个对话框，需要用 `session.cancelDialog` 方法代替。

​	`session.cancelDialog` 方法用于结束一个位于栈中任意位置的对话框，并且可以唤醒一个新的对话框。调用 `session.cancelDialog` 方法，需要指定要退出的对话框的ID，并可以提供一个其他需要唤醒对话框ID。举个例子，这个代码片段使 `orderDinner` 对话框退出，并且替代了 `mainMenu` 对话框

```javascript
session.cancelDialog('orderDinner', 'mainMenu'); 
```

​	当 `session.cancelDialog` 方法被调用，对话框栈会向后搜索，并且最近一个发生的对话框会被退出，造成那个对话框和它的子对话框会被从栈中移除。控制流程会发回上层对话框，可以通过比较 `results.resumed` 和 `ResumeReason.notCompleted` 来检测退出过程。

​	调用 `session.cancelDialog` 也可以指定对话框的ID，你可以指定一个从0开始的对话框索引值来退出，这个索引值代表了对话框在栈中的位置。举个例子，下面的代码片段终止了当前的活动对话框 （index = 0）并且开始了  `mainMenu` 对话框在原来的位置。`mainMenu` 对话框被在栈中的 0 位置唤醒，因此成为了新的默认对话框。

```javascript
session.cancelDialog(0, 'mainMenu');
```

​	考虑之前的对话框循环的例子。当用户得到选择菜单，（`addDinnerItem`）对话框是栈中的第4个对话框： `[default dialog, mainMenu, orderDinner, addDinnerItem]` 。你怎样使得用户在 `addDinnerItem` 对话框中退出他们的订单呢？如果你添加了 `cancelAction` 触发器在 `addDinnerItem` 对话框上，它只会回到上一个对话框 （`orderDinner`）, 然后从新给用户发送一个 `addDinnerItem` 对话框。

​	在这里，`session.cancelDialog` 方法将会很有用。在对话框循环的例子中，在晚餐菜单中添加明确的 “Cancel order” 选项。

 ```javascript
// The dinner menu
var dinnerMenu = { 
    //...other menu items...,
    "Check out": {
        Description: "Check out",
        Price: 0      // Order total. Updated as items are added to order.
    },
    "Cancel order": { // Cancel the order and back to Main Menu
        Description: "Cancel order",
        Price: 0
    }
};
 ```

​	然后，更新 `addDinnerItem` 对话框来检测 "cancel order"  请求。如果 “cancel” 被检测到，运用 `session.cancelDialog` 方法来退出默认对话框，并在这个位置上唤醒  `mainMenu` 对话框。

```javascript
// Add dinner items to the list by repeating this dialog until the user says `check out`. 
bot.dialog("addDinnerItem", [
    //...waterfall steps...,
    // Last step
    function(session, results){
        if(results.response){
            if(results.response.entity.match(/^check out$/i)){
                session.endDialog("Checking out...");
            }
            else if(results.response.entity.match(/^cancel/i)){
                // Cancel the order and start "mainMenu" dialog.
                session.cancelDialog(0, "mainMenu");
            }
            else {
                //...add item to list and prompt again...
                session.replaceDialog("addDinnerItem", { reprompt: true }); // Repeat dinner menu.
            }
        }
    }
])
//...attached triggers...
;
```

​	通过这样使用 `session.cancelDialog` 方法，你可以为你的机器人实现任何会话流程。

#### 下一步

​	通过替换栈中的对话框，你可以通过变化的  **动作**  来完成对话框栈。动作使你可以灵活的管理会话流程。接下来让我们仔细地了解 **actions** 使怎样更好的响应用户的操作的。

### 操作用户的动作

​	用户通常会尝试用类似 “help", "cancel", 或者 "start over" 这一类的关键词来尝试进行一些确定的功能。用户会在会话的中间进行这些操作，此时机器人可能会期望另外的回复。为了实现 **actions**, 你应当更优雅的设计你的机器人来处理这些请求。这些响应会检测用户的输入，当监听到有类似 "help", "cancel", "start over" 这一类的关键词，就进行适当的回复。

![how users talk](https://docs.microsoft.com/en-us/bot-framework/media/designing-bots/capabilities/trigger-actions.png)

#### 动作种类

​	下面列着你可以给对话框添加的动作种类。点击每一个名字查看细节。

| Action                                   | Scope      | Description                              |
| ---------------------------------------- | ---------- | ---------------------------------------- |
| [triggerAction](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-actions#bind-a-triggeraction) | Global     | Binds an action to the dialog that will clear the dialog stack and push itself onto the bottom of stack. Use `onSelectAction` option to override this default behavior. |
| [customAction](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-actions#bind-a-customaction) | Global     | Binds a custom action to the bot that can process information or take action without affecting the dialog stack. Use `onSelectAction` option to customize the functionality of this action. |
| [beginDialogAction](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-actions#bind-a-begindialogaction) | Contextual | Binds an action to the dialog that starts another dialog when it is triggered. The starting dialog will be pushed onto the stack and popped off once it ends. |
| [reloadAction](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-actions#bind-a-reloadaction) | Contextual | Binds an action to the dialog that causes the dialog to reload when it is triggered. You can use `reloadAction` to handle user utterances like "start over." |
| [cancelAction](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-actions#bind-a-cancelaction) | Contextual | Binds an action to the dialog that cancels the dialog when it is triggered. You can use `cancelAction` to handle user utterances like "cancel" or "nevermind." |
| [endConversationAction](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-actions#bind-an-endconversationaction) | Contextual | Binds an action to the dialog that ends the conversation with the user when triggered. You can use `endConversationAction` to handle user utterances like "goodbye." |

#### 动作的优先权

​	当机器人接收到一个用户的发言，他会针对对话框栈上所有注册的动作进行检查。匹配是从栈顶到栈底的顺序开始的。如果没有匹配，就会在全局动作的 `matches` 选项中进行匹配。

​	动作优先权在你在不同的上下文中使用同样的命令的情况下尤其重要。举个例子，你可以给机器人使用 ”Help“ 命令来进行整体帮助。你也可以使用 "Help" 命令给某项具体的跟上下文有关的任务进行帮助。关于这些的详细叙述，请看 ”响应用户输入“ 一章。

#### 将动作绑定到对话框

​	用户的发言和点击按钮都能触发相关对话框的一个动作。如果指定了匹配规则，动作会监听用户输入的词语或者短语来触发动作。`matches` 选项可以设置一个正则表达式或者名称识别。绑定动作到按钮点击，可以使用 `CardAction.dialogAction()` 方法来触发动作。

​	动作是可以链接的，这样可以让你绑定更多的动作到你的对话框上。

##### 绑定一个 triggerAction

​	要绑定一个 `triggerAction` 到对话框，可以像下面这么做：

```javascript
// Order dinner.
bot.dialog('orderDinner', [
    //...waterfall steps...
])
// Once triggered, will clear the dialog stack and pushes
// the 'orderDinner' dialog onto the bottom of stack.
.triggerAction({
    matches: /^order dinner$/i
});
```

​	将一个 `triggerAction` 绑定到一个对话框上，就是将它注册到了机器人上。一旦触发，`triggerAction` 将会清楚对话框栈并且将触发的对话框压入栈中。这个动作最好用于切换会话的主题，或者用于允许用户请求任意独立的任务。如果你想覆盖清楚对话框栈的这个操作，可以将一个 `onSelectAction` 选项添加到 `triggerAction` 上。

​	下面的代码片段展示了如何在全局上下文中提供一个整体的帮助对话框，而不会清空这个对话框栈。

```javascript
bot.dialog('help', function (session, args, next) {
    //Send a help message
    session.endDialog("Global help menu.");
})
// Once triggered, will start a new dialog as specified by
// the 'onSelectAction' option.
.triggerAction({
    matches: /^help$/i,
    onSelectAction: (session, args, next) => {
        // Add the help dialog to the top of the dialog stack 
        // (override the default behavior of replacing the stack)
        session.beginDialog(args.action, args);
    }
});
```

​	在这个例子中，`triggerAction` 被添加到了 `help` 对话框自己上。`onSelectAction` 选项允许你开始这个对话框而不用清空对话框栈。这样允许你可以处理类似 "help", "about", "support" 这一类的全局请求。注意 `onSelectAction` 选项明确地调用了 `session.beginDialog` 方法来开始被触发的对话框。`args.action` 参数提供了被触发对话框的ID。不要在这个方法里手动编辑对话框ID，否则你将会得到一个运行报错。如果你想在 `orderDinner` 任务里触发一个跟上下文有关的帮助消息，你可以考虑给 `orderDinner` 对话框添加 `beginDialogAction` 来替代。

##### 绑定一个 customAction

​	和其他类型的动作不同，`customAction` 没有默认的动作定义。动作执行什么操作是由你自己决定的。使用 `customAction` 的好处是你可以操作用户的请求而不用去草种对话框栈。当一个 `customAction` 被触发，`onSelecetAction` 选项可以被执行，而不用将新的对话框压入栈中。当这个动作完成，控制权会交回栈顶部的对话框，以便机器人继续运行。

​	你可以使用一个 `ustomAction` 来提供通用并且快速的请求，比如说：“现在外面的温度是多少？”，“巴黎现在的时间是多少？”，“提醒我今天下午5点买牛奶”等等。机器人可以执行这些通用的动作而不用操纵对话框栈。

​	`customAction` 另外一个不同的地方，它是绑定在机器人上而不是对话上的。

​	下面的代码例子展示了如何将一个 `customAction` 绑定在 `bot` 来监听请求，并设置一个提醒。

```javascript
bot.customAction({
    matches: /remind|reminder/gi,
    onSelectAction: (session, args, next) => {
        // Set reminder...
        session.send("Reminder is set.");
    }
})
```

##### 绑定一个 `beginDialogAction` 

​	绑定一个 `beginDialogAction` 到一个对话框上，会将这个动作注册在对话框上。当这个方法被触发时，会开始另外一个对话框。这个动作的行为和调用 `beginDialog` 方法类似。新的对话框会被压入栈顶，所以它不会自动结束当前任务。当前任务会在新的对话框结束后继续。

​	下面的代码片段展示了如何将一个 `beginDialogAction` 绑定在一个对话框上

```javascript
// Order dinner.
bot.dialog('orderDinner', [
    //...waterfall steps...
])
// Once triggered, will start the 'showDinnerCart' dialog.
// Then, the waterfall will resumed from the step that was interrupted.
.beginDialogAction('showCartAction', 'showDinnerCart', {
    matches: /^show cart$/i
});

// Show dinner items in cart
bot.dialog('showDinnerCart', function(session){
    for(var i = 1; i < session.conversationData.orders.length; i++){
        session.send(`You ordered: ${session.conversationData.orders[i].Description} for a total of $${session.conversationData.orders[i].Price}.`);
    }

    // End this dialog
    session.endDialog(`Your total is: $${session.conversationData.orders[0].Price}`);
});
```

​	当你需要给新的对话框传递参数的时候，你可以给动作添加 `dialogArgs` 选项。

​	你可以修改上面的例子，通过 `dialogArgs` 给它传入参数。

```javascript
// Order dinner.
bot.dialog('orderDinner', [
    //...waterfall steps...
])
// Once triggered, will start the 'showDinnerCart' dialog.
// Then, the waterfall will resumed from the step that was interrupted.
.beginDialogAction('showCartAction', 'showDinnerCart', {
    matches: /^show cart$/i,
    dialogArgs: {
        showTotal: true;
    }
});

// Show dinner items in cart with the option to show total or not.
bot.dialog('showDinnerCart', function(session, args){
    for(var i = 1; i < session.conversationData.orders.length; i++){
        session.send(`You ordered: ${session.conversationData.orders[i].Description} for a total of $${session.conversationData.orders[i].Price}.`);
    }

    if(args && args.showTotal){
        // End this dialog with total.
        session.endDialog(`Your total is: $${session.conversationData.orders[0].Price}`);
    }
    else{
        session.endDialog(); // Ends without a message.
    }
});
```

##### 绑定一个 reloadAction

​	绑定一个 `reloadAction` 到一个对话框将会将它注册到对话框。将这个动作绑定到对话框，在触发的时候会导致对话框重新开始。触发这个动作和调用 `replaceDialog` 方法类似。这在实现类似用户输入 "start over" 或者创建一个循环的逻辑的时候非常有用。

​	下面的代码片段展示了如何将 `reloadAction` 绑定的对话框。

```javascript
// Order dinner.
bot.dialog('orderDinner', [
    //...waterfall steps...
])
// Once triggered, will restart the dialog.
.reloadAction('startOver', 'Ok, starting over.', {
    matches: /^start over$/i
});
```

​	在这个例子中，当你需要传入一些参数给重新加载的对话框的时候，你可以添加一个 `dialogArgs` 选项给这个动作。这个选项。这个选项被传递给对话框的 `args` 参数。重写上面的代码例子，使得重载的动作能够获取到参数，看起来会像这样：

```javascript
// Order dinner.
bot.dialog('orderDinner', [
    function(session, args, next){
        if(args && args.isReloaded){
            // Reload action was triggered.
        }

        session.send("Lets order some dinner!");
        builder.Prompts.choice(session, "Dinner menu:", dinnerMenu);
    }
    //...other waterfall steps...
])
// Once triggered, will restart the dialog.
.reloadAction('startOver', 'Ok, starting over.', {
    matches: /^start over$/i,
    dialogArgs: {
        isReloaded: true;
    }
});
```

##### 绑定一个 cancelAction

​	`cancelAction` 的绑定会注册在对话框上。一旦被触发，这个动作会立即中断对话框。当对话中断时，父对话将会恢复，并有一个恢复码表明对话被退出。这个动作允许你处理一些类似 “nevermind” 或者 “cancel”一类的语句。如果你需要编写自己的退出对话框，请参考 **退出对话框** 章节。关于返回码的更多信息，请看 **提示结果** 一节。

​	下面的戴安展示了如何将 `cancelAction` 绑定到对话

```javascript
// Order dinner.
bot.dialog('orderDinner', [
    //...waterfall steps...
])
//Once triggered, will end the dialog.
.cancelAction('cancelAction', 'Ok, cancel order.', {
    matches: /^nevermind$|^cancel$|^cancel.*order/i
});
```

##### 绑定一个 endConversationAction

​	`endConversationAction` 的绑定会注册在对话框上。当触发的时候，这个动作会结束用户的会话。触发这个动作和调用 `endConversation` 方法类似。一旦会话结束，SDK会清除对话框栈和所有持久状态数据。关于持久状态数据的更多信息，请看 **管理状态数据** 章节。

​	下面的代码片段展示了如何将一个 `endConversationDialog` 绑定在对话框上

```javascript
// Order dinner.
bot.dialog('orderDinner', [
    //...waterfall steps...
])
// Once triggered, will end the conversation.
.endConversationAction('endConversationAction', 'Ok, goodbye!', {
    matches: /^goodbye$/i
});
```

#### 确认中断

​	大多数动作都会中断正常的会话流程。其中大多数是会破坏会话流程的，所以应当更小心的进行处理。举个例子，`triggerAction`, `cancelAction` 或者 `endConversationAction` 将会清空对话框栈。如果用户错误地触发了这些动作，他们必须重新开始任务。确认用户真的想要触发这些动作，你可以给这些动作添加一个 `confirmPrompt` 选项。`confirmPrompt` 将会询问用户他们是否真的想要退出或者结束当前的任务。它允许用户可以改变主意并且继续任务流程。

​	下面的代码片段展示了添加有`confirmPrompt` 的 `cancelAction` ，让用户在退出流程之前可以进行确认。

```javascript
// Order dinner.
bot.dialog('orderDinner', [
    //...waterfall steps...
])
// Confirm before triggering the action.
// Once triggered, will end the dialog. 
.cancelAction('cancelAction', 'Ok, cancel order.', {
    matches: /^nevermind$|^cancel$|^cancel.*order/i
    confirmPrompt: "Are you sure?"
});
```

 	当这个动作被触发时，它会问用户 “Are you sure?” ，用户必须回答 “Yes” 来进行这个动作，或者回答 “No” 来退出这个动作并继续之前的流程。

 #### 下一步

​	**Actions** 允许你预料用户的请求，并且让机器人优雅地处理这些请求。这些动作的大多数会破坏当前的会话流程。如果你想要用户可切换和恢复会话流程，你需要在用户切换之前保存用户的状态。接下来让我们详细了解如何保存用户的状态以及管理状态数据。

## 消息

### 创建消息

​	机器人与用户之间是通过消息进行沟通的。你的机器人会发送消息给用户，或接收来自用户的消息。一些消息可能是由简单的文本构成的，也有一些可能包含类似语音，动作，媒体附件，富文本卡片或者频道特有的数据等更丰富的内容。

​	这一章节秒速了一些通用的消息方法，你可以用它们来提高你的产品的用户体验。

#### 默认消息处理

​	Node.js 下的 Bot Builde SDK 附带了在 `session` 对象中内置的默认消息处理器。这个消息处理器允许你在机器人和用户之间收发文本消息。

##### 发送文本消息

​	用默认消息处理器发送文本消息非常简单，你只需调用 `session.send` 方法，并给其传入字符串。

​	这个例子展示了你怎么给用户发一个文本问候消息：

```javascript
session.send("Good morning.");
```

​	这个例子展示了你怎么用 JavaSript 的模板字符串发送文本消息：

```javascript
var msg = `You ordered: ${order.Description} for a total of $${order.Price}.`;
session.send(msg); //msg: "You ordered: Potato Salad for a total of $5.99."
```

##### 接收文本消息

​	当用户给机器人发送消息，机器人通过 `session.message` 属性接收消息。

​	这个例子展示了如何获得用户的消息：

```javascript
var userMessage = session.message.text;
```

#### 自定义一个消息

​	如果你想对你的消息格式进行更多的操作，你可以创建一个自定义 `message` 对象，并且在发送给用户之前进行必要的设置。

​	这个例子展示了如何创建一个自定义的 `message` 对象，并且设置了 `text` , `textFormat` 和 `tetLocale` 属性。

```javascript
var customMessage = new builder.Message(session)
    .text("Hello!")
    .textFormat("plain")
    .textLocale("en-us");
session.send(customMessage);
```

​	在你的作用域里没有 `session` 对象的情况下，你可以使用 `bot.send` 方法来发送格式化的消息给用户。

​	`textFormat`  属性可以用来指定文本的格式。`textFormat` 属性可以设置成 **plain** , **markdown**, 或者 **xml** 。默认的格式是 **markdown**

​	常见的文本格式的支持列表，请看  [Text formatting](https://docs.microsoft.com/en-us/bot-framework/portal-channel-inspector#text-formatting).  为了确保这些功能在目标的频道中被支持，请查看 [Channel Inspector](https://docs.microsoft.com/en-us/bot-framework/portal-channel-inspector).

#### 消息属性

​	`Message` 对象有一个内置的  **data**  属性，用于管理发送的消息。而其他的属性的设置是通过这个对象的不同方法来实现的。

#### 消息方法

​	消息属性是通过对象的方法来设置和检索的。下面的表提供了你可以调用的方法的列表，用于设置/获取不同的消息属性。

| Method                                   | Description                              |
| ---------------------------------------- | ---------------------------------------- |
| [`addAttachment(attachment:AttachmentType)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#addattachment) | Adds an attachment to a message          |
| [`addEntity(obj:Object)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#addentity) | Adds an entity to the message.           |
| [`address(adr:IAddress)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#address) | Address routing information for the message. To send user a proactive message, save the message's address in the userData bag. |
| [`attachmentLayout(style:string)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#attachmentlayout) | Hint for how clients should layout multiple attachments. The default value is 'list'. |
| [`attachments(list:AttachmentType)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#attachments) | A list of cards or images to send to the user. |
| [`compose(prompts:string[\], ...args:any[])`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#compose) | Composes a complex and randomized reply to the user. |
| [`entities(list:Object[\])`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#entities) | Structured objects passed to the bot or user. |
| [`inputHint(hint:string)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#inputhint) | Hint sent to user letting them know if the bot is expecting further input or not. The built-in prompts will automatically populate this value for outgoing messages. |
| [`localTimeStamp((optional)time:string)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#localtimestamp) | Local time when message was sent (set by client or bot, Ex: 2016-09-23T13:07:49.4714686-07:00.) |
| [`originalEvent(event:any)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#originalevent) | Message in original/native format of the channel for incoming messages. |
| [`sourceEvent(map:ISourceEventMap)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#sourceevent) | For outgoing messages can be used to pass source specific event data like custom attachments. |
| [`speak(ssml:TextType, ...args:any[\])`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#speak) | Sets the speak field of the message as *Speech Synthesis Markup Language (SSML)*. This will be spoken to the user on supported devices. |
| [`suggestedActions(suggestions:ISuggestedActions` | `IIsSuggestedActions)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#suggestedactions) |
| [`summary(text:TextType, ...argus:any[\])`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#summary) | Text to be displayed as fall-back and as short description of the message content in (e.g.: List of recent conversations.) |
| [`text(text:TextType, ...args:any[\])`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#text) | Sets the message text.                   |
| [`textFormat(style:string)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#textformat) | Set the text format. Default format is **markdown**. |
| [`textLocale(locale:string)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#textlocale) | Set the target language of the message.  |
| [`toMessage()`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#tomessage) | Gets the JSON for the message.           |
| [`composePrompt(session:Session, prompts:string[\], args?:any[])`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#composeprompt-1) | Combines an array of prompts into a single localized prompt and then optionally fills the prompts template slots with the passed in arguments. |
| [`randomPrompt(prompts:TextType)`](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message.html#randomprompt) | Gets a random prompt from the array of **prompts*that is passed in. |



### 发送和接收附件

​	用户和机器人之间的消息交互可以包括类似图片，声音，视频，文件等形式的附件。每个频道可以发送的附件类型都不一样，但下面这些事一些基本类型：

- **多媒体和文件：** 你可以将 **contentType** 设置为 `IAttachment` 对象的 MIME 类型，然后将链接传递给 **contentUrl**  中的文件来发送文件，比如图像，音频和视频。
- **卡片：** 你可以将 **contentType** 设置成想要的卡片类型，然后将 JSON 数据传递给卡片，用于给用户发送一个可见的卡片。如果你用了类似 `HeroCard` 一类的卡片构建类，附件将会自动的填充。详细例子请看 [send a rich card](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-rich-cards) 。

#### 添加多媒体附件

​	当你想要在给用户发送的消息里包含类似图片的附件时，消息的对象一般是一个 `Imessage` 类的实例。使用 `session.send()` 方法用来发送 JSON 对象格式的消息

#### 例子

​	下面的的例子检查用户是否发送了一个附件，如果有附件，将会回复附件中包含的任意图片。你可以在 Bot Framework Emulator 中测试给机器人发送图片。

```javascript
// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
    var msg = session.message;
    if (msg.attachments && msg.attachments.length > 0) {
     // Echo back attachment
     var attachment = msg.attachments[0];
        session.send({
            text: "You sent:",
            attachments: [
                {
                    contentType: attachment.contentType,
                    contentUrl: attachment.contentUrl,
                    name: attachment.name
                }
            ]
        });
    } else {
        // Echo back users text
        session.send("You said: %s", session.message.text);
    }
});
```

#### 更多资源

- [Preview features with the Channel Inspector](https://docs.microsoft.com/en-us/bot-framework/portal-channel-inspector)
- [IMessage](http://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.imessage)
- [Send a rich card](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-rich-cards)
- [session.send](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.session.html#send) 



### 发送主动消息

​	通常，机器人发送的每个消息，都是跟用户的输入有关系。在某些情况下，机器人可能需要给用户发送一些跟当前会话没有直接关系的消息。这些类型的消息被叫做 **主动消息**。

​	主动消息在很多场景下会很有用。如果机器人设置了一个计时器或事件提醒，它需要在时间到达的时候通知用户。或者说，如果机器人收到一个系统外部的通知，它可能需要立即和用户交流这个信息。举个例子，如果用户之前要求机器人监控一个产品的价格变化，机器人会在它收到这个产品降价20%的消息的时候通知用户。又或者，如果机器人需要在一些时间来回复用户的问题，它会在延迟之后通知用户，并同时继续会话。当机器人完成了这个问题的回复，它会将这个信息推送给用户。

​	当你需要在你的机器人中实现主动消息时：

> ​	不要发送在短时间内多次发送主动消息。一些频道强制限制了机器人给用户发送消息的频率，当你这么做时，会违反这些规定。
>
> ​	不要给先前没有与机器人交互过的用户发送主动消息，或者通过 e-mail、 短信的等方式使得机器人与用户联系。

​	考虑以下的场景：

![how users talk](https://docs.microsoft.com/en-us/bot-framework/media/designing-bots/capabilities/proactive1.png)

​	在这个例子中，用户在之前要求机器人监控拉斯维加斯酒店的价格。机器人在后台进行这个监视任务，这个任务一直运行了很多天。在当前这个会话中，用户在预定伦敦的旅游的时候，后台的任务触发了一个关于拉斯维加斯酒店打折的通知消息。机器人在当前会话中插入了这个消息，使得用户非常的困惑。

​	在这种情况下机器人该如何处理呢？

- 在当前的旅行预定会话结束后，再发送这个通知。这个方法不会有什么破坏性，但是延迟的消息，可能使用户错过拉斯维加斯酒店的低价。

- 退出当前的旅行预定会话，然后立即将消息发送给用户。这个方法会及时的发送消息，但是会强制使用户重新开始他们的旅行预定。

- 打断当前的预定，在用户回复之前，标明会话主题变为了拉斯维加斯的酒店，之后再恢复到旅行预定中断的地方。这个方法看起来是最好的选择，但是它对用户和开发者都会变得复杂。

  通常情况下，你的机器人会采用一些 **特别广告主动消息** ，或者 **对话框主动消息** 来处理这种情况。

#### 主动消息的种类

​	一个 **特别广告主动消息** 是主动消息种类里最简单的一种。机器人会简单地在会话中触发的地方弹出一个消息，而不管用户是否正与机器人进行会话，并且也不会试图去改变这个会话。

​	**对话框主动消息** 要比 **特别广告主动消息** 要复杂的多。在会话中弹出这个消息之前，机器人必须识别现有会话的上下文，以便决定在这个消息结束后如何回到对话。

​	举个例子，考虑一个机器人需要在一个给定的时间点开始一项调查。当这个时间到达时，机器人停下和用户现有的会话，将用户重定向到 `SurveyDialog` 。`SurveyDialog` 将会被压入对话框栈顶，并且控制会话。当用户完成了 `SurveyDiaog` 要求的任务，`SurveyDialog` 关闭，并重新将控制权交给之前的对话框，这样用户就可以继续这个会话。

​	一个对话框主动消息并不仅仅是简单的通知。在发送通知的同事，机器人会改变现有会话的主题。它必须决定之后是否会恢复会话，或者干脆重置对话框栈来放弃整个会话。

#### 发送一个特别广告主动消息

​	下面的代码例子展示了如何用 SDK 来发送一个特别广告主动消息。

​	要给用户发送特别广告消息，机器人首先必须收集并存储用户当前会话的信息。消息的 `address` 属性包括了机器人将要给用户发送消息的所有信息。

```javascript
bot.dialog('adhocDialog', function(session, args) {
    var savedAddress = session.message.address;

    // (Save this information somewhere that it can be accessed later, such as in a database, or session.userData)
    session.userData.savedAddress = savedAddress;

    var message = 'Hello user, good to meet you! I now know your address and can send you notifications in the future.';
    session.send(message);
})
```

 	在机器人收集了用户的信息之后，它可以在任意时间给用户发送特别广告主动消息。要这么做，它只需检索先前存储的用户数据，构建消息并发送。

```javascript
var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector)
                .set('storage', inMemoryStorage); // Register in-memory storage 

function sendProactiveMessage(address) {
    var msg = new builder.Message().address(address);
    msg.text('Hello, this is a notification');
    msg.textLocale('en-US');
    bot.send(msg);
}
```

#### 发送对话框主动消息

​	下面的代码例子展示了如何使用 SDK 发送对话框主动消息。你可以在 [Microsoft/BotBuilder-Samples/Node/core-proactiveMessages/startNewDialog](https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/core-proactiveMessages/startNewDialog) 目录下找到这个的完整例子。

​	要给用户发送对话框消息，机器人首先得手机并存储当前会话的信息。 `session.message.address` 对象包括了这些信息，以便于机器人给用户发送对话框主动消息。

```javascript
// proactiveDialog dialog
bot.dialog('proactiveDialog', function (session, args) {

    savedAddress = session.message.address;

    var message = 'Hey there, I\'m going to interrupt our conversation and start a survey in five seconds...';
    session.send(message);

    message = `You can also make me send a message by accessing: http://localhost:${server.address().port}/api/CustomWebApi`;
    session.send(message);

    setTimeout(() => {
        startProactiveDialog(savedAddress);
    }, 5000);
});
```

​	当到了发送消息的时候，机器人会创建一个新的对话框，并将它压入栈顶。新的对话框会接管会话，提供推送消息，在关闭后，栈中原先的对话框会接管会话。

```javascript
// initiate a dialog proactively 
function startProactiveDialog(address) {
    bot.beginDialog(address, "*:survey");
}
```

​	`survey` 对话框接管了会话，知道它完成。然后，它会关闭（调用 `session.endDialog()` ） ，并返回之前的对话框

```javascript
// handle the proactive initiated dialog
bot.dialog('survey', function (session, args, next) {
  if (session.message.text === "done") {
    session.send("Great, back to the original conversation");
    session.endDialog();
  } else {
    session.send('Hello, I\'m the survey dialog. I\'m interrupting your conversation to ask you a question. Type "done" to resume');
  }
});
```

#### 代码示例

​	完整的使用 SDK 发送主动消息的示例，请在 GitHub 上查看  [Proactive Messages sample](https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/core-proactiveMessages) 。其中，  [simpleSendMessage](https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/core-proactiveMessages/simpleSendMessage) 展示了如何发送特别广告主动消息，[startNewDialog](https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/core-proactiveMessages/startNewDialog) 展示了如何发送对话框主动消息。

#### 更多资源

- [Designing conversation flow](https://docs.microsoft.com/en-us/bot-framework/bot-design-conversation-flow) 

### 给消息添加富文本卡片附件

​	一些类似 Skype & Facebook 的频道，支持发送拥有可以让用户点击交互按钮的富文本卡片。SDK 提供了一些消息和卡片构建类，可以用于创建和发送卡片。Bot Framework Connector Service 将会在频道中通过本地渲染这些卡片，以便于支持跨品台的交流。如果平台像短信一般不支持卡片，Bot Framework 将会尽可能合理的渲染成其他的样式。

#### 富文本卡片的种类

​	Bot Framework 目前支持8种卡片：

| Card type                                | Description                              |
| ---------------------------------------- | ---------------------------------------- |
| [Adaptive Card](https://docs.microsoft.com/en-us/adaptive-cards/get-started/bots) | A customizable card that can contain any combination of text, speech, images, buttons, and input fields. See [per-channel support](https://docs.microsoft.com/en-us/adaptive-cards/get-started/bots#channel-status). |
| [Animation Card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.animationcard.html) | A card that can play animated GIFs or short videos. |
| [Audio Card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.audiocard.html) | A card that can play an audio file.      |
| [Hero Card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.herocard.html) | A card that typically contains a single large image, one or more buttons, and text. |
| [Thumbnail Card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.thumbnailcard.html) | A card that typically contains a single thumbnail image, one or more buttons, and text. |
| [Receipt Card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.receiptcard.html) | A card that enables a bot to provide a receipt to the user. It typically contains the list of items to include on the receipt, tax and total information, and other text. |
| [Signin Card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.signincard.html) | A card that enables a bot to request that a user sign-in. It typically contains text and one or more buttons that the user can click to initiate the sign-in process. |
| [Video Card](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.videocard.html) | A card that can play videos.             |

#### 通过 Hero 卡片发送一个轮播

​	下面的例子展示了一个虚拟的 T-shirt 公司，如何在用户说 “show shirts”的时候回复一组轮播卡片。

```javascript
// Create your bot with a function to receive messages from the user
// Create bot and default message handler
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Hi... We sell shirts. Say 'show shirts' to see our products.");
});

// Add dialog to return list of shirts available
bot.dialog('showShirts', function (session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("Classic White T-Shirt")
            .subtitle("100% Soft and Luxurious Cotton")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/whiteshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
            ]),
        new builder.HeroCard(session)
            .title("Classic Gray T-Shirt")
            .subtitle("100% Soft and Luxurious Cotton")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/grayshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
            ])
    ]);
    session.send(msg).endDialog();
}).triggerAction({ matches: /^(show|list)/i });
```

​	这个例子使用了 `Message` 类来构建轮播。

​	这组录播又一组包含了图片文字和购买按钮的 `HeroCard` 类组成。

​	点击 **购买** 按钮会发送一个消息，所以我们需要添加第二个对话框来捕获按钮点击事件。

#### 处理按钮输入

​	`buyButtonClick` 对话框将会在收到 "buy" 或者 “add” 后面跟着类似 "shirt" 这样的消息之后触发。对话框使用一对正则表达式来寻找用户想要的 shirt  的颜色和尺寸。这样更加灵活，使得你可以同时支持按钮点击或者来自用户的自然语言输入，比如说 “please add a large gray shirt to my cart”。如果颜色是有效的，但是尺码不对，机器人会提示用户选择这件准备添加到购物车的商品的尺码。一旦机器人有了需要的所有信息，它会将商品添加到购物车，并用 `session.userData` 存储数据，之后向用户发出确认消息。

```javascript
// Add dialog to handle 'Buy' button click
bot.dialog('buyButtonClick', [
    function (session, args, next) {
        // Get color and optional size from users utterance
        var utterance = args.intent.matched[0];
        var color = /(white|gray)/i.exec(utterance);
        var size = /\b(Extra Large|Large|Medium|Small)\b/i.exec(utterance);
        if (color) {
            // Initialize cart item
            var item = session.dialogData.item = { 
                product: "classic " + color[0].toLowerCase() + " t-shirt",
                size: size ? size[0].toLowerCase() : null,
                price: 25.0,
                qty: 1
            };
            if (!item.size) {
                // Prompt for size
                builder.Prompts.choice(session, "What size would you like?", "Small|Medium|Large|Extra Large");
            } else {
                //Skip to next waterfall step
                next();
            }
        } else {
            // Invalid product
            session.send("I'm sorry... That product wasn't found.").endDialog();
        }   
    },
    function (session, results) {
        // Save size if prompted
        var item = session.dialogData.item;
        if (results.response) {
            item.size = results.response.entity.toLowerCase();
        }

        // Add to cart
        if (!session.userData.cart) {
            session.userData.cart = [];
        }
        session.userData.cart.push(item);

        // Send confirmation to users
        session.send("A '%(size)s %(product)s' has been added to your cart.", item).endDialog();
    }
]).triggerAction({ matches: /(buy|add)\s.*shirt/i });
```

#### 添加一个图片下载延迟消息

​	一些频道趋向于在给用户展示消息之前下载图片，因此，如果你在发送了一个带图片的消息之后接着又发送了一个没有图片的消息，有可能会造成顺序的错误。为了尽可能减少这种可能性，你可以尝试让你的图片来自内容交付网络（CDNs），并且避免使用过大的图片。在极端的情况下，你甚至可能需要在消息之间插入1-2秒的延迟。你可以调用 session.sendTyping() 方法来发送一个输入指示符，使用户体验更好。

​	Bot Framework 实现了一个批处理，来防止消息显示顺序的混乱。当你的机器人发出多条回复给用户的时候，每个消息将会被自动份组成一个批处理发送给用户，以保证消息的顺序。这个自动的批处理默认情况下在每次调用 `session.send()` 与 send() 方法之间添加一个250ms的延迟。

​	消息的批处理延迟是可以设置的。禁用 SDK 的自动批处理逻辑，将默认延迟设置成更大的数值，然后在批处理完成之后，通过回调函数手动调用 sendBatch() 。

#### 发送一个 Adaptive 卡片 

​	Adaptive 卡片 可以包含任何内容，比如说文字，语音，图片，按钮或者输入框。Adaptive 卡片在 [Adaptive Cards](http://adaptivecards.io/) 类中使用 JSON 格式来创建，这样你可以完全控制卡片的内容和格式。

​	使用 Node.js 创建一个 Adaptive 卡片，可以通过 [Adaptive Cards](http://adaptivecards.io/) 网站来了解 Adaptive 卡片的格式，解析 Adaptive 卡片的元素，并且查看用来创建卡片内容和结构的 JSON 例子。更多的，你可以使用交互式平台来设计 Adaptive 卡片。

​	这个代码例子展示了如何创建一个包含 Adaptive 卡片的例子，来制作一个日历提醒器：

```javascript
var msg = new builder.Message(session)
    .addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            type: "AdaptiveCard",
            speak: "<s>Your  meeting about \"Adaptive Card design session\"<break strength='weak'/> is starting at 12:30pm</s><s>Do you want to snooze <break strength='weak'/> or do you want to send a late notification to the attendees?</s>",
               body: [
                    {
                        "type": "TextBlock",
                        "text": "Adaptive Card design session",
                        "size": "large",
                        "weight": "bolder"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Conf Room 112/3377 (10)"
                    },
                    {
                        "type": "TextBlock",
                        "text": "12:30 PM - 1:30 PM"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Snooze for"
                    },
                    {
                        "type": "Input.ChoiceSet",
                        "id": "snooze",
                        "style":"compact",
                        "choices": [
                            {
                                "title": "5 minutes",
                                "value": "5",
                                "isSelected": true
                            },
                            {
                                "title": "15 minutes",
                                "value": "15"
                            },
                            {
                                "title": "30 minutes",
                                "value": "30"
                            }
                        ]
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Http",
                        "method": "POST",
                        "url": "http://foo.com",
                        "title": "Snooze"
                    },
                    {
                        "type": "Action.Http",
                        "method": "POST",
                        "url": "http://foo.com",
                        "title": "I'll be late"
                    },
                    {
                        "type": "Action.Http",
                        "method": "POST",
                        "url": "http://foo.com",
                        "title": "Dismiss"
                    }
                ]
        }
    });
```

​	这个卡片包含了3块文字，1个输入框（选择列表），和3个按钮：

![Adaptive Card calendar reminder](https://docs.microsoft.com/en-us/bot-framework/media/adaptive-card-reminder.png)

#### 更多资源

- [Preview features with the Channel Inspector](https://docs.microsoft.com/en-us/bot-framework/portal-channel-inspector)
- [Adaptive Cards](http://adaptivecards.io/)
- [AnimationCard](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.animationcard.html)
- [AudioCard](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.audiocard.html)
- [HeroCard](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.herocard.html)
- [ThumbnailCard](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.thumbnailcard.html)
- [ReceiptCard](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.receiptcard.html)
- [SigninCard](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.signincard.html)
- [VideoCard](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.videocard.html)
- [Message](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.message)
- [How to send attachments](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-receive-attachments) 