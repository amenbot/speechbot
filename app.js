// test Update on GitHub from Desktop
var restify = require('restify');
var builder = require('botbuilder');
var spellService = require('./spell-service');
var Twit =  require('twit');
var sentimentAnalysis = require('sentiment-analysis');
// Setup Restify Server *
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 80 || 81, function () {
   console.log('%s listening to %s', server.name, server.url);
});
 
var T = new Twit({
    consumer_key:'3UGIAbZhkun2Vgkw9iLx04ddo',
    consumer_secret:'sexAzr9gA1lZnkr8mxsltIHTu3NgQ4jdFBYOg0Vw4EGIkY1TWD',
    access_token:'1722061238-gGZDLo4h7bX7XnAJPQXTBmEmxUfRRgqHyiTi85c',
    access_token_secret:'ThU8SyhWgtb16DJ54f0q2GnU1fwWkC01TmvZoGG6okmRN',
  });
// Create chat bot
var connector = new builder.ChatConnector({
   appId: '5d36ba4d-2a22-4d77-87ab-79ec2a0f663b',
   appPassword: 'V6PEscp8pzRN7RWQrkeCowf'
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    var card = createHeroCard(session);
    // attach the card to the reply message
    var msg = new builder.Message(session).addAttachment(card);
    session.send(msg);
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
	SendMailUsingNodeMailer(session,session.message.text);
	
});

bot.dialog('login', require('./login'));
//Create LUIS recognizer that points at our model and add it as the root '/' dialog.
var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/65942006-f24a-43a6-a94f-7f6501b8b6b0?subscription-key=e5565127236f454d88f4e5dd7c20b427&timezoneOffset=0&verbose=true&spellCheck=true&q=');/*here we use the URL that we copied earlier*/
bot.recognizer(recognizer);

// Spell Check
if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
    bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(function (text) {
                    session.message.text = text;
                    next();
                })
                .catch(function (error) {
                    console.error(error);
                    next();
                });
        }
    });
}
bot.dialog('olympics', function (session,args) {
  var yearentity = builder.EntityRecognizer.findEntity(args.intent.entities, 'year');
   session.privateConversationData['year']=yearentity.entity;
   session.send('Year: '+session.privateConversationData['year']);
   getcity(session);
    session.endDialog();
    }).triggerAction({
    matches: 'olympics'
});
bot.dialog('host', function (session,args) {
	var card = createHeroCard2(session);
    // attach the card to the reply message
    var msg = new builder.Message(session).addAttachment(card);
    session.send(msg);
    session.endDialog();
    }).triggerAction({
    matches: 'host'
});
bot.dialog('Help', function (session) {
    session.send('Hi! Welcome to BOTLAND');
    session.endDialog();
    }).triggerAction({
    matches: 'Help'
});
bot.dialog('security model', function (session) {
    //session.send('Security measures currently implemented guarantee full compliance to all requirements related to Data Confidentiality, Integrity and Availability.');
    session.beginDialog('login');
    }).triggerAction({
    matches: 'security model'
});
bot.dialog('datacenters', function (session) {
    session.send('We have 7 datacenters in the world.');
    session.endDialog();
    }).triggerAction({
    matches: 'datacenters'
});
bot.dialog('location datacenters', function (session) {
    session.send('They are located in Africa, Asia, Europe, and America');
    session.endDialog();
    }).triggerAction({
    matches: 'location datacenters'
});
bot.dialog('limit size', function (session) {
    session.send('The limit per attachment is 50 Mb.');
    session.endDialog();
    }).triggerAction({
    matches: 'limit size'
});

bot.dialog('create message', function (session) {
    session.send('To create a message, go to your email, then click on new message.');
    session.endDialog();
    }).triggerAction({
    matches: 'create message'
});
bot.dialog('platform manager', function (session) {
    session.send('He is Alex Ross..');
    session.send('Located in France (Paris)');
    session.send('You can send call him on 1348888');
    session.endDialog();
    }).triggerAction({
    matches: 'platform manager'
});
bot.dialog('paris', function (session) {
    session.send('Paris is located in France');
    session.endDialog();
    }).triggerAction({
    matches: 'paris'
});

bot.dialog('Thankyou',[
    function(session)
    {
        session.send('Pleasure is all mine')
	    session.send('Have a good day')
    }
]).triggerAction({
    matches:'Thankyou'
})

bot.dialog('Age',[
    function(session)
    {
        session.send('Im 1 year old and still in learning process')
    }
]).triggerAction({
    matches:'Age'
})
bot.dialog('Abusive',[
    function(session)
    {
        session.send('Kindly choose appropriate language','your language.....!!!')    
    }
]).triggerAction({
    matches:'Abusive'
})
bot.dialog('Fine',[
    function(session)
    {
        session.send('Im Good,Thankyou')
        session.send('How i can help you?')    
    }
]).triggerAction({
    matches:'Fine'
})
bot.dialog('Capital France', function (session) {
    session.send('The Capital of France is Paris');
    session.endDialog();
    }).triggerAction({
    matches: 'Capital France'
});
bot.dialog('Encrypt Data', function (session) {
    session.send('Yes, all interactions between users and the server are carried out in encrypted mode (https)');
    session.endDialog();
    }).triggerAction({
    matches: 'Encrypt Data'
});
bot.dialog('SSL certificates', function (session) {
    session.send('Yes, adopts SSL server certificates with strong encryption (256-bit)');
    session.endDialog();
    }).triggerAction({
    matches: 'SSL certificates'
});
bot.dialog('SSL guarantee', function (session) {
    session.send('the SSL certificates guarantees the confidentiality of the link, the authentication and the reliability');
    session.endDialog();
    }).triggerAction({
    matches: 'SSL guarantee'
});
bot.dialog('OWASP guidelines', function (session) {
    session.send('Yes. All the application security measures usually found in a Web Application Firewall are implemented at the application level following OWASP guidelines for secure application development.');
    session.endDialog();
    }).triggerAction({
    matches: 'OWASP guidelines'
});
bot.dialog('OWASP guidelinehelp', function (session) {
    session.send('This ensures a secure application development :');
    session.send('•	Insecure HTTP methods');
    session.send('• Cacheable Headers');
    session.send('•	Autocomplete');
    session.send('•	Broken authentication and Session management');
    session.send('•	Cross Site Scripting');
    session.send('•	Insecure direct object references');
    session.send('• Sensitive data exposure')
    session.send('• Missing function level access control')
    session.send('• Cross site request forgery')
    session.send('• Injection')
    session.send('• Connection Limit')
    session.send('• Denial of Service')
    session.endDialog();
    }).triggerAction({
    matches: 'OWASP guidelinehelp'
});
bot.dialog('chatbotCreation', function (session) {
    session.send('Before we get started, I would highly recommend downloading the Bot Framework Emulator. This emulator will be used to talk to the bot before we are ready to publish. You will of course also need NodeJS/NPM installed.');
    session.endDialog();
    }).triggerAction({
    matches: 'chatbotCreation'
});
bot.dialog('botbuilder', function (session) {
    session.send('it is the core Microsoft Bot Framework.');
    session.endDialog();
    }).triggerAction({
    matches: 'botbuilder'
});

bot.dialog('Luis', [
    function(session,args,next){
       session.dialogData.profile=args ||{};
       var account;
        if (!session.dialogData.profile.account){
            builder.Prompts.text(session,"Do you have Luis Account?");
        } else {
            next();
        }},
        function(session,results,next){
            var account;
            var learn;
            account=String(results.response.toLowerCase());
    if (account=='yes'){
        session.send('The key concepts on how LUIS works are based on Intents , Entities & Utterances')
       if (!session.dialogData.profile.learn){
            builder.Prompts.text(session,'Can you tell me what do you topic you want to learn Intents , Entities or Utterances')
            }
        else{
            next();
        }}
    else{
        session.endDialog();
    }},
    function (session,results,next){
            var learn;
            var detail;
            learn=String(results.response.toLowerCase());
        if (learn=='intents'){
        session.send('Intents are the verbs that one can find in a sentence, they are the actions that user wants bot to perform.')
        if (!session.dialogData.profile.detail){
            builder.Prompts.text(session,'need more details?')
        }
        else{
            next();
        }}
        if (learn=='entities'){
        session.send('If intents are actions then entities are nouns related to those actions.')
        if (!session.dialogData.profile.detail){
            builder.Prompts.text(session,'need more details?')
        }
        else{
            next();
        }}
        
        if (learn=='utterances'){
        session.send('Utterances are the sample queries that luis uses to train itself. The more the utterances the more accurately LUIS will be able to predict the topic to be called.')
        if (!session.dialogData.profile.detail){
            builder.Prompts.text(session,'need more details?')
        }
        else{
            next();
        }
         
     }
}
    ,
    function (session,results,next){
        var res;
        var explain;
        res=String(results.response.toLowerCase());
        console.log(res);
        if(res='yes'){
          if (!session.dialogData.profile.explain){
            builder.Prompts.text(session,'Do you want to learn more about Intents Entities OR Utterance?')
            }
        else{
            next();
        }}  
    },
        function (session,results,next){
        var res;
        res=String(results.response.toLowerCase());
        if (res=='intents'){
        session.send('Intents are the verbs that one can find in a sentence, they are the actions that user wants bot to perform. There can be multiple ways of performing the same action that’s where Intents come in act. For example, openDoor, turnLightOn. These are the general topics on which you want to build your necessary LUIS structure. It is therefore, important to initially sketch out the key topics that your bot will cover. In this demo, we created an openDoor & turnLightsOn intent')
    }
         if (res=='entities'){
          session.send("If intents are actions then entities are nouns related to those actions. E.g. “bedroom” or “kitchen”. Entities are key data in your application’s domain. An entity, also called entity type, represents a class including a collection of similar objects (places, things, people, events or concepts). Entities describe information relevant to the intent, and sometimes they are essential for your app to perform its task. For convenience, we added a custom entity “room”")
}
  if (res=='utterances'){
          session.send("Utterances are the sample queries that luis uses to train itself. The more the utterances the more accurately LUIS will be able to predict the topic to be called. They can be sentences as in “Can you kindly turn on the lights in kitchen” or “open the door of garage” etc. They can also be words, it’s not necessary that utterances have to be well-formed. They can be words either but it is always good practice to provide detailed sample query.")

  }
        session.endDialog();
}
        
  
]).triggerAction({
    matches:'Luis'
})

bot.dialog('tweets',[
    function(session,args,next){
        session.dialogData.profile=args ||{};
        var params;
         if (!session.dialogData.profile.params){
             builder.Prompts.text(session,"What would you like to know using Twitter?");
         } else {
             next();
         }},
 function(session,results,next){
     if (results.response){
         //session.dialogData.profile.params=results.response;   
         }
    var params= {q: results.response,
     count: 15}
         T.get('search/tweets',params, gotdata);
             function gotdata (err, data, response) 
             {
                var tweet = data.statuses;
                 for(var i=0; i < tweet.length; i++)
                 {
                session.send(tweet[i].text);
                var k=sentimentAnalysis(tweet[i].text);
                var j=0;
                 j=j+k;
                session.send(String(k));
                
                 }
                if(j>0){
                    session.send('Trend is Positive')
                }
                if(j<0){
                    session.send('Trend is negative')
                }
                else{
                    session.send('Insufficient Information on Twitter')
                }
             
             }
    session.endDialog();
 }
 ]).triggerAction({
     matches:'tweets'
 })



function SendMailUsingNodeMailer(session,txt){
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nodespeechbot@gmail.com',
    pass: 'amenbot2017'
  }
});

var mailOptions = {
  from: 'nodespeechbot@gmail.com',
  to: 'amen_bot@outlook.com',
  subject: 'Email send using Node.js',
  text: 'I couldn\'t Understand question asked by user : '+txt
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
	session.send('Email sent failed ');
  } else {
	session.send('Email sent to : amen_bot@outlook.com');
    //session.send('Email sent: ' + info.response);
  }
});
}
function createHeroCard(session) {
    return new builder.HeroCard(session)
        .title('BotFramework Hero Card')
        .subtitle('Your bots — wherever your users are talking')
        .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
        .images([
            builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework/', 'Get Started')
        ]);
}
function createHeroCard2(session) {
    return new builder.HeroCard(session)
        .title('Cities')
        .subtitle('Olympics host cities')
        .text('')
        .images([
            builder.CardImage.create(session, 'https://cdn3.vox-cdn.com/assets/4645821/world_cup_hosts__1_.png')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://en.wikipedia.org/wiki/List_of_Olympic_Games_host_cities', 'Host Cities')
        ]);
}
function getcity(session) 
   { 
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
// Create connection to database
var config = 
   {
     userName: 'admin123', // update me
     password: 'nodeBot123', // update me
     server: 'nodepeechbot.database.windows.net', // update me
     options: 
        {
           database: 'userdb' //update me
           , encrypt: true
        }
   }
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) 
   {
     if (err) 
       {
          console.log(err);
       }
    else
       {
          console.log('Reading rows from the Table...');

       // Read all rows from table
     request = new Request(
	"select city from Olympics where year='"+session.privateConversationData['year']+"'",
		
			function(err, rowCount, rows) 
                {
					if(rowCount>0)
						{
							//showSlowPcConfirmationCard(session);
						}
					else
                       { session.send('Result Not Found');
                        SendMailUsingNodeMailer(session,session.message.text);}
					//session.endDialog();
                    console.log(rowCount + ' row(s) returned');
                }
            );
     request.on('row', function(columns) {
        columns.forEach(function(column) {	
		
            //console.log('columns  '  + columns.rowCount);
			session.send('City: '+column.value);
			
         });
             });
    connection.execSql(request);
       }
   }
 );
   	
   }




