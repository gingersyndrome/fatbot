const Discord = require('discord.js')
const bot = new Discord.Client()
const Path = require('path')
const genChannelID = '651155522833350679'
const testChannelID = '813996243377586197'
const targetDayIndex = 5 //set this
const currentDayIndex = new Date().getDay()

currentDayIndex.set
const randMin = 0
const randMax = 86400000 //set this, 86400000 miliseconds in 24 hours
const checkDayTimer = 1800000 //set this, 1800000 miliseconds in 0.5 hours

posted  = false;
fucker = 0;
gf = 0;

///////////////////////////////////////////////////////////////////

bot.on('ready', () => {
  console.log('Bot is ready.')
  checkDay()
})

bot.on('correctDay', (message) => { //event to execute when timer expires on the correct day
  bot.channels.cache.get(genChannelID).send('It is Fat Fuck Friday.', {files: [Path.join(__dirname, 'itshim.jpg')]}) //C:\Users\James\fat-fuck-bot\itshim.jpg
})

bot.on('message', msg => {
  msg = msg.replace(/[^a-zA-Z ]/g,"").replace(/\s/g, "").toLowerCase()  //remove all spaces and special characters and convert to lowercase
  mentionsBot = (msg.mentions.users.has(bot.user.id) || /fatbot/g.test(msg) || /fatfuck/g.test(msg)) && (!msg.author.bot)
  console.log(msg)
  if (mentionsBot)  {
    fucker += (msg.toString().match(bot.user.id) || []).length
    fucker += (msg.toString().match(/fatbot/g) || []).length
    fucker += (msg.toString().match(/fatfuck/g) || []).length
  }

  if (mentionsBot && /praise/g.test(msg))  {
    msg.reply('Praise counter: ' + fucker)
  }

  if (mentionsBot && /fortune/g.test(msg)) {
    msg.reply('That is not done yet. How embarassing.')
  }

  if ((/pablosgirlfriend/g.test(msg) ||/callie/g.test(msg)) && /ornithologist/g.test(msg))  {
    gf++
    msg.reply('Girlfriend counter: ' + gf)
  }
})


///////////////////////////////////////////////////////////////////

function checkDay(){

  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  targetDay = days[targetDayIndex]
  currentDay = days[currentDayIndex]
 
 if (currentDay != targetDay){
    posted = false;
    console.log(`Your event will execute on ${targetDay}. It is currently ${currentDay}.`)
 }
 else if (currentDay == targetDay && posted == false){
    setTimeout(sendImageEvent, getRandomInt(randMin, randMax))
    console.log(`Timer set to emit ${currentDay} between ${randMin/1000/60} and ${randMax/1000/60} minutes from now.`)
  }
  else{
    console.log('The image has already been sent today. Counter will restart tomorrow.')
  }

  setTimeout(checkDay, checkDayTimer)
  if (checkDayTimer <= 60000){
    console.log(`Timer set to check the day in ${checkDayTimer/1000} seconds.`)
  }
  else if (checkDayTimer <= 3600000 && !(checkDayTimer <= 60000)){
    console.log(`Timer set to check the day in ${checkDayTimer/1000/60} minutes.`)
  }
  else if (checkDayTimer <= 86400000 && !(checkDayTimer <= 60000) && !(checkDayTimer <= 3600000)) {
    console.log(`Timer set to check the day in ${checkDayTimer/1000/60/60} hours.`)
  }
  else {
    console.log(`Interval selected exceeds 24 hours. Please select another interval by modifying the checkDayTimer variable.`)
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}

function sendImageEvent (){
  if (posted == false){
    bot.emit('correctDay')
    console.log('Image sent!')
  } 
  posted = true;
}

bot.login('ODEzMTQ5NjgxNTIxMzkzNzQ1.YDLGpw.yePgM4N2_c0KWqjBHOugcQ5i5HY')