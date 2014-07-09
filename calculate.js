// all values are listed as cost / year
// for years greater that those listed in the array, the last value is taken
// as a default

var initSetup = 5400;
var sysMaintenance = [0, 5000];
var baseFee = [15000, 14000, 13000, 12000, 11000, 10000];
var userFee = [39 * 12]; // fee per month * 12 for yearly fee

var numUsers = 0;

function setUserNum (userNum) {
    numUsers = userNum;
}

// 0 <= year
function getYearlyCost (costArray, year) {
    if (year < costArray.length) {
        return costArray[year];
    } else {
        return costArray[costArray.length - 1];
    }
}

// returns the year that a quarter is in
// note that quarters are 1 indexed and years are 0 indexed
function year (quarter) {
    return Math.floor((quarter - 1) / 4);
}

// returns the cost for a given quarter and number of users
function getQuarterlyFee (quarter, users) {
    var totalCost = 0;

    if (quarter == 1) {
        totalCost += initSetup;
    }

    totalCost += getYearlyCost(sysMaintenance, year(quarter)) / 4;
    totalCost += getYearlyCost(baseFee, year(quarter)) / 4;
    totalCost += getYearlyCost(userFee, year(quarter)) / 4 * users;

    return totalCost;
}
