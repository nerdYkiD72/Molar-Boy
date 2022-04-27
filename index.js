const answerList = document.getElementById("answer-list");

function handleSearch(searchQuery) {
    var bruh = search(searchQuery);
    for (let i = 0; i < bruh.length; i++) {
        const element = bruh[i];
        console.log(element.name);
    }
}


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

    // for(var i in data){ // iterate through dataset
    //     for(var u=0;u<search_fields.length;u++){ // iterate through each key in dataset

    //         var rel = getRelevance(data[i][search_fields[u]],keyword) // check if there are matches

    //         if(rel==0) // no matches...
    //             continue // ...skip

    //         results.push({relevance:rel,entry:data[i]}) // matches found, add to results and store relevance
    //     }
    // }

    // results.sort(compareRelevance) // sort by relevance

    // for(i=0;i<results.length;i++){
    //     results[i] = results[i].entry // remove relevance since it is no longer needed
    // }

    
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