"use strict";

const startOptions = {
  reply_markup: JSON.stringify({
      inline_keyboard: [
        [{text: 'Расскажи анекдот', callback_data: '/joke'}, {text: 'Давай играть', callback_data: '/game'}, {text: 'Курс валют', callback_data: '/course'}],
      ]
  })
};

const jokeOptions = {
  reply_markup: JSON.stringify({
      inline_keyboard: [
        [{text: 'Да', callback_data: '/joke'}, {text: 'Нет', callback_data: '/close'}],
      ]
  })
};

const gameAgainOptions = {
  reply_markup: JSON.stringify({
      inline_keyboard: [
        [{text: 'Да', callback_data: '/game'}, {text: 'Нет', callback_data: '/close'}],
      ]
  })
};

const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{text: '1', callback_data: 'game_1'}, {text: '2', callback_data: 'game_2'}, {text: '3', callback_data: 'game_3'}],
    ]
  })
};

const mapActions = {
  '/start': {
    'sticker': 'CAACAgIAAxkBAAEHE19jryU-CWm7ieDZIyi9in4CE04onAACJhwAAuu6iEmiAuPKzVXczy0E',
    'message': {'text': 'Приветики! Добро пожаловать ко мне в гости, чем займемся?', 'options': startOptions},
  },
  '/joke': {
    'function': async function(ctx, chatId) { 
      let number;
      if (ctx.queueJoke < jokes.length) {
        number = ctx.queueJoke++;
      } else {
        ctx.queueJoke = 0;
        number = ctx.queueJoke++;
      }
      await ctx.api.sendMessage(chatId, jokes[number]);
    },
    'message': {'text': 'Рассказать еще?', 'options': jokeOptions},
  },
  '/game': {
    'function': async function(ctx, chatId) {
      await ctx.gameOfNumbers(chatId);
    },
  },
  '/course': {
    'message': {'text': 'Сейчас попытаюсь узнать...', 'options': {}},
    'function': async function(ctx, chatId) {
      await ctx.getExchangeRate(chatId);
    },
  },
  '/again': {
    'message': {'text': 'Сыграем еще раз?', 'options': gameAgainOptions},
  },
  '/againForce': {
    'message': {'text': 'Не жульничай! Давай я загадаю число еще раз?', 'options': gameAgainOptions},
  },
  '/close': {
    'sticker': 'CAACAgIAAxkBAAEHFARjr3KduykxrVhTXaYNZynUyBAz2gACjh0AAmDHkUnMzuhFzK0kDS0E',
    'message': {'text': 'До встречи! Как соскучишься заходи снова!', 'options': {}},
  },
  'Привет': {
    'message': {'text': 'Добрый день', 'options': {}},
  },
  'dont_understand': {
    'message': {'text': 'К сожалению я не знаю что Вам ответить', 'options': {}},
  },
};

const jokes = [
  "Как называют человека, который продал свою печень?\nОбеспеченный.",
  "Почему шутить можно над всеми, кроме безногих?\nШутки про них обычно не заходят.",
  "Почему безногий боится гопников?\nНе может постоять за себя.",
  "Почему толстых женщин не берут в стриптиз?\nОни перегибают палку.",
  "Почему в Африке так много болезней?\nПотому что таблетки нужно запивать водой.",
  "Что сказал слепой, войдя в бар?\n«Всем привет, кого не видел».",
  "Зачем скачивать порно-ролик с карликом?\nОн занимает меньше места.",
  "Как называется избушка Бабы-Яги лесбиянки?\nЛисбушка.",
  "Чего общего у некрофила и владельца строительной кампании?\nОни оба имеют недвижимость.",
  "Что говорят про некрофила-зануду?\nЗа**ет мертвого.",
  "Почему цыган не отправляют на олимпиаду?\nОни заберут все золото.",
  "Как называется притон наркоманов-закладчиков?\nКлуб весёлых и находчивых.",
  "В чем разница между землей и нашими шутками?\nЗемля не плоская.",
  "Почему евреи не делают репосты?\nУ них нет кнопки поделиться.",
  "Чего общего у наших шуток и почты России?\nНе до всех доходит.",
  "Почему Гитлер не любил печь пироги?\nЕму вечно не хватало яиц.",
]

module.exports.mapActions = mapActions;
module.exports.jokes = jokes;
module.exports.startOptions = startOptions;
module.exports.gameOptions = gameOptions;

