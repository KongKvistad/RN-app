//mysql setup and test data retrival

let mysql = require('mysql')

let express = require("express");

let app = express();


app.get('/products/:id', (req, res) => {
	console.log('fetching product with serial: ' + req.params.id)

	const connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'E10trb01',
		database: 'products'
	})
	connection.query("SELECT * FROM productData WHERE serial =" + req.params.id +";", (err, result, rows, fields) => {
		console.log(result);
		if (result.length <= 0) {
			res.send([{serial: "No product found"}]);
		} else {
		res.json(result);
		}
	})
	//res.end();
})

//define listening path for R/N fetch queries

app.listen(process.env.PORT || 3000, () => {
 console.log('Server running on http://localhost:3000')
})
