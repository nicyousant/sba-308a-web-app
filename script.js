

export const products = document.getElementById("productShowcase");




fetch("https://fakestoreapi.com/products/")
.then(res=>res.json())
.then((data)=>{
    products.innerHTML ="";
    data.forEach(product=> {
        products.innerHTML += `
        <div class="products" key="${product.id}">
            <img class="productImage" width="100" src="${product.image}" alt="${product.title}">
            <div class="content">
                <span class="category">${product.category}</span>
                <h3 class="productTitle">${product.title}</h3>
                <span class="price">$${product.price}</span>
            </div>
        </div>`;
    })
});



const selectCategory = document.getElementById("selectCategory");

async function initialLoad() {
  try {
    const response = await fetch("https://fakestoreapi.com/products/");
    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
    }

    const productCats = await response.json();

    const categories = []; // will hold unique category names

    productCats.forEach(productCat => {
      if (categories.indexOf(productCat.category) === -1) {
        categories.push(productCat.category);

        const option = document.createElement("option");
        option.value = productCat.category;
        option.textContent = productCat.category;
        selectCategory.appendChild(option);
      }
    });
   
  } catch (error) {
    console.log("Error fetching data: " + error);
  }
}

initialLoad();

let productsArr = []; // store all products so we can loop later

// function renderProducts(category) {
//   products.innerHTML = ""; // clear existing

//   for (let i = 0; i < productsArr.length; i++) {
//     const p = productsArr[i];

//     // if category is empty (all) OR matches product category
//     if (category === "" || p.category === category) {
      
//        const div = document.createElement("div");
//       div.textContent = `${p.title} — $${p.price}`;
//       products.appendChild(div);
//     }
//   }
// }

// // event listener for dropdown
// selectCategory.addEventListener("change", () => {
//   renderProducts(selectCategory.value);
// });

selectCategory.addEventListener('change', () =>{
    if (products.category === "men's clothing") {
        products.innerHTML = `
        `
    }
})