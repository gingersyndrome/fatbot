const Discord = require('discord.js')
const aws = require('aws-sdk');
const bot = new Discord.Client()
const Path = require('path')
const genChannelID = '651155522833350679' //ID of channel that image will be posted to
const testChannelID = '813996243377586197' //not used
const targetDayIndex = 5 //set this to the day the image should be posted on Monday = 1, Tuesday = 2, ect.
const currentDayIndex = new Date().getDay() //get the current day's index

const randMin = 0 //minimum for posting timer
const randMax = 86400000 //set this, maximum for posting timer in miliseconds, 86400000 miliseconds in 24 hours
const checkDayTimer = 1800000 //set this, time for check timer in miliseconds, 1800000 miliseconds in 0.5 hours

posted  = false;

let countOne = new aws.S3({
  accessKeyId: process.env.counterOne,
});

let countTwo = new aws.S3({
  accessKeyId: process.env.counterTwo,
});

///////////////////////////////////////////////////////////////////

bot.on('ready', () => {
  console.log('Bot is ready.')
  checkDay() //check the day and begin the recursive loop
})

bot.on('correctDay', () => { //event to execute when timer expires on the correct day
  bot.channels.cache.get(genChannelID).send('It is Fat Fuck Friday.', {files: [Path.join(__dirname, 'itshim.jpg')]}) //post itshim.jpg from the same directory as the .js file
})

bot.on('message', msg => {
  messageMutable = msg.toString().replace(/[^a-zA-Z]/g,'').toLowerCase()  //remove all spaces and special characters and convert to lowercase
  mentionsBot = (msg.mentions.users.has(bot.user.id) || /fatbot/g.test(messageMutable) || /fatfuck/g.test(messageMutable)) && (!msg.author.bot) //bool that determines if the bot has been mentioned in the last message
  
  console.log(messageMutable) //output the sanitized message
  console.log(mentionsBot) //outputs if bot was mentioned
  
  if (mentionsBot)  { 
    //if the bot is mentioned add one to mention counter for each mention
    countOne += (msg.toString().match(bot.user.id) || []).length
    countOne += (messageMutable.toString().match(/fatbot/g) || []).length
    countOne += (messageMutable.toString().match(/fatfuck/g) || []).length
  }

  if (mentionsBot && /praise/g.test(messageMutable))  { 
    //if the bot is mentioned and the word 'praise' appears in the message output the number of mentions
    msg.reply('Praise counter: ' + countOne)
  }

  if (mentionsBot && /fortune/g.test(messageMutable)) { 
    //this sin't done yet how embarassing
    msg.reply('That is not done yet. How embarassing.')
  }

  if ((/pablosgirlfriend/g.test(messageMutable) ||/callie/g.test(messageMutable)) && /ornithologist/g.test(messageMutable))  { 
    //if the words pablosgirlfriend, callie, and ornithologist appear in the same message iterate and output girlfriend counter
    process.env.counterTwo++
    msg.reply('Girlfriend counter: ' + countTwo)
  }
})






///////////////////////////////////////////////////////////////////

function checkDay(){

  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  targetDay = days[targetDayIndex] //index of the day when the bot posts
  currentDay = days[currentDayIndex] //today's index
 
 if (currentDay != targetDay){ //if it's not the target day output current config and reset posted bool
    posted = false;
    console.log(`Your event will execute on ${targetDay}. It is currently ${currentDay}.`)
 }
 else if (currentDay == targetDay && posted == false){
   //if it's the target day and the image has not been posted set a random timer to emit the correctDay event
    setTimeout(sendImageEvent, getRandomInt(randMin, randMax))
    console.log(`Timer set to emit ${currentDay} between ${randMin/1000/60} and ${randMax/1000/60} minutes from now.`)
  }
  else{
    //if the image has already been posted output to the console
    console.log('The image has already been sent today. Counter will restart tomorrow.')
  }

  setTimeout(checkDay, checkDayTimer)
  if (checkDayTimer <= 60000){ //if the day checking timer is in seconds
    console.log(`Timer set to check the day in ${checkDayTimer/1000} seconds.`)
  }
  else if (checkDayTimer <= 3600000 && !(checkDayTimer <= 60000)){ //if the day checking timer is in minutes
    console.log(`Timer set to check the day in ${checkDayTimer/1000/60} minutes.`)
  }
  else if (checkDayTimer <= 86400000 && !(checkDayTimer <= 60000) && !(checkDayTimer <= 3600000)) { //if the day checking timer is in hours
    console.log(`Timer set to check the day in ${checkDayTimer/1000/60/60} hours.`)
  }
  else { //if the day checking timer is invalid
    console.log(`Interval selected exceeds 24 hours. Please select another interval by modifying the checkDayTimer variable.`)
  }
}

function getRandomInt(min, max) { //random number generator
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}

function sendImageEvent (){ //emits the correctDay event and sets posted to true
  if (posted == false){
    bot.emit('correctDay')
    console.log('Image sent!')
  } 
  posted = true;
}

bot.login(process.env.fatBotToken) //shh this is a secret password :)