

import { products } from "./script.js"


const cartImg = document.querySelector("#cartImg");
cartImg.addEventListener("click", async () => {
    const cart = { userId: 1, products: [{ id: 2 }] };

    try {
        const response = await fetch("https://fakestoreapi.com/carts/1", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cart),
        });

        if (!response.ok) {
            throw new Error(
                "Network response was not ok: " + response.statusText
            );
        }

        const result = await response.json();
        window.alert("Success: Your cart has been updated", result);
        console.log("Success: Your cart has been updated", result)
        // products.innerHTML =`${result.data}`;
    } catch (error) {
        console.error("Error:", error);
    }
});
