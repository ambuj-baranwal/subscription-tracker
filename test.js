import {z} from "zod";


let b = new Date(new Date().getTime() + (24 * 24 * 60 * 60 * 1000));
console.log(b.toLocaleString('UTC'), new Date(b).toUTCString());
// let b = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
// console.log(b.toISOString());

function addThirtyDaysToUTCCurrentDateHumanReadable() {
    const utcDate = new Date();
    const thirtyDaysLater = new Date(utcDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    return thirtyDaysLater.toLocaleString('UTC');
}

// Example usage:
const humanReadableDate = addThirtyDaysToUTCCurrentDateHumanReadable();
console.log(humanReadableDate);

console.log(new Date())






