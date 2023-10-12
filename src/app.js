const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }))

const ProductManager = require('./ProductManager.js')
const pm = new ProductManager('./products.txt')

app.get('/products', async (req, res) =>  {
    const { limit } = req.query;
    const data = await pm.getProducts();

    if (limit && limit > 0 && limit < data.length) {
        res.status(200).json(data.slice(0, limit));
    } else { 
        res.status(200).json(data)
    }
})

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const data = await pm.getProductById(parseInt(pid));

        if (data === "Not found"){
            return res.status(404).json({error: data})
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})


app.listen(8080, () => {
    console.log("[Server started on port 8080]")
})