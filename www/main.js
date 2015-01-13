$(document).ready(function() {
	/*
		Global Variables
	*/
    var json;
    var selectedItems = [];

    /*
    	Updates selection and prices after choosing an item
    */
    function menuPrices(item) {
        var price = parseFloat(item.price);
        var total = getTotal();
        if (total + price > 8.75) {
            var warning = confirm("If you add this you will go over 8.75! OK to continue");
            if (warning) {
                selectedItems[selectedItems.length] = item;
            }
        } else if ((total + price) == 8.75) {
            alert("You've made $8.75! If you add anything else, you will use another meal or flex.");
            selectedItems[selectedItems.length] = item;
        } else {
            selectedItems[selectedItems.length] = item;
        }
        updateList(selectedItems);
        updateTotal();
    }

	/*
	Updates the "total" indicator HTML
	*/
    function updateTotal() {
        document.getElementById("js").innerHTML = currencyFormat(getTotal());
    }

    /*
    	Updates the "selection" indicator HTML
    */
    function updateList() {
        var updatedString = "";
        for (var index in selectedItems) {
            updatedString += selectedItems[index].name + ": " + currencyFormat(selectedItems[index].price) + ' <button class = "selectedItem" id = \"selectedItem' + index + '\">X</button>' + "<br>";
        }
        document.getElementById("list").innerHTML = updatedString;
    }

    /*
    	Makes the currency value from a float.
    */
    function currencyFormat(number) {
        number = number.toString();
        dollars = number.split('.')[0];
        cents = (number.split('.')[1] || '') + '00';
        dollars = dollars.split('').reverse().join('')
            .replace(/(\d{3}(?!$))/g, '$1,')
            .split('').reverse().join('');
        return '$' + dollars + '.' + cents.slice(0, 2);
    }
    /*
    	Makes an AJAX call to the server, getting JSON to populate the list with.
    */
    $.ajax({
        url: 'api.php', //the script to call to get data          
        data: "", //you can insert url argumnets here to pass to api.php
        //for example "id=5&parent=6"
        dataType: 'json', //data format      
        success: function(json) //on recieve of reply
        {
        	for (var index in json) {
        		json[index].price  = parseFloat(json[index].price);
        	}
            window.json = json;
            for (var i = 0; i < json.length; i++) {
                if (json[i].category == 'Drink') {
                    $("#drinks_list").append("<li class = \"odd\"> <a id = item" + i + ">" + json[i].name + ": $" + json[i].price + "</a></li>");
                } else if (json[i].category === 'Sandwich' || json[i].category === 'sandwiches') {
                    $("#sandwiches_list").append("<li class = \"odd\"> <a id = item" + i + ">" + json[i].name + ": $" + json[i].price + "</a></li>");
                } else if (json[i].category === 'Breakfast') {
                    $("#breakfast_list").append("<li class = \"odd\"> <a id = item" + i + ">" + json[i].name + ": $" + json[i].price + "</a></li>");
                }
            }
        }
    });

	/*
		Loads a preprepared JSON file for testing purposes.
	*/
	
    $.getJSON("prices.json", function(json) {
        window.json = json;
        for (var i = 0; i < json.length; i++) {
            if (json[i].category == 'drinks') {
                $("#drinks_list").append("<li class = \"odd\"> <a id = item" + i + ">" + json[i].name + "</a></li>");
            } else if (json[i].category === 'snacks' || json[i].category === 'sandwiches') {
                $("#sandwiches_list").append("<li class = \"odd\"> <a id = item" + i + ">" + json[i].name + "</a></li>");
            } else if (json[i].category === 'breakfast') {
                $("#breakfast_list").append("<li class = \"odd\"> <a id = item" + i + ">" + json[i].name + "</a></li>");
            }
        }
    });
	
    /*
    	Deletes an item from the list indicator.
    */
    function deleteItem(index) {
        var newPrice = 0;
        for (var i in json) {
        	console.log (selectedItems[index].name + " vs " +  json[i].name);
            if (selectedItems[index].name === json[i].name) {
            	console.log (selectedItems[index].name + " vs " +  json[i].name);
                newPrice = json[i].price;
            }
        }
        selectedItems.splice(index, 1);
        updateList(selectedItems);
        updateTotal();
    }

    /*
    	Listens for clicks on menu items
    */
    $(document).on('click', 'a', function() {
        var id = $(this).attr('id').slice(4);
        var item = window.json[id];
        menuPrices(item);
    });

    $(document).on('click', '.selectedItem', function() {
        var id = $(this).attr('id').slice(12);
        deleteItem(id);
    });

    /*
		GETTERS AND SETTERS
    */

    function getTotal() {
    	var total = 0;
        for (var index in selectedItems){
        	total += selectedItems[index].price;
        }
        return total;
    }
});
