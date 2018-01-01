var express=require('express');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
var mysql = require('mysql');
var session=require('express-session');
var http=require('http');

var toonavatar = require('cartoon-avatar');

//var $ = require('jquery');



app.set('view engine', 'ejs');// render engine setting


var cookieParser = require('cookie-parser');
 
var flash = require('connect-flash');

  app.use(flash());



//app.use(express.bodyparser()); 
//app.use(bodyParser.urlencoded());


app.use(bodyParser.json()); // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded());

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser());


app.use(session({secret:"7i6dadkjfhdjmhsjfh",resave:false,saveUninitialized:true}))



var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs"
});

//app.use(express.static(__dirname + '/files'));



app.get('/admin',function(req,res)
{

	res.sendFile('admin.html',{root:path.join(__dirname,'./files')});

});




app.get('/',function(req,res)
{
	if(req.session.user)
	{
		res.redirect('/home');
}

res.sendFile('register.html',{root:path.join(__dirname,'./files')});

});

app.post('/',function(req,res)
{
	
	var regusername=req.body.regusername;
	var regemail=req.body.regemail;
	var regaddress=req.body.regaddress;
	var regmobileno=req.body.regmobileno;
	var regpassword=req.body.regpassword;
	var passwordconfirm=req.body.passwordconfirm;

  // req.session.reg_username=regusername;
  // req.session.reg_email=regemail;
  // req.session.reg_address=regaddress;
  // req.session.reg_mobileno=regmobileno;
  // req.session.reg_password=regpassword;
  // req.session.reg_confirmpassword=passwordconfirm;





  console.log("Connected to database!");
  var sql = "INSERT INTO register(username,email,address,mobileno,password,confirmpassword) VALUES ('"+regusername+"','"+regemail+"','"+regaddress+"','"+regmobileno+"','"+regpassword+"','"+passwordconfirm+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
   
    console.log("1 record inserted");
    res.redirect('/login');
   


    	

  });
//});

});

//app.use('/login',express.static(__dirname+'/files'));


app.get('/login',function(req,res)
{
	if(req.session.user){
	res.redirect('/home');
}

res.sendFile('login.html',{root:path.join(__dirname,'./files')});

});


app.post('/loginaction',function(req,res)
{

	//res.sendFile('admin.html',{root:path.join(__dirname,'./files')});
	var loginemail=req.body.loginemail;
	var loginpassword=req.body.loginpassword;

	//con.connect(function(err) {
  //if (err) throw err;
  console.log(" Connected to database! ");
  
  var sql1 = "SELECT * FROM tempregister where email='"+loginemail+"' and password='"+loginpassword+"'";
  con.query(sql1, function (err,result) {
    if (err) throw err;


    
   	
   	//var gets=JSON.stringify(result);
   	//console.log(gets);
   	//console.log(result[0].username);
   	//console.log(result);
  	if(result.length>0)
  	{
   	req.session.user=result[0].username;
   	req.session.getid=result[0].id;
   	req.session.email=result[0].email;
   	req.session.address=result[0].address;
   	req.session.mobileno=result[0].mobileno;
    //console.log("1 record inserted");
    //res.redirect('/login.html');
    
    var url = toonavatar.generate_avatar({"gender":"male","id":req.session.getid});
    console.log(url);
    req.session.getavatarurl=url;
    	res.redirect('/home');}

    	else{
    	
   //  	req.session.getstatus="Username or Password is incorrect";
    	
 	 // req.flash('failed', 'Invalid credentials');
   //          res.locals.message = req.flash();
             
   //          res.render('index.ejs');
   		
   		    	



   		    	res.redirect('/login');
   		    	//return req.flash('message','Invalid credentials');
    	//req.flash('info', 'Flash is back!');

    }

  });
//});



















	

});


app.get('/home',function(req,res){

if(!req.session.user)
{
	//return res.status(401).send();
	res.redirect('/login');
}
// res.writeHead(200, {'Content-Type': 'text/html'});

// res.write('<h1>Welcome</h1><h2>'+req.session.user+'</h2><br>');
// res.write('<a href= '+'/viewprofile'+'>Profile</a>'); 
// res.end('<a href= '+'/logout'+'>Logout</a>');  
//res.end();
res.sendFile('home.html',{root:path.join(__dirname,'./files')});




});

app.get('/homedatas',function(req,res){


var jsondata={};
jsondata["user"]=req.session.user;
jsondata["urlimage"]=req.session.getavatarurl;
//console.log(jsondata);


// res.setHeader('Access-Control-Allow-Origin', 'http://test.com');
//   res.setHeader('Access-Control-Allow-Methods', 'GET');
//console.log(jsondatas);
//res.status(200).json(jsondatas);
//res.json({ user: 'tobi' });
res.json(jsondata);

});
















//app.use('/viewprofile',express.static(__dirname+'/files'));

app.get('/viewprofile',function(req,res){


if(!req.session.user)
{
	//return res.status(401).send();
	res.redirect('/login');
}	


//res.writeHead(200, {'Content-Type': 'text/html'});

//res.write('');
// var jsondatas={};
// jsondatas["name"]=req.session.user;
// jsondatas["email"]=req.session.email;

//res.json(jsondatas);




res.sendFile('viewprofile.html',{root:path.join(__dirname,'./files')});

//res.write('<a href= '+'/logout'+'>Logout</a>');



  });


app.get('/datas',function(req,res){


var jsondatas={};
jsondatas["name"]=req.session.user;
jsondatas["email"]=req.session.email;
jsondatas["address"]=req.session.address;
jsondatas["mobileno"]=req.session.mobileno;

// res.setHeader('Access-Control-Allow-Origin', 'http://test.com');
//   res.setHeader('Access-Control-Allow-Methods', 'GET');
//console.log(jsondatas);
//res.status(200).json(jsondatas);
//res.json({ user: 'tobi' });
res.json(jsondatas);

});















//});






app.get('/logout',function(req,res){

req.session.destroy(function(err){  
        if(err){  
            console.log(err);  
        }  
        else  
        {  
            res.redirect('/login');  
        }  



});

});





app.get('/admin',function(req,res)
{

	res.sendFile('admin.html',{root:path.join(__dirname,'./files')});

});


app.post('/admin',function(req,res)
{

	var adminusername=req.body.adminusername;
  var adminpassword=req.body.adminpassword;
  if(adminusername=="admin"&& adminpassword=="admin")
  {
      res.sendFile('adminview.html',{root:path.join(__dirname,'./files')});
  }
  else
  {
      res.redirect('/admin');
  }


});

app.get('/alluserrequests',function(req,res){

var sql2="SELECT * FROM register";
var alluser=[];

con.query(sql2, function (err,result) {

if(err) throw err;
//var j=0;
for(var i=0;i<result.length;i++)
{
    //j++;
    //console.log(result[i].id);
    //alluser["id"]=result[i].id;
    //alluser[j]=result[i].username;
    //alluser["user"]=result[i].username;
    //console.log(alluser);
    alluser.push({"id":result[i].id,"user":result[i].username});

}
console.log(alluser);
res.json(alluser);

});

});

app.post('/acceptrequest',function(req,res){


 console.log('Accept Id : ' +req.body.acceptid);
 var acceptid=req.body.acceptid;
req.session.acceptid=acceptid;
//var getsd=req.session.mobileno;

var regpassword2='';


 var query1="SELECT * FROM register where id='"+acceptid+"'";

 con.query(query1, function (err, result) {
    if (err) throw err;

    console.log(result[0].username);
    //req.session.regid=result[0].id;
    req.session.regusername1=result[0].username;
  req.session.regemail1=result[0].email;
  req.session.regaddress1=result[0].address;
  req.session.regmobileno1=result[0].mobileno;
   req.session.regpassword1=result[0].password;
  req.session.regconfirmpassword1=result[0].confirmpassword;
  
  console.log('id ' +req.session.acceptid);
  //});



  var query2 = "INSERT INTO tempregister(id,username,email,address,mobileno,password,confirmpassword) VALUES ('"+req.session.acceptid+"','"+req.session.regusername1+"','"+req.session.regemail1+"','"+req.session.regaddress1+"','"+req.session.regmobileno1+"','"+req.session.regpassword1+"','"+req.session.regconfirmpassword1+"')";
  con.query(query2, function (err, result) {
    if (err) throw err;
   
    console.log("'"+req.session.regusername1+"'s request Accepted !!");
    //res.redirect('/login');
   


      

  });
});
//});

var query3 = "DELETE FROM register WHERE id='"+acceptid+"'";

 con.query(query3, function (err, result) {
    if (err) throw err;
   
    console.log("'"+req.session.regusername1+"' removed from temporary register");
    res.redirect('/login');
   


      

  });






});




app.post('/rejectrequest',function(req,res){


 console.log('Reject Id : ' +req.body.rejectid);
 var rejectid=req.body.rejectid;


 var query4="DELETE FROM register WHERE id='"+rejectid+"'";


 con.query(query4, function (err, result) {
    if (err) throw err;
   
    console.log("'"+req.session.reg_username+"'s request rejected !! ");
    res.redirect('/login');
   


      

  });













});




app.listen(8080,function()
{

	console.log("listening at 8080");

});