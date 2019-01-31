
//mysql setup and test data retrival

let mysql = require('mysql')

let express = require("express");

var bodyParser = require('body-parser')

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'E10trb01',
	database: 'products',
	
})

//define listening path for R/N fetch queries

app.listen(process.env.PORT || 3000, () => {
	console.log('Server running on http://localhost:3000')
   })


app.get('/products/:id', (req, res) => {
	console.log('fetching product with serial: ' + req.params.id)

	connection.query("SELECT * FROM productdata WHERE serial ="+ req.params.id + ";", (err, result, rows, fields) => {
        if (err) {
			throw err;
		} else if (result.length === 0) {
			res.send(JSON.stringify({"status":200, "error": null, "response": [
				{id: "0", serial: "none", type: 0, name: "...", pris: "...", spend: 0}]}));
			console.log(result.length)
		} else {
			console.log(result);
			res.send(JSON.stringify({"status":200, "error": null, "response": result}));
		}
	})
})

app.post('/update/:id', (req, res) => {

	if (req.params.id === 0) {
		connection.query("INSERT INTO `productdata` (`serial`, `type`, `name`, `pris`) VALUES (" + req.body.serial + ", '10', 'flaske', '125');"
		, (err, result,) => {
			if (err) {
				throw err;
			} else {
				console.log(result);
			}
		})
	} else {
		connection.query("UPDATE `productdata` SET `spend` = `spend` +" + req.body.price +" WHERE `id` = " +req.params.id +";", (err, result,) => {
			if (err) {
				throw err;
			} else {
				console.log(result);
			}
		})
		connection.query("UPDATE `productdata` SET `pris` = " + req.body.price +" WHERE `id` = " +req.params.id +";", (err, result,) => {
			if (err) {
				throw err;
			} else {
				console.log(result);
			}
		})
	}

})


