const answerList = document.getElementById("answer-list");
const compoundBox = document.getElementById("compound");
const compoundBoxMass = document.getElementById("compound-mass");
const inputBox = document.getElementById("inputBox");

function handleSearch(searchQuery) {
    addToAnswerList(search(searchQuery));
}

inputBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        
        if (answerList.rows.length >= 1) {
            var splitId = answerList.rows[0].id.split("-");
            var name = splitId[0];
            
            handleElementAdd(name);
        }
    } else if (event.key === "\\") {
        event.preventDefault();

        if (answerList.rows.length >= 1) {
            var splitId = answerList.rows[0].id.split("-");
            var name = splitId[0];
            
            handleElementRemove(name);
        }
    }
});



function clearAnswerList() {
    var toRemove = []; // Make a list here to remove so you delete items after iterating through them

    for (let i = 0; i < answerList.rows.length; i++) {
        const element = answerList.rows[i];
        toRemove.push(element.id);

    }

    console.log(toRemove);

    toRemove.forEach((element) => {
        document.getElementById(element).remove();
    });
}


function addToAnswerList(results) {
    clearAnswerList();
    var listItems = [];

    if (results) {
        for (let i = 0; i < results.length; i++) {
            const element = results[i];
    
            listItems.push(element.name)


            var newRow = answerList.insertRow(i);
            var elName = newRow.insertCell(0);
            var elWeight = newRow.insertCell(1);
            var elButton = newRow.insertCell(2);
    
            newRow.classList.add("level");
            newRow.classList.add("a-row");
            newRow.setAttribute("id", element.name + "-row");
            elName.setAttribute("id", element.name + "-Name");
            elWeight.setAttribute("id", element.name + "-Weight");
            elButton.setAttribute("id", element.name + "-Button");
            elButton.classList.add("button-colum");
    
            elName.innerHTML = element.name;
            elWeight.innerHTML = "Weight: " + element.atomic_mass;
            elButton.innerHTML = `<div class="button-container"><button class="button is-success add-remove-buttons" onClick="handleElementAdd('${element.name}')">+</button><button class="button is-danger add-remove-buttons" onClick="handleElementRemove('${element.name}')">-</button></div>`
        }
    }
}

var compound = {}

function handleClearComound() {
    compound = {};
    showCompound(compound);
}


function handleElementAdd(name) {
    // compound.push(name);
    
    if (!compound[name]) {
        compound[name] = 1;
    } else {
        compound[name] += 1;
    }
    console.log(compound);
    showCompound(compound);
}

function handleElementRemove(name) {
    if (!compound[name]) {
        console.warn("There is no element to delete.")
    } else {
        compound[name] -= 1;
    }
    console.log(compound);
    showCompound(compound);
}

function showCompound(compoundList) {
    var output = "";
    var keys = Object.keys(compoundList);
    console.log(compoundList);

    keys.forEach(element => {
        console.log(getAbriviation(element));
        if (compoundList[element] < 2 && compoundList[element] > 0) {
            output += `${getAbriviation(element)}`;
        } else if (compoundList[element] >= 2) {
            output += `${getAbriviation(element)}${surroundWithSub(compoundList[element])}`;
        }
    });

    console.log(output);
    compoundBox.innerHTML = output;
    compoundBoxMass.innerHTML = `${getMolarMass(compoundList)} g/mol`;
}

function getMolarMass(compoundList) {
    var keys = Object.keys(compoundList);
    var mass = 0.0;

    keys.forEach(element => {
        mass += getMass(element) * compoundList[element];
    });
    mass = round(mass);
    console.log(`The mass is: ${mass} g/mol`);
    return mass;
}

function surroundWithSub(string) {
    return `<sub>${string}</sub>`
}

function getAbriviation(name) {
    for (let i = 0; i < data.elements.length; i++) {
        if (data.elements[i].name == name) {
            return data.elements[i].symbol;
        }
    }
}

function getMass(name) {
    for (let i = 0; i < data.elements.length; i++) {
        if (data.elements[i].name == name) {
            var atomicMass = data.elements[i].atomic_mass;
            return round(atomicMass);
        }
    }
}

function round(value) {
    return Math.round(value * 100) / 100
}


// Search algorithum 
var search_fields = ['name', 'symbol'] //key fields to search for in dataset

function search(keyword) {
    if (keyword.length < 1) // skip if input is empty
        return

    var results = []
    var bruh = 0;


    for (let i = 0; i < data.elements.length; i++) { // iterate through dataset
        // console.log(data.elements.length);
        var lastItem;
        for (var u = 0; u < search_fields.length; u++) { // iterate through each key in dataset
            console.log(`Last item: ${lastItem}`);

            var rel = getRelevance(data.elements[i][search_fields[u]], keyword) // check if there are matches

            if (rel == 0) // no matches...
                continue // ...skip

            

            if (lastItem != data.elements[i].name) {
                bruh++;
                console.log("Adding " + data.elements[i] + " | the " + bruh + " number added");

                results.push({ relevance: rel, entry: data.elements[i] }) // matches found, add to results and store relevance
                lastItem = data.elements[i].name;
            }
            
        }
    }
        results.sort(compareRelevance) // sort by relevance
        

        for (i = 0; i < results.length; i++) {
            results[i] = results[i].entry // remove relevance since it is no longer needed
        }
    return results;    
}

function getRelevance(value, keyword) { // checks a given item to see if its simillar to the search term
    value = value.toLowerCase() // lowercase to make search not case sensitive
    keyword = keyword.toLowerCase()

    var index = value.indexOf(keyword) // index of the keyword
    var word_index = value.indexOf(' ' + keyword) // index of the keyword if it is not on the first index, but a word

    if (index == 0) // value starts with keyword (eg. for 'Dani California' -> searched 'Dan')
        return 3 // highest relevance
    else if (word_index != -1) // value doesnt start with keyword, but has the same word somewhere else (eg. 'Dani California' -> searched 'Cali')
        return 2 // medium relevance
    else if (index != -1) // value contains keyword somewhere (eg. 'Dani California' -> searched 'forn')
        return 1 // low relevance
    else
        return 0 // no matches, no relevance
}

function compareRelevance(a, b) {
    return b.relevance - a.relevance;
}