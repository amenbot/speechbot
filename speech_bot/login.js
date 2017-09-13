var builder = require('botbuilder');
var count=0;

module.exports = [
    // USERNAME
    function (session) {
	session.send('Welcome to the Login!');
        builder.Prompts.text(session, 'Enter Username');
    },
    function (session, results, next) {
        session.dialogData.username = results.response;
        //session.send('Username %s', session.dialogData.username);
        next();
    },
	 // PASSWORD
    function (session) {
        builder.Prompts.text(session, 'Enter Password');
    },
    function (session, results, next) {
        session.dialogData.password = results.response;
        //session.send('Password %s', session.dialogData.password);
        next();
    },
	function (session,next) 
   { 
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
count=0;
// Create connection to database
var config = 
   {
     userName: 'admin123', // update me
     password: 'nodeBot123', // update me
     server: 'nodepeechbot.database.windows.net', // update me
     options: 
        {
           database: 'userrolesdb' //update me
           , encrypt: true
        }
   }
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) 
   {
     if (err) 
       {
          console.log(err)
       }
    else
       {
          console.log('Reading rows from the Table...');

       // Read all rows from table
     request = new Request(
            "select id from users where username='"+session.dialogData.username+"' and userpassword='"+session.dialogData.password+"'",
		
			function(err, rowCount, rows) 
                {
					count=rowCount;
					if(count>0)
					session.privateConversationData['login'] = true;
					userlogin(session);
					session.endDialog();
                    console.log(count + ' row(s) returned');
                   // process.exit();
                }
            );
     request.on('row', function(columns) {
        columns.forEach(function(column) {	
			//session.send(column.metadata.colName+' ---- '+column.value);
            console.log('columns  '  + columns.rowCount);

			//session.send('moved out of db1');
			
         });

             });

    connection.execSql(request);
       }
   }
 );
   	
   }
]
function userlogin(session) {
		if(session.privateConversationData['login'] == true)
		{
		session.send('Login Successful');
		}
		else{
		session.send('Login failed');
		}
}