// Pseudocode
// Buttons array with words, on load of page, call function that displays all words as buttons
// Generate button on click, should add the words in input field to array, and call function to generate buttons in buttonDisplay div
// Clear button that clears giphys in giphyDisplay div
var topics = ["pickles","kittens","rick","office","game of thrones","halo","lol","fire","fat","harry potter"];
var randomIndex = 0;
var usedRandomIndex = [];

// Beginning of program
$(document).ready(function(event) {
	$("#message").hide();
	// Generate buttons at start of program using array list
	generateButtons();
	// Add click event listener to generated buttons
	$("#addToButtons").on("click", function(clickEvent) {
		$("#buttonSelectSound")[0].currentTime = 0;
    	$("#buttonSelectSound")[0].play();
		var searchValue = $("#searchPhrase").val();
		// Convert text in input box to button only if it is not empty
		if($("#searchPhrase").val()) {
			clickEvent.preventDefault();
			// checking for duplicates and adding only otherwise
			if(!topics.includes(searchValue.toLowerCase())) {
				$("#duplicatePrompt").hide();
				topics.push(searchValue);
				generateButtons();
			}
			else {
				// Display message
				$("#duplicatePrompt").show();
			}
		}
	});

	// On click of Clear button
	$("#clearDisplay").on("click", function(clickEvent) {
		$("#buttonSelectSound")[0].currentTime = 0;
    	$("#buttonSelectSound")[0].play();
		clickEvent.preventDefault();
		$("#message").hide();
		$("#giphyDisplay").empty(); // avoiding using function clearDiv here since no other functionality is executed on clear i.e this is shorter
	})

	// On click of any button generated
	$("#buttonDisplay").on("click", ".giphyButtons", function() {
		$("#buttonSelectSound")[0].currentTime = 0;
    	$("#buttonSelectSound")[0].play();
		var buttonData = $(this).data("value");
		buttonData = buttonData.replace(" ","+");
		randomIndex = 0;
		usedRandomIndex = [];
		getGiphys(buttonData);
		$("#searchPhrase").val("");
	});

	// Adding event listener to each gif image
	$("#giphyDisplay").on("click", ".giphyImage", function() {
			$("#gifClickSound")[0].currentTime = 0;
    		$("#gifClickSound")[0].play();
			// Check the state (animated or still) of the gif, and change accordingly
			$(this).attr('data-state', $(this).attr('data-state') == 'still' ? 'animated' : 'still');
			$(this).attr('src', $(this).attr('data-state') == 'still' ? $(this).attr('data-still') : $(this).attr('data-animated'));

		});

});

// Function to generate buttons in array
function generateButtons() {
	// Clearing buttons before refilling div
	$("#buttonDisplay").empty();
	for(var i=0; i<topics.length; i++) {
		var button = $('<button class="giphyButtons button btn-2 btn-2c">');
		button.data("value",topics[i]).text(topics[i]);
		$("#buttonDisplay").append(button);
	}
}

// Function to get 10 gifs from Giphy api 
function getGiphys(searchTerm) {
	// PseudoCode change: Using random indices to select 10 random gifs from 100 gifs got via ajax call 
	var queryURL = "https://api.giphy.com/v1/gifs/search?&api_key=dc6zaTOxFJmzC&limit=100&rating=&q=" + searchTerm;
	// Ajax call
	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {
		// Clear existing gifs if any
		$("#giphyDisplay").empty();
		var responseData = response.data;
		// Looping 10 times for 10 gifs
		for(var i=0; i<10; i++) {
			// Getting a random index that has not been used before 
			randomIndex = Math.floor(Math.random()*responseData.length);
			while(usedRandomIndex.indexOf(randomIndex) != -1) {
				randomIndex = Math.floor(Math.random()*responseData.length);
			}
			usedRandomIndex.push(randomIndex);
			// Creating gif divs to hold giphy
			var giphyDiv = $('<div class="giphyDiv">');
			var giphy = $('<img class ="giphyImage img-responsive">');
			// Set data for still and animated images
			giphy.attr({"data-still":responseData[randomIndex].images.downsized_still.url, "data-animated":responseData[randomIndex].images.downsized.url, "data-state":"still"});
			// Set src initially to still image
			giphy.attr('src',responseData[randomIndex].images.downsized_still.url);
			giphyDiv.append(giphy);
			giphyDiv.append("<p>Gif Rating: " + responseData[randomIndex].rating.toUpperCase() + "</p>");
			$('#giphyDisplay').append(giphyDiv);
		}
		$("#message").show();
	});
}