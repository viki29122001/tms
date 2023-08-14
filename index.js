const multer = require('multer');
  const con = require("./connection/connection")
  var bodyParser=require('body-parser');
  const { name } = require("ejs");
  var express= require('express');
  var app = express().use(express.static(__dirname + '/'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set('view engine', 'ejs');

  const cors = require('cors');
  app.use(cors());
  app.use("/upload", express.static(__dirname + '/public/upload'));

  const { uplaod_profile } = require("./upload");
  app.use(uplaod_profile);

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, callback) => {
        const customFilename = Date.now() + path.extname(file.originalname);
        callback(null, customFilename);
    }
});

const upload = multer({ storage: storage }); // Set up multer with the storage configuration

// Middleware to serve static files
app.use(express.static('public'));

// Route to serve HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});







  const PORT = 8080;
  const path = require('path');

  var session = require('express-session');
  const { log } = require("util");


  app.use(
    session({
      secret: 'secret', // Replace this with a secret key for session encryption
      resave: true,
      saveUninitialized: true,
    })
  );

  console.log("Hello world!");
      
  app.get('/a_admin', function(req, res,next){

      res.sendFile(__dirname+ '/admin/a_admin.html');
      console.log("get the request for a_admin......");
      
    
  });

  //Create Admin//
  app.post('/a_admin', function(req, res, next){
      var username=req.body.username;
      var email=req.body.email;
      var password=req.body.password;
      var confirmpassword=req.body.confirmpassword;
      

      if (!/\S+@\S+\.\S+/.test(email)) {
          res.status(400).send("Please enter a valid email address.");
          return;
        }
      
        // Check if the passwords match.
        if (password !== confirmpassword) {
          res.status(400).send("Passwords do not match.");
          return;
        }
      

  
    var sql = "INSERT INTO admin( username, email, password) VALUES ('"+username+"', '"+email+"','"+password+"')";
    con.query(sql,function (err, result, next) {
      if (err) throw err;
      console.log("New admin Is Added..");
      res.redirect("/a_login");
  });
  });





  //Admin Login//
  app.get('/a_login', function(req, res,next){

      res.sendFile(__dirname+ '/admin/a_login.html');  
      console.log("get the request for a_login......");
  });

  app.post('/a_login', function(req, res,next) {

    
    
    const {username, email, password } = req.body;
      if (email)
      {
      con.query(
          "SELECT * FROM admin WHERE username = ? AND email = ? AND password=?",
          [username,email, password],
          (err, results) => {
            if (err) {
              res.status(404).json(email);
              res.send(err);
            
            }
            
      
            // If the user exists, sign them in.
            if (results.length > 0) {

              const admin = results[0];
              req.session.email=email;
              console.log({email});
              console.log(req.session.email_id = email);
              console.log(req.session);


              req.session.username=username;
              console.log({username});
              console.log(req.session.username_id = username);
              console.log(req.session);
              
              res.redirect("/admin/dashboard");
              
            } else {
              // If the user does not exist, send an error message.
              res.send("Incorrect email or password.");
            }
            
          }
        );
      }
      });





      // Dashboard//
      app.get("/admin/dashboard", function(req, res,next){
        console.log("get the Dashboard");
        
        const username = req.session.username ;
        
        const rows = 'SELECT COUNT(*) AS recordCount FROM user';
        const rows2 = 'SELECT COUNT(*) AS recordCount2 FROM user';
        
      
    
        const recordCount = rows[0].recordCount;
        const recordCount2 = rows2[0].recordCount2;
        
       
        con.query(rows,rows2, function(error, result,next) {
          if(error) req.flash(error);
          console.log(result);
          res.render(__dirname+"/admin/dashboard",{view:result,recordCount,recordCount2,username});
        });   
        
        
    });

  




      /// Create Package///
      app.get('/c_package', function(req, res,next){

        res.sendFile(__dirname+ '/admin/c_package.html');  
        console.log("get the request for Create Package.....");
      });
    
      

      app.post('/c_package', function(req, res) {
 


        // const {pname , ptype } =req.body  

        // console.log( pimage.fieldname + "_" + Date.now() + path.extname(pimage.originalname));
       var pname = req.body.pname;
       var  ptype = req.body.ptype;
       var plocation = req.body.plocation;
       var pprice = req.body.pprice;
       var pfeatures = req.body.pfeatures;
       var pdetails = req.body.pdetails;
       var pimage = req.files[0].filename;

    
    
    
        var sql = "INSERT INTO package(pname, ptype, plocation, pprice, pfeatures, pdetails , pimage) VALUES ('"+pname+"' , '"+ptype+"','"+plocation+"','"+pprice+"','"+pfeatures+"','"+pdetails+"','/upload/"+pimage+"')";

      con.query(sql,function (err, result, next) {
        if (err) throw err;
        console.log("New Package Is Added..");
        res.redirect("/admin/m_package");

        });
      });

      /*app.get('/upload', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'c_package.html'));
    });
    
    
    app.post('/upload', upload.single('image'), (req, res) => {
        res.send('Image uploaded successfully.');
    });*/
    




      app.get("/admin/m_package", function(req, res,next) {
      
        console.log("Get request for package....");
        var sql = "select * from package";
    
        con.query(sql, function(error, result,next) {
          if(error) req.flash(error);
          res.render(__dirname+"/admin/m_package",{view:result});
        });
        
    }); 
    app.get("/admin/update_package", function(req, res) {
    
    
      var sql = "select * from package where id=? ";
      var id = req.query.id;
      var pname = req.query.pname;
      var ptype = req.query.ptype;
      var plocation = req.query.plocation;
      var pprice = req.query.pprice;
      var pfeatures=req.query.features;
      var pdetails = req.query.pdetails;


      con.query(sql,[id], function(err, result) {
        if(err) console.log(err);
        console.log("Task Is  Updated......");
        res.render(__dirname+"/admin/update_package",{view:result});
      });
    });

    app.post("/admin/update_package", function(req, res) {
      var id = req.query.id;
      var pname = req.body.pname;
      var ptype = req.body.ptype;
      var plocation = req.body.plocation;
      var pprice = req.body.pprice;
      var pfeatures=req.body.pfeatures;
      var pdetails = req.body.pdetails;
      
      
      var sql = "update package set  pname=?,ptype=?,plocation=?, pprice=?, pfeatures=?, pdetails=? where id = ? ";
      con.query(sql,[pname,ptype,plocation,pprice,pfeatures,pdetails,id], function(error,result) {
        if(error) console.log(error);
        console.log(" Package Updated Successfully......");
        res.redirect("/admin/m_package");
        
      });
    });


    app.get("/admin/delete_package", function(req, res, next) {
      var id = req.query.id;
      var sql = "delete from package where id = ? ";
      con.query(sql,[id], function(err, result, next) {
        if(err) console.log(error);
        console.log("Package Is Deleted.....");
        res.redirect("/admin/m_package");
      });
    });

    app.get("/admin/m_user", function(req, res,next) {
      const email = req.session.email ;
      console.log("Get request for User....");
      var sql = "select * from user";

      con.query(sql, function(error, result,next) {
        if(error) req.flash(error);
        res.render(__dirname+"/admin/m_user",{view:result,email});
      });
      
  });
    

  app.get("/admin/delete_user", function(req, res, next) {
    var id = req.query.id;
    var sql = "delete from user where id = ? ";
    con.query(sql,[id], function(err, result, next) {
      if(err) console.log(error);
      console.log("User Is Deleted.....");
      res.redirect("/admin/m_user");
    });
  });

  app.get("/admin/m_admin", function(req, res,next) {
    const email = req.session.email ;
    console.log("Get request for User....");
    var sql = "select * from admin";

    con.query(sql, function(error, result,next) {
      if(error) req.flash(error);
      res.render(__dirname+"/admin/m_admin",{view:result,email});
    });
    
});
  

app.get("/admin/delete_admin", function(req, res, next) {
  var id = req.query.id;
  var sql = "delete from admin where id = ? ";
  con.query(sql,[id], function(err, result, next) {
    if(err) console.log(error);
    console.log("User Is Deleted.....");
    res.redirect("/admin/m_admin");
  });
});


  app.get("/admin/m_cbooking", function(req, res,next) {
      
    console.log("Get request for User....");
    var sql = "select * from booking";

    con.query(sql, function(error, result,next) {
      if(error) req.flash(error);
      res.render(__dirname+"/admin/m_cbooking",{view:result});
    });
    
  });

  app.get("/admin/m_enquiries", function(req, res,next) {
      
    console.log("Get request for Manage Enquiries....");
    var sql = "select * from entable";

    con.query(sql, function(error, result,next) {
      if(error) req.flash(error);
      res.render(__dirname+"/admin/m_enquiries",{view:result});
    });
    
  });
  app.get("/admin/delete_enquiries", function(req, res, next) {
    var id = req.query.id;
    var sql = "delete from entable where id = ? ";
    con.query(sql,[id], function(err, result, next) {
      if(err) console.log(error);
      console.log("Enqiries Deleted.....");
      res.redirect("/admin/m_enquiries");
    });
  });

  app.get("/admin/m_issue", function(req, res,next) {
      
    console.log("Get request for Manage Issue....");
    var sql = "select * from problem";

    con.query(sql, function(error, result,next) {
      if(error) req.flash(error);
      res.render(__dirname+"/admin/m_issue",{view:result});
    });
    
  });
  app.get("/admin/delete_feedback", function(req, res, next) {
    var id = req.query.id;
    var sql = "delete from problem where id = ? ";
    con.query(sql,[id], function(err, result, next) {
      if(err) console.log(error);
      console.log("Feedback Deleted.....");
      res.redirect("/admin/m_issue");
    });
  });

  app.get("/admin/subscription", function(req, res,next) {
      
    console.log("Get request for Manage Issue....");
    var sql = "select * from subs";

    con.query(sql, function(error, result,next) {
      if(error) req.flash(error);
      res.render(__dirname+"/admin/subscription",{view:result});
    });
    
  });

  app.get("/admin/delete_subs", function(req, res, next) {
    var id = req.query.id;
    var sql = "delete from subs where id = ? ";
    con.query(sql,[id], function(err, result, next) {
      if(err) console.log(error);
      console.log("Suscriber Deleted.....");
      res.redirect("/admin/subscription");
    });
  });





    //User//

    app.get('/user', function(req, res,next){

      res.sendFile(__dirname+ '/user/a_user.html');
      console.log("get the request for User Sign Up......");
      
    
  });

    app.post('/user', function(req, res, next){
      var username=req.body.username;
      var email=req.body.email;
      var password=req.body.password;
      var confirmpassword=req.body.confirmpassword;

      if (!/\S+@\S+\.\S+/.test(email)) {
          res.status(400).send("Please enter a valid email address.");
          return;
        }
      
        // Check if the passwords match.
        if (password !== confirmpassword) {
          res.status(400).send("Passwords do not match.");
          return;
        }
      

  
    var sql = "INSERT INTO user( username, email, password ) VALUES ('"+username+"', '"+email+"','"+password+"')";
    con.query(sql,function (err, result, next) {
      if (err) throw err;
      console.log("New User Is Added..");
      res.redirect("/user_login");
  });
  });


  app.get('/user_login', function(req, res,next){

    res.sendFile(__dirname+ '/user/user_login.html');  
    console.log("get the request for User Login......");
  });

  app.post('/user_login', function(req, res,next) {
    const { email, password } = req.body;
    con.query(
        "SELECT * FROM user WHERE email = ? AND password = ?",
        [email, password],
        (err, results) => {
          if (err) {

            res.send(err);
          
          }
          
    
          // If the user exists, sign them in.
          if (results.length > 0) {
            req.session.email=email;
              console.log({email});
              console.log(req.session.user_email = email);
              console.log(req.session);
            req.user = results[0];
            res.redirect("/user/udashboard");
            
          } else {
            // If the user does not exist, send an error message.
            res.send("Incorrect email or password.");
          }
          
        }
      );
    });
    
    app.get('/user/udashboard', function(req, res,next){

     
      console.log("get the request for dashboard......");
      const email = req.session.email ;
      var sql = "select * from package";
      con.query(sql, function(error, result,next) {
        if(error) req.flash(error);
        res.render(__dirname+"/user/udashboard.ejs",{view:result,email});
    });
 

    })

    app.get('/user/booking', function(req, res,next){

      res.sendFile(__dirname+ '/user/booking.html');  
      console.log("get the request for Create Package.....");
    });



    app.post('/user/booking', function(req, res) {
      // Get the form data
      


    var name= req.body.name;
    var cnumber= req.body.cnumber;
    var email= req.body.email;
    var place= req.body.place;
    var features= req.body.features;
    var details= req.body.details;

  
      var sql = "INSERT INTO booking(name, cnumber, email, place, features, details ) VALUES ('"+name+"' , '"+cnumber+"','"+email+"','"+place+"','"+features+"','"+details+"')";

    con.query(sql,function (err, result, next) {
      if (err) throw err;
      console.log("New Package Enquiry Is Added..");
      
      res.redirect("/udashboard");
    

      });
    });
    
    app.get("/user/upackage", function(req, res,next) {
      
      console.log("Get request for  user package....");
      var sql = "select * from package";

      con.query(sql, function(error, result,next) {
        if(error) req.flash(error);
        res.render(__dirname+"/user/upackage",{view:result});
      });
      
  });


  app.get('/user/enquiries', function(req, res,next){

    res.sendFile(__dirname+ '/user/enquiries.html');  
    console.log("get the request for Enquiries.....");
  });


  app.post('/user/enquiries', function(req, res) {
    // Get the form data
    


  var name= req.body.name;
  var cnumber= req.body.cnumber;
  var email= req.body.email;
  var place= req.body.place;
  var details= req.body.details;



    var sql = "INSERT INTO entable(name, cnumber, email, place, details ) VALUES ('"+name+"' ,'"+cnumber+"','"+email+"','"+place+"','"+details+"')";

  con.query(sql,function (err, result, next) {
    if (err) throw err;
    console.log("New Enquiry Is Added..");
    res.redirect("/udashboard");
    const email = req.session.email ;
  

    });

  });

  app.get('/user/issue', function(req, res,next){

    res.sendFile(__dirname+ '/user/issue.html');  
    console.log("get the request for Enquiries.....");
  });


  app.post('/user/issue', function(req, res) {
    // Get the form data
    


  var name= req.body.name;
  var cnumber= req.body.cnumber;
  var email= req.body.email;
  var comment= req.body.comment;



    var sql = "INSERT INTO problem(name, cnumber, email,  comment ) VALUES ('"+name+"' ,'"+cnumber+"','"+email+"','"+comment+"')";

  con.query(sql,function (err, result, next) {
    if (err) throw err;
    console.log("New issue Is Added..");
    res.redirect("/udashboard");
    

    });
  });



  app.get("/user/c_booking", function(req, res,next) {

    const email = req.session.email ;
    console.log("Get request for User....");
    

    
    var sql = `select * from booking where email= "${email}"` ;

    console.log({sql});
    
    

    con.query(sql, function(err, result) {
    //  if(error) throw(error);
      // console.log(result);

    if(err)console.log(err);
    console.log(result);
      res.render(__dirname+"/user/c_booking",{view:result,email});
    });
    
  });

  app.get("/user/FeedbackRecord", function(req, res,next) {

    const email = req.session.email ;
    console.log("Get request for Feedback Record....");
    

    
    var sql = `select * from problem where email= "${email}"` ;

    console.log({sql});
    
    

    con.query(sql, function(err, result) {
    //  if(error) throw(error);
      // console.log(result);

    if(err)console.log(err);
    console.log(result);
      res.render(__dirname+"/user/FeedbackRecord",{view:result,email});
    });
    
  });

  app.get("/user/enquirierecord", function(req, res,next) {

    const email = req.session.email ;
    console.log("Get request for Enquirie Record....");
    

    
    var sql = `select * from entable where email= "${email}"` ;

    console.log({sql});
    
    

    con.query(sql, function(err, result) {
    //  if(error) throw(error);
      // console.log(result);

    if(err)console.log(err);
    console.log(result);
      res.render(__dirname+"/user/enquirierecord",{view:result,email});
    });
    
  });



  app.get('/homepage', function(req, res,next){

    res.sendFile(__dirname+ '/Frontend/public/index.html');  
    console.log("get the request for Front end Website.....");
  });


  app.post('/homepage', function(req, res) {
    // Get the form data
    


  var name = req.body.name;
  var cnumber= req.body.cnumber;
  var email= req.body.email;
  var comment= req.body.comment;




    var sql = "insert into  subs(name,cnumber,email,comment) values ('"+name+"','"+cnumber+"','"+email+"','"+comment+"')";

  con.query(sql,function (err, result, next) {
    if (err) throw err;
    console.log("New User Is Added..");
    res.redirect("/homepage");
  

    });
  });



  app.listen(PORT,()=> console.log('http://localhost:'+PORT));
  // app.listen(8080);