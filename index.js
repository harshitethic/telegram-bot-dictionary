const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather
const bot = new TelegramBot('6107951338:AAE_BnagLq8GSvPqKSFNlDxHZxOTDUyVa7c', { polling: true });

// '/start' command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const caption = 'Welcome to the Dictionary Bot! 📚🤖\n\nUse /help to learn how to use this bot.\n\nFor Developer /developer';
  const photo = 'https://harshitethic.in/assets/image/preview.png';

  bot.sendPhoto(chatId, photo, { caption });
});

// '/help' command handler
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const message = `To get the meaning of a word, use the following format:\n\n/meaning [word]\n\nFor example: /meaning love`;
  bot.sendMessage(chatId, message);
});

// '/meaning' command handler
bot.onText(/\/meaning (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const word = match[1];

  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = response.data[0];

    if (data && data.meanings && data.meanings.length > 0) {
      const meanings = data.meanings.map(meaning => {
        const partOfSpeech = `*${meaning.partOfSpeech}*`;
        const definitions = meaning.definitions.map(def => `- ${def.definition}`).join('\n');
        const example = meaning.definitions[0].example;
        return `${partOfSpeech}:\n${definitions}\n\nExample: ${example} ✨`;
      });

      const message = `Meaning of '${word}':\n\n${meanings.join('\n\n')}`;
      bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    } else {
      bot.sendMessage(chatId, 'No meanings found for the given word.');
    }
  } catch (error) {
    bot.sendMessage(chatId, 'An error occurred while fetching the meaning. Please try again later.');
  }
});

// '/developer' command handler
bot.onText(/\/developer/, (msg) => {
  const chatId = msg.chat.id;
  const link = 'https://harshitethic.in';

  bot.sendMessage(chatId, `Developer: [Harshit Ethic](${link})`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[{ text: 'Developer', url: link }]],
    },
  });
});
