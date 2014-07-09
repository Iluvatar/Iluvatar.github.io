// all values are listed as cost / year
// for years greater that those listed in the array, the last value is taken
// as a default

var initSetup = 5400;
var sysMaintenance = [0, 5000];
var baseFee = [15000, 14000, 13000, 12000, 11000, 10000];
var userFee = [39 * 12]; // fee per month * 12 for yearly fee

var nextQuarter = 1; // next quarter to show

// 0 <= year
function getYearlyCost(costArray, year) {
    if (year < costArray.length) {
        return costArray[year];
    } else {
        return costArray[costArray.length - 1];
    }
}

// returns the year that a quarter is in
// note that quarters and years are 0 indexed
function year(quarter) {
    return Math.floor(quarter / 4);
}

// returns the cost for a given quarter and number of users
function getQuarterlyFee(quarter, users) {
    var totalCost = 0;

    if (quarter == 0) {
        totalCost += initSetup;
    }

    totalCost += getYearlyCost(sysMaintenance, year(quarter)) / 4;
    totalCost += getYearlyCost(baseFee, year(quarter)) / 4;
    totalCost += getYearlyCost(userFee, year(quarter)) / 4 * users;

    return totalCost;
}

function addQuarter() {
    var holder = document.getElementById("quarterHolder");
    var newQuarter = document.createElement("div");
    newQuarter.className = "quarterDisplay";
    newQuarter.id = "q" + nextQuarter;

    var numUsersFill = document.getElementById("usersQ" + (nextQuarter - 1)).value;

    var title = document.createElement("span");
    title.className = "boldText";
    var text = document.createTextNode("Year " + (year(nextQuarter) + 1) +
                                       " Quarter " + (nextQuarter % 4 + 1));
    title.appendChild(text);

    var label = document.createElement("label");
    label.className = "userLabel";
    label.setAttribute("for", "usersQ" + nextQuarter);
    label.appendChild(document.createTextNode("Num users: "));

    var input = document.createElement("input");
    input.className = "userInput";
    input.id = "usersQ" + nextQuarter;
    input.type = "text";
    input.value = numUsersFill;
    input.setAttribute("onChange", "updateFutureQuarterPrices(" + nextQuarter + ")");

    var cost = document.createElement("span");
    cost.className = "costDisplay";
    var innerCost = document.createElement("span");
    innerCost.id = "costQ" + nextQuarter;
    cost.appendChild(document.createTextNode("Cost: "));
    cost.appendChild(innerCost);

    var userCost = document.createElement("span");
    userCost.className = "costDisplay";
    var innerUserCost = document.createElement("span");
    innerUserCost.id = "userCostQ" + nextQuarter;
    userCost.appendChild(document.createTextNode("Cost per user: "));
    userCost.appendChild(innerUserCost);

    newQuarter.appendChild(title);
    newQuarter.appendChild(document.createElement("br"));
    newQuarter.appendChild(label);
    newQuarter.appendChild(input);
    newQuarter.appendChild(document.createElement("br"));
    newQuarter.appendChild(cost);
    newQuarter.appendChild(document.createElement("br"));
    newQuarter.appendChild(userCost);

    holder.appendChild(newQuarter);
    updateQuarterPrice(nextQuarter);

    nextQuarter++;
}

function addYear() {
    var quartersToAdd = 4 - nextQuarter % 4;

    for (var c = 0; c < quartersToAdd; c++) {
        addQuarter();
    }
}

function removeQuarter() {
    if (nextQuarter > 1) {
        var remove = document.getElementById("q" + (nextQuarter - 1));
        remove.parentNode.removeChild(remove);
        nextQuarter--;
    }
}

function removeYear() {
    var quartersToRemove = (nextQuarter - 1) % 4 + 1;

    for (var c = 0; c < quartersToRemove; c++) {
        removeQuarter();
    }
}

function resetQuarter() {
    while (nextQuarter > 1) {
        removeQuarter();
    }

    document.getElementById("usersQ0").value = "";
    updateQuarterPrice(0);
}

function updateQuarterPrice(quarter) {
    var numUsers = document.getElementById("usersQ" + quarter).value;

    if (isNaN(numUsers) || numUsers == "") {
        document.getElementById("costQ" + quarter).innerHTML = "";
        document.getElementById("userCostQ" + quarter).innerHTML = "";
        return;
    }

    var totalCost =  getQuarterlyFee(quarter, numUsers);
    var userCost = Math.round(getQuarterlyFee(quarter, numUsers) / numUsers);

    document.getElementById("costQ" + quarter).innerHTML = "$" + totalCost;
    document.getElementById("userCostQ" + quarter).innerHTML = "$" + userCost;
}

function updateFutureQuarterPrices(quarter) {
    var numUsers = document.getElementById("usersQ" + quarter).value;

    for (var c = quarter; c < nextQuarter; c++) {
        document.getElementById("usersQ" + c).value = numUsers;
        updateQuarterPrice(c);
    }
}