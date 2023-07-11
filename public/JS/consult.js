let consultdata = document.getElementById('just-for-data').innerText;
let cons = JSON.parse(consultdata);

console.log(cons);

let consult_cont = document.getElementById('consult-cont');
cons.forEach(function f(element){
    var ccard = document.createElement('div');
    ccard.classList.add("consult-card");
    var mt1 = "<div>Psychiatrist Name : ";
    var mt2 = element["pname"];
    var mt3 = "</div>"
    var mt4 = "<div>Consultation Date : ";
    var mt5 = String(element["cdate"]).slice(0, 10);
    var mt6 = "</div>"
    var mt7 = "<div>Consultation Time : ";
    var mt8 = element["ctime"];
    var mt9 = "</div>"
    var mt10 = "<div>Consultation Topic : ";
    var mt11 = element["cfield"];
    var mt12 = "</div>"
    var mt13 = "<button class='btn'>BOOK NOW</button>";

    ccard.innerHTML = mt1 + mt2 + mt3 + mt4 + mt5 + mt6 + mt7 + mt8 + mt9 + mt10 + mt11 + mt12 + mt13;
    consult_cont.append(ccard);
})
