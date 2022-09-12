const express=require("express");
const mysql=require("mysql");
const bodyParser=require("body-parser");

const app=express()
app.use(bodyParser.urlencoded({extended:true}))

app.set("view engine","ejs")
app.set("views","views")
const db=mysql.createConnection({
	host:"localhost",
	database:"school",
	user:"root",
	password:""
})

app.get("/", (req,res) =>{
	db.connect((err) => {
		const sql="SELECT * FROM student";
		db.query(sql, (err, result) =>{
			if (err) throw err

			const users=JSON.parse(JSON.stringify(result))
			res.render("index", {users});
		})
	})
});
app.get("/add", (req,res) =>{
	res.render("add");
})
app.post("/add", (req,res, next) => {
	
	if(req.body.add === ""){
		db.connect((err) => {
			const sql=`INSERT INTO student (name, class) VALUES ('${req.body.name}', '${req.body.class}')`;
			db.query(sql, (err, result) =>{
				if (err) throw err
				res.redirect("/");
			})
	    })
	}	
	res.redirect("/");
	
});
app.get("/edit/:id", (req,res) => {
	console.log(req.params.id);

	db.connect((err) => {
		const sql=`SELECT * FROM student WHERE id=${req.params.id}`;
		db.query(sql, (err, result) => {
			if(err) throw err;
			const user=JSON.stringify(result);
			res.render("edit", {user:Object.values(result)});
		})
	})
});
app.post("/edit/", (req,res) => {
	db.connect((err) => {
		const sql=`UPDATE student SET name='${req.body.name}', class='${req.body.class}' WHERE id=${req.body.id}`;
		db.query(sql, (err, result) => {
			if(err) throw err;
			res.redirect("/");
		})
	})
});

app.get("/delete/:id", (req,res) => {
	db.connect((err) => {
		const sql=`DELETE FROM student WHERE id=${req.params.id}`;
		db.query(sql, (err, result) => {
			if(err) throw err;
			res.redirect("/");
		})
	})
});
const port=8000;
app.listen(port, () => {
	console.log(`server ready anjing di port ${port}`);
})