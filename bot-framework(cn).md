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

#### **提示结构**

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






