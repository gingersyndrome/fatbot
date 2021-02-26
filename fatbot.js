////////////////////////////////API-STUFF/////////////////////////////////
//const aws = require('aws-sdk'); //put this in if you need aws features
//const testChannelID = '813996243377586197' //not used
const Discord = require('discord.js')
const bot = new Discord.Client()
const Path = require('path')

/////////////////////////DO-NOT-CHANGE-VARIABLES//////////////////////////
counterOne = 0 //first counter
counterTwo = 0 //second counter

//////////////////////CONFIG-VARIABLES//////////////////////
//add one for botname and message for both counters
const genChannelID = '651155522833350679' //set this, ID of channel that image will be posted to
const targetDayIndex = 5 //set this, to the day the image should be posted on Monday = 1, Tuesday = 2, ect.
const messageToSend = 'It is Fat Fuck Friday.' //set this, message to send when the timer expires
let imageFileName = ['imageOne.jpg', 'imageTwo.jpg', 'imageThree.jpg', 'imageFour.jpg', 'imageFive.jpg',
'imageSix.jpg', 'imageSeven', 'imageEight', 'imageNine', 'imageTen'] //set this, image to post when the timer expires
const randMax = 43200000 //set this, maximum for posting timer in miliseconds, 86400000 miliseconds in 24 hours, set to 0 to post immediately when it is the correct day 
const randMin = 0 //minimum for posting timer, probably no reason to set
const checkDayTimer = 1800000 //set this, time for check timer in miliseconds, 1800000 miliseconds in 0.5 hours

///////////////////////////////LISTENERS/////////////////////////////////
bot.on('ready', () => {
  console.log('Bot is ready.')
  posted  = false //set bool for if the image has been posted
  checkDay() //check the day and begin the recursive loop
})

bot.on('correctDay', () => { //event to execute when timer expires on the correct day
  randIndex = getRandomInt(1, 10) //randomly choose an image to post
  bot.channels.cache.get(genChannelID).send(messageToSend, {files: [Path.join(__dirname, imageFileName[randIndex])]}) //post image from the same directory as the .js file
  checkDay();
})

bot.on('message', msg => {
  messageMutable = msg.toString().replace(/[^a-zA-Z]/g,'').toLowerCase()  //remove all spaces and special characters and convert to lowercase
  mentionsBot = (msg.mentions.users.has(bot.user.id) || /fatbot/g.test(messageMutable) || /fatfuck/g.test(messageMutable)) && (!msg.author.bot) //bool that determines if the bot has been mentioned in the last message
  
  console.log(`SANITIZED MESSAGE: ${messageMutable}`) //output the sanitized message
  console.log(mentionsBot ? 'Bot was mentioned.' : 'Bot was not mentioned.') //outputs if bot was mentioned
  
  if (mentionsBot)  { 
    //if the bot is mentioned add one to mention counter for each mention
    counterOne += (msg.toString().match(bot.user.id) || []).length
    counterOne += (messageMutable.toString().match(/fatbot/g) || []).length
    counterOne += (messageMutable.toString().match(/fatfuck/g) || []).length
  }

  if (mentionsBot && /praise/g.test(messageMutable))  { 
    //if the bot is mentioned and the word 'praise' appears in the message output the number of mentions
    msg.reply('Praise counter: ' + counterOne)
  }

  if (mentionsBot && /fortune/g.test(messageMutable)) { 
    //this sin't done yet how embarassing
    msg.reply('That is not done yet. How embarassing.')
  }

  if ((/pablosgirlfriend/g.test(messageMutable) ||/callie/g.test(messageMutable)) && /ornithologist/g.test(messageMutable))  { 
    //if the words pablosgirlfriend, callie, and ornithologist appear in the same message iterate and output girlfriend counter
    counterTwo++
    msg.reply('Girlfriend counter: ' + counterTwo)
  }
})

/////////////////////////////FUNCTIONS////////////////////////////////////
function checkDay(){
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  currentDayIndex = new Date().getDay() //reset current day index
  
  targetDay = days[targetDayIndex] //index of the day when the bot posts
  currentDay = days[currentDayIndex] //today's index
 
 if (currentDay != targetDay){ //if it's not the target day output current config and reset posted bool
    posted = false;
    setTimeout(checkDay, checkDayTimer)
    console.log(`Your event will execute on ${targetDay}. It is currently ${currentDay}.`)
    outputInterval();
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
}

function outputInterval(){
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

function sendImageEvent (){ //emits the correctDay event and sets posted to true
  if (posted == false){
    bot.emit('correctDay')
    console.log('Image sent!')
  } 
  posted = true;
}

function getRandomInt(min, max) { //random number generator, the maximum is exclusive and the minimum is inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min)
}

//////////////////////////////////////AUTHENTICATION///////////////////////
bot.login(process.env.fatBotToken) //shh this is a secret password :)