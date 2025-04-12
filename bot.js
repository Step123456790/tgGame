require('dotenv').config();
const fs = require('fs');

const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.BOT_TOKEN, {
   polling: {
      interval: 300,
      autoStart: true
   }
});
bot.on("polling_error", err => console.log(err.data.error.message));


const commands = [
   {
      command: "start",
      description: "Запуск бота"
   },
   // {
   //    command: "ref",
   //    description: "Получить реферальную ссылку"
   // },
   {
      command: "help",
      description: "Раздел помощи"
   },
   {
      command: "menu",
      description: "Открыть меню бота"
   },
]
bot.setMyCommands(commands);



// ссылка на игру в сети интернет
let urlGame = 'http://siteWithGame.com'
// название игры (то, что указывали в BotFather)
const gameName = "myCaptain"

// Matches 'Играть'
bot.onText('Играть', function onPhotoText(msg) {
   bot.sendGame(msg.chat.id, gameName);
});

// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
   bot.answerCallbackQuery(callbackQuery.id, { urlGame });
});




bot.on('text', async msg => {
   try {
      if(msg.text.startsWith('/start')) {
         await bot.sendMessage(msg.chat.id, `Вы запустили бота!`);
         if(msg.text.length > 6) {
            const refID = msg.text.slice(7);
            await bot.sendMessage(msg.chat.id, `Вы зашли по ссылке пользователя с ID ${refID}`);
         }
      }
      // else if(msg.text == '/ref') {
      //    await bot.sendMessage(msg.chat.id, `${process.env.URL_TO_BOT}?start=${msg.from.id}`);
      // }
      else if(msg.text == '/help') {
         await bot.sendMessage(msg.chat.id, `Раздел помощи`);
      }
      else if(msg.text == '/menu') {
         await bot.sendMessage(msg.chat.id, `Меню бота`, {
            reply_markup: {
               keyboard: [
                  ['Играть', 'Таблица лидеров'],
                  ['...', '...'],
                  ['❌ Закрыть меню']
               ],
               resize_keyboard: true
            }
         })
      }
      else if(msg.text == '❌ Закрыть меню') {
         await bot.sendMessage(msg.chat.id,'Меню закрыто', {
            reply_markup: {
               remove_keyboard: true
            }
         })
      }
      else if(msg.text == 'Играть') {
         await bot.sendMessage(msg.chat.id,`⭐️ Картинка \n \tОтправьте картинку и bot вернёт вам сжатые копии с подписаными данными о них`)
      }

      else {
         const msgWait = await bot.sendMessage(msg.chat.id, `Бот генерирует ответ...`);
         setTimeout(async () => {
            await bot.editMessageText(msg.text, {
               chat_id: msgWait.chat.id,
               message_id: msgWait.message_id
            });
         }, 3000);
      }
   }
   catch(error) {
      console.log(error);
   }
})


// Enable graceful stop
process.once('SIGINT', () => {
    console.log("bot stoped")
    bot.stop('SIGINT')
});
process.once('SIGTERM', () => bot.stop('SIGTERM'));