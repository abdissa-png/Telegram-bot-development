const { Telegraf } = require("telegraf");
const dotenv = require('dotenv')
const fetch = require("node-fetch");
dotenv.config();
const bot = new Telegraf(process.env.TELEGRAM_APIKEY)
const extractMsg = (ctx) => {
    receivedMsg = ctx.message.text.split(" ");
    receivedMsg.shift();
    receivedMsg = receivedMsg.join(" ")
    return receivedMsg;
}
const footballNewsArray = [
    [{ text: "bundesliga", callback_data: "newsbundesliga" }, { text: "eredivisie", callback_data: "newseredivisie" }],
    [{ text: "efl cup", callback_data: "newseflcup" }, { text: "efl trophy", callback_data: "newsefltrophy" }],
    [{ text: "fa cup", callback_data: "newsfacup" }, { text: "europa league", callback_data: "newseuropaleague" }],
    [{ text: "conference league", callback_data: "newsconferenceleague" }, { text: "champions league", callback_data: "newschampionsleague" }],
    [{ text: "laliga", callback_data: "newslaliga" }, { text: "ligue1", callback_data: "newsligue1" }],
    [{ text: "ligaportugal", callback_data: "newsligaportugal" }, { text: "premier league", callback_data: "newspremierleague" }],
    [{ text: "premier division", callback_data: "newspremierdivision" }, { text: "seriea", callback_data: "newsseriea" }]
]
const news = (ctx, league) => {
    ctx.deleteMessage();
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
            'X-RapidAPI-Host': 'football98.p.rapidapi.com'
        }
    };
    fetch(`https://football98.p.rapidapi.com/${league}/news`, options)
        .then(response => response.json())
        .then((response) => {
            //console.log(response);
            let array = [];
            response.forEach(element => {
                array.push([{ text: `${element.Title}`, url: `${element.NewsLink}` }])
            });
            array.push([{ text: "Go back To news menu", callback_data: "go-back" }])
            ctx.reply(
                `Here are the top news`

                , {
                    reply_markup: {
                        inline_keyboard: array
                    }
                })
        })
        .catch(err => console.error(err));
}
bot.hears("saul", (ctx) => {
    ctx.reply('yeah i am that bot');
})
bot.start((ctx) => {
    ctx.reply(`
        This bot can support so far
            1)Chat Gpt answers just ask any 
              question you like and you will
              get answer from chatgpt api
            2)Generate Random /quote by using Martin Svoboda's
              quote api from RapidApi 
            3)A simple /saymyname command that replies
            *Name you entered* you are goddamn right
            4) Football fixtures,results,transfers,news,squad position and information
    `)
})
bot.help((ctx) => {
    ctx.reply("This bot supports the following commands \n 1) /start \n 2) /help \n 3) /saymyname")
});
bot.command('saymyname', (ctx) => {
    receivedMsg = extractMsg(ctx);
    ctx.reply(`${receivedMsg} you are goddamn right`);
})
bot.command('quote', async(ctx) => {
    const response = await fetch('https://quotes15.p.rapidapi.com/quotes/random/', {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
            'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
        }
    })
    const data = await response.json();
    ctx.reply(`
    --${data.originator.name}-- \n
    ${data.content}
    `)
        //console.log(data);
})
bot.command('footballnews', (ctx) => {
    ctx.reply("Choose the league", {
        reply_markup: {
            inline_keyboard: footballNewsArray
        }
    })
});
bot.action('newsbundesliga', (ctx) => {
    news(ctx, 'bundesliga')
});
bot.action('newseredivisie', (ctx) => {
    news(ctx, 'eredivisie')
});
bot.action('newseflcup', (ctx) => {
    news(ctx, 'emiratescup')
});
bot.action('newsefltrophy', (ctx) => {
    news(ctx, 'efltrophy')
});
bot.action('newsfacup', (ctx) => {
    news(ctx, 'facup')
});
bot.action('newseuropaleague', (ctx) => {
    news(ctx, 'europaleague')
});
bot.action('newsconferenceleague', (ctx) => {
    news(ctx, 'europaconferenceleague')
});
bot.action('newschampionsleague', (ctx) => {
    news(ctx, 'championsleague')
});
bot.action('newslaliga', (ctx) => {
    news(ctx, 'laliga')
});
bot.action('newsligue1', (ctx) => {
    news(ctx, 'ligue1ubereats')
});
bot.action('newsligaportugal', (ctx) => {
    news(ctx, 'ligaportugal')
});
bot.action('newspremierleague', (ctx) => {
    news(ctx, 'premierleague')
});
bot.action('newspremierdivision', (ctx) => {
    news(ctx, 'premierdivision')
});
bot.action('newsseriea', (ctx) => {
    news(ctx, 'seriea')
});
bot.action('go-back', (ctx) => {
    ctx.deleteMessage();
    ctx.reply('Choose the league', {
        reply_markup: {
            inline_keyboard: footballNewsArray
        }
    })
})
bot.on('sticker', (ctx) => {
    ctx.reply("yeah sticker");
})
bot.on('message', async(ctx) => {
    receivedMsg = extractMsg(ctx);
    const response = await fetch('https://gptClone-2zgb.onrender.com', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt: receivedMsg
        })
    })
    const { bot } = await response.json();
    //console.log(bot);
    if (bot.length < 4096) {
        ctx.reply(bot);
    } else {
        index = 0;
        while (index < bot.length) {
            ctx.reply(bot.slice(index, index + 4096));
            index += 4096
        }
    }

})



bot.launch();