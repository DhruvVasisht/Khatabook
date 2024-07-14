const http = require('http');
const  express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const server= http.createServer((req, res) => {
    if(req.url === '/' || req.url === '/views/index.ejs'){
        fs.readdir(`./hisaab`,(err, files) =>{
            if(err) return  res.status(500).send(err);
            res.render('index', {files: files});
        })
    }
    // else if(req.url === '/create.html'){
    //     res.render('create');
    // }
    // else if(req.url.startsWith('/edit/')){
    //     const filename = req.url.split('/')[2];
    //     fs.readFile(`./hisaab/${filename}`,"utf-8", (err, filedata) =>{
    //         if(err) return  res.status(500).send(err);
    //         res.render("edit", {filedata, filename});
    //     })
    // }
    // else if(req.url.startsWith('/hisaab/')){
    //     const filename = req.url.split}
})
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>{
    fs.readdir(`./hisaab`,(err, files) =>{
        if(err) return  res.status(500).send(err);
        res.render('index', {files: files});
    })
   
})

app.get("/create",(req, res) =>{
    res.render('create');
});

app.get("/edit/:filename",(req, res) =>{
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8", (err, filedata) =>{
        if(err) return  res.status(500).send(err);
        res.render("edit", {filedata, filename: req.params.filename});
    })
});

app.get("/hisaab/:filename",(req, res) =>{
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8", (err, filedata) =>{
        if(err) return  res.status(500).send(err);
        res.render("hisaab", {filedata, filename:req.params.filename});
    })
});

app.get("/delete/:filename",(req, res) =>{
    fs.unlink(`./hisaab/${req.params.filename}`, (err, filedata) =>{
        if(err) return  res.status(500).send(err);
        res.redirect("/");
    })
});


app.post("/update/:filename",(req, res) =>{
   fs.writeFile(`./hisaab/${req.params.filename}`, req.body.content, (err) =>{
    if(err) return  res.status(500).send(err);
        res.redirect('/');
   })
});

app.post("/createhisaab",(req, res) =>{
    var uniqueIdentifier = Date.now();
    var currentDate= new Date();
    var date=`${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}-${currentDate.getHours()}hrs`
    fs.writeFile(`./hisaab/${date}.txt`,req.body.content,function(err){
        if(err) return res.status(500).send(err);
        res.redirect('/');
    })
});
app.listen(3000);
server.listen( () => console.log(`Server running at http://127.0.0.1:/`));