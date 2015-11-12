

export default function formatGuardianDate(n){
    var n = new Date(n); 
    

    var locale = "en-gb",
    d = n.toLocaleString(locale, { weekday: "long", year: "numeric", month: "long",
        day: "numeric", hour: "numeric", minute: "numeric"});

    d=d.split(",").join("");
    d=d.split(":").join(".");
    d=d+" GMT";
    
    return d;
}


