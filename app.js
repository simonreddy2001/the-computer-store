const laptopsElement = document.getElementById("laptops");
const nameElement = document.getElementById("name");
const priceElement = document.getElementById("price");
const workElement = document.getElementById("workPay");
const sendElement = document.getElementById("sendPay");
const clearLoanElement = document.getElementById("hiddenBtn");
const imageElement = document.getElementById("image");
const bankBalanceElement = document.getElementById("bankBalance");
const workBalanceElement = document.getElementById("workBalance");
const loanBalanceElement = document.getElementById("loanBalance");
const loanElement = document.getElementById("loan");
const hiddenElement = document.getElementById("hiddenLoan");
const hiddenBtnElement = document.getElementById("hiddenBtn");
const payButtonElement = document.getElementById("buy");
const descriptionElement = document.getElementById("description");
const specsElement = document.getElementById("specs");

let laptops = [];
let bankBalance = 0.0;
let workBalance = 0.0;
let loanBalance = 0.0;
let currentPrice;

fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToMenu(laptops));

const addLaptopsToMenu = (laptops) => {
    laptops.forEach(x => addLaptopToMenu(x));
    nameElement.innerText = laptops[0].title;
    priceElement.innerText = laptops[0].price;
    imageElement.src = "https://noroff-komputer-store-api.herokuapp.com/" + laptops[0].image;
    laptops[0].specs.forEach(spec => {
        const li = document.createElement('li');
        li.innerText = spec;
        specsElement.append(li);
    })
    descriptionElement.innerText = laptops[0].description;
}

const addLaptopToMenu = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopsElement.appendChild(laptopElement);
}

const handleLaptopMenuChange = e => {
    const selectedLaptop = laptops[e.target.selectedIndex];
    priceElement.innerHTML = selectedLaptop.price;
    currentPrice = selectedLaptop.price;
    imageElement.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedLaptop.image;
    specsElement.innerHTML = "";
    selectedLaptop.specs.forEach(spec => {
        const li = document.createElement('li');
        li.innerText = spec;
        specsElement.append(li);
    })
    descriptionElement.innerText = selectedLaptop.description;
    nameElement.innerText = selectedLaptop.title;
}

const handleAddWork = () => {
    workBalance += 100;
    workBalanceElement.innerHTML = workBalance;

}

const sendPay = () => {
    if (loanBalance === 0.0){
        bankBalance += workBalance;
        bankBalanceElement.innerHTML = bankBalance;
    }
    else{
        bankBalance += (workBalance*0.9);
        bankBalanceElement.innerHTML = bankBalance;
        loanBalanceElement.innerHTML -= (workBalance*0.1);
    }
    workBalance = 0.0;
    workBalanceElement.innerHTML = 0.0;
    resetLoan();
}

const loanApply = () => {
    if(loanBalance === 0.0){
        const loanAmt = prompt("Enter the amount would you like to loan: ");
        if (parseInt(loanAmt) > parseInt(bankBalance*2) || loanAmt.trim()==0 || isNaN(loanAmt)) {
            alert("Unfortunately we can not grant the loan that you appled!!! ");
        }
        else {
            alert("Congratulations.. Loan granted!!");
            loanBalance = loanAmt;
            hiddenElement.style.visibility = "visible";
            hiddenBtnElement.style.visibility = "visible";
            loanBalanceElement.innerHTML = loanBalance;
            bankBalance = parseInt(bankBalance) + parseInt(loanBalance);
            bankBalanceElement.innerHTML = bankBalance;
        }
    }
    else{
        alert("Unfortunately we can not grant the loan that you appled!!! Apply after you clear your loan");
    }
}
const repayLoan =() => {
    loanBalance -= workBalance; 
    loanBalanceElement.innerHTML = loanBalance;
    if(loanBalance < 0.0){
        bankBalance = parseInt(bankBalance) + Math.abs(parseInt(loanBalance));
        bankBalanceElement.innerHTML = bankBalance;
        loanBalance = 0.0;
        loanBalanceElement.innerHTML = 0.0;
    }
    workBalance = 0.0;
    workBalanceElement.innerHTML = 0.0;
    resetLoan();
}

const resetLoan =() => {
    if(loanBalance === 0.0){
        hiddenElement.style.visibility = "hidden";
            hiddenBtnElement.style.visibility = "hidden";
    }
}

const buyLaptop = () => {
    currentPrice = parseInt(price.innerText);
    bankBalance = parseInt(bankBalance)
    if(currentPrice <= bankBalance){
        alert("Congratulations!!! You are the owner of New Laptop");
        bankBalance -= currentPrice;
        bankBalanceElement.innerHTML = bankBalance; 
    }
    else{
        alert("Unfortunately you can not buy the laptop.... Due to insufficient funds!!!");
    }
}
laptopsElement.addEventListener("change", handleLaptopMenuChange);
workElement.addEventListener("click", handleAddWork);
sendElement.addEventListener("click", sendPay);
loanElement.addEventListener("click", loanApply);
clearLoanElement.addEventListener("click", repayLoan);
payButtonElement.addEventListener("click", buyLaptop);
