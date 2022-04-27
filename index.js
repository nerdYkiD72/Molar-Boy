const answerList = document.getElementById("answer-list");

function handleSearch(searchQuery) {
    addToAnswerList(search(searchQuery));
}


function clearAnswerList() {
    var toRemove = []; // Make a list here to remove so you delete items after iterating through them

    for (let i = 1; i < answerList.rows.length; i++) {
        const element = answerList.rows[i];
        toRemove.push(element.id);

    }

    toRemove.forEach((element) => {
        document.getElementById(element).remove();
    });
}


function addToAnswerList(results) {
    clearAnswerList();
    var listItems = [];
    var doThing = true;

    for (let i = 0; i < results.length; i++) {
        const element = results[i];
        for (let j = 0; j < listItems.length; j++) {
            console.log("List item: " + listItems[j]);
            console.log("element: " + element.name);
            if  (listItems[j] == element.name) {
                console.log("Skipped");
                doThing = false; 
                break;
            }
        }


        if (doThing) {
            listItems.push(element.name)


            var newRow = answerList.insertRow(i);
            var elName = newRow.insertCell(0);
            var elWeight = newRow.insertCell(1);
            var elButton = newRow.insertCell(2);
    
            newRow.classList.add("level");
            newRow.setAttribute("id", element.name + "-row");
            elName.setAttribute("id", element.name + "-Name");
            elWeight.setAttribute("id", element.name + "-Weight");
            elButton.setAttribute("id", element.name + "-Button");
    
            elName.innerHTML = element.name;
            elWeight.innerHTML = "Weight: " + element.atomic_mass;
            elButton.innerHTML = '<button class="button is-success">+</button><button class="button is-danger">-</button>'
        }
        doThing = true;
    }
}





// Search algorithum 
var search_fields = ['name', 'symbol'] //key fields to search for in dataset

function search(keyword) {
    if (keyword.length < 1) // skip if input is empty
        return

    var results = []


    for (let i = 0; i < data.elements.length; i++) { // iterate through dataset
        for (var u = 0; u < search_fields.length; u++) { // iterate through each key in dataset

            var rel = getRelevance(data.elements[i][search_fields[u]], keyword) // check if there are matches

            if (rel == 0) // no matches...
                continue // ...skip

            results.push({ relevance: rel, entry: data.elements[i] }) // matches found, add to results and store relevance
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