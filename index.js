"use strict";

require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api'); 
const {mapActions, gameOptions} = require('./logicMap.js');
const request = require('request');
var cheerio = require('cheerio');


class Bot {
  constructor() {
    this.token = process.env.TOKEN;
    this.api = new TelegramApi(this.token, {polling: true});
    this.chats = {};
    this.queueJoke = 0;
    this.setHandlers();
    this.setCommands();
  }

  setHandlers() {

    this.api.on('message', async response => {
      const chatId =  response.chat.id;
      const userMessage = response.text;

      if (userMessage.match(/.*курс.*валют.*/i)){
        const actions = this.getActions('/course');
        this.doActions(chatId, actions);
      }
      else if (userMessage.match(/.*расс?кажи.*анекдот.*/i)) {
        const actions = this.getActions('/joke');
        this.doActions(chatId, actions);
      }
      else {
        const actions = this.getActions(userMessage);
        this.doActions(chatId, actions);
      }
    
    });

    this.api.on('callback_query', async response => {
      const chatId = response.message.chat.id;
      const userMessage = response.data;
      let actions;

      if (userMessage === '/again') {
        actions = this.getActions(userMessage);
      }

      if (this.chats[chatId] !== undefined && userMessage.includes('game_')) {

        const number = this.chats[chatId].replace('game_', '');
        if (userMessage == this.chats[chatId]) {
          await this.api.sendSticker(chatId, 'CAACAgIAAxkBAAEHE9hjr2HhbzuDLLluod5zwuk7WBh_5wACYh8AArPNiUn_Y2uBEoN9tS0E');
          await this.api.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${number}`);
        } else {
          await this.api.sendMessage(chatId, `К сожалению мимо, я загадывал цифру ${number}`);
        }

        delete this.chats[chatId];
        actions = this.getActions('/again');

      } else if (this.chats[chatId] == undefined && userMessage.includes('game_')) {

        actions = this.getActions('/againForce');

      } else {

        actions = this.getActions(userMessage);

      }

      this.doActions(chatId, actions);
     
    })

    this.api.on("polling_error", console.log);
  }

  setCommands(){
    this.api.setMyCommands([
      {command: '/start', description: 'Запустить бота'},
      {command: '/joke', description: 'Расскажи анекдот'},
      {command: '/game', description: 'Давай играть'},
      {command: '/course', description: 'Курс валют'},
    ])
  }

  getActions(userMessage) {
    const answer = mapActions[userMessage];
    return answer !== undefined ? answer : mapActions['dont_understand'];
  }

  async doActions(chatId, actions) {
    for (let action in actions) {
      if (action == 'message') {
        await this.api.sendMessage(chatId, actions[action]['text'], actions[action]['options']);
      } else if (action == 'sticker') {
        await this.api.sendSticker(chatId, actions[action]);
      } else if (action == 'function') {
        await actions[action](this, chatId);
      }
    }
  };

  async gameOfNumbers(chatId) {
    await this.api.sendMessage(chatId, `Сейчас я загадаю цифру от 1 до 3, а ты попробуешь ее угадать!`);
    const randomNumber = Math.floor(Math.random() * (3 - 1 + 1) + 1)
    this.chats[chatId] = 'game_' + randomNumber;
    await this.api.sendMessage(chatId, 'Отгадывай', gameOptions);
  }

  getExchangeRate(chatId) {
    var t = this;
    request('https://finance.rambler.ru/currencies/', function (err, res, body) {
      if (err) throw err;
      const $ = cheerio.load(body);
      const usd = $('.finance__currency-blocks .finance__currency-block:first-child .currency-block__row:first-child .currency-block__marketplace:first-child .currency-block__marketplace-value').text().trim();
      const eur = $('.finance__currency-blocks .finance__currency-block:last-child .currency-block__row:first-child .currency-block__marketplace:first-child .currency-block__marketplace-value').text().trim();
      if (usd && eur) {
        t.api.sendMessage(chatId, `Доллар: ${usd}₽\nЕвро: ${eur}₽`);
      } else {
        t.api.sendMessage(chatId, `К сожалению я ничего не нашел...`);
      }
    });
  }
}

const bot = new Bot();

