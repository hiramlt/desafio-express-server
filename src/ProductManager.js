const fs = require('fs');

class ProductManager{
    constructor(path) {
        this.path = path;
    }

    async #setProductId() { 
        const products = await this.getProducts()
        return products.length === 0 ? 1 : (products[products.length -1].id + 1)
    }

    async addProducts(title, description, price, thumbnail, code, stock) {
        let products = [];
        if (fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, 'utf-8')
            products = JSON.parse(data)
        }
        
        if (title && description && price && thumbnail && code && stock){
            const found = products.find((product) => product.code === code);
            if (!found) {
                try {
                    const id = await this.#setProductId();
                    products.push(new Product(id, title, description, price, thumbnail, code, stock) );
                    await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf8');
                    console.log("Product saved successfully")
                } catch (error) {
                    console.error('Error: ' + error.message)
                }    
            } else {
                console.error("Product already exists")
            }
        }
        
    }

    async getProducts() {
        if (!fs.existsSync(this.path)) return []
        
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {  
            throw new Error('Error: ' + error.message)
        }
    }

    async getProductById(id) {
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(data);
            const found = products.find((product) => product.id === id);
            return found ?? "Not found"
        } catch (error) {
            throw new Error('Error: ' + error.message)
        }
    }

    async updateProduct(id, data) {
        const { title, description, price, thumbnail, code, stock} = data
        const products = await this.getProducts();

        if (products && products.length > 0){
            const found = products.findIndex((product) => product.id === id);
            if (found < 0) { return console.error('Not found') }

            if (title) { products[found].title = title }
            if (description) { products[found].description = description }
            if (price) { products[found].price = price }
            if (thumbnail) { products[found].thumbnail = thumbnail }
            if (code) { products[found].code = code }
            if (stock) { products[found].stock = stock }
            
            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf8');
            console.log("Product updated successfully");
        }
    }

    async deleteProduct(id) {
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(data);

            const found = products.findIndex((product) => product.id === id);
            if (found < 0) { return console.error('Not found') }

            products.splice(found, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf8');
            console.log("Product deleted successfully");
        } catch (error) {
            throw new Error('Error: ' + error.message)
        }
    }
}

class Product{
    constructor(id, title, description, price, thumbnail, code, stock){
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

(async function Test(run) {
    const pm = new ProductManager('./products.txt');
    //await pm.addProducts("Producto prueba3", "Este es un producto de prueba3", 300, "Sin imagen", "abc789", 50);
})(false);

module.exports = ProductManager;

