let pid = prompt("Please enter your psychiatrist-id", "");

let psychdata = document.getElementById('just-for-data').innerText;
let pids = JSON.parse(psychdata);

while (pids.find(function (element){
    return element == pid;
}) == undefined){
    pid = prompt("Please enter a valid psychiatrist-id", "");
}

console.log(pids);