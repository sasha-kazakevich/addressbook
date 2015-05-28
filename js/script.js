var form = document.getElementById("form");
var button = document.getElementById("button");
var tbody = document.getElementById("tbody");
var search = document.getElementById("search");

if (!window.localStorage.getItem("person_counter")){
	window.localStorage.setItem("person_counter","0");
}

function Person(firstName,lastName,email,counter){
	this.firstName = firstName;
	this.lastName = lastName;
	this.email = email;
	this.counter = counter;
}
function testInput(firstName,lastName,email){
	if (firstName === "" || lastName === "" || email == "")
		return false;
	var regEmail = /.+@.+\..+/i;
	if (!regEmail.exec(email)){
		form.childNodes[7].childNodes[3].style.borderColor = "red";
		return false;
	}
	form.childNodes[7].childNodes[3].style.borderColor = "#ccc";
	return true;
}
function savePerson(){
	var firstName = form.childNodes[3].childNodes[3].value;
	var lastName = form.childNodes[5].childNodes[3].value;
	var email = form.childNodes[7].childNodes[3].value;
	if(!testInput(firstName,lastName,email)) return;
	form.childNodes[3].childNodes[3].value = "";
	form.childNodes[5].childNodes[3].value = "";
	form.childNodes[7].childNodes[3].value = "";
	
	var counter = +window.localStorage.getItem("person_counter") + 1;
	window.localStorage.setItem("person_counter",counter);
	var newPerson = new Person (firstName,lastName,email,counter);
	window.localStorage.setItem("person_" + newPerson.counter,JSON.stringify(newPerson));

	drawPerson(firstName,lastName,email,counter);
}

function drawPerson(firstName,lastName,email,counter){
	var tr = document.createElement("tr");
	var td;
	for (var i = 0;i < 3;i++){
		td = document.createElement("td");
		td.innerHTML = (function(i,firstName,lastName,email){
			return arguments[i+1];
		}(i,firstName,lastName,email));
		tr.appendChild(td);
	}
	var edit = document.createElement("td");
	edit.innerHTML = '<span class="glyphicon glyphicon-pencil" id="edit"></span>';
	edit.className = "text-center";
	tr.appendChild(edit);

	var delet = document.createElement("td");
	delet.innerHTML = '<span class="glyphicon glyphicon-remove" id="delet"></span>';
	delet.className = "text-center";
	tr.appendChild(delet);

	tr.setAttribute("data-counter",counter);
	tbody.appendChild(tr);
}

function removePerson(e){
	if(e.target.id === "edit" || e.target.id === "delet"){
		if(e.target.id === "edit"){
			if (form.childNodes[3].childNodes[3].value !== ""){
				savePerson();
			}
			form.childNodes[3].childNodes[3].value = e.target.parentNode.parentNode.childNodes[0].innerHTML;
			form.childNodes[5].childNodes[3].value = e.target.parentNode.parentNode.childNodes[1].innerHTML;
			form.childNodes[7].childNodes[3].value = e.target.parentNode.parentNode.childNodes[2].innerHTML;
		}
		var dataCounter = e.target.parentNode.parentNode.getAttribute("data-counter");
		window.localStorage.removeItem("person_" + dataCounter);
		e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
	}

};

function searchPerson(){
	function removeRow(){
		var valSearch = search.value;
		tbody.childNodes.forEach = [].forEach;
		if (valSearch === ""){
			tbody.childNodes.forEach(function(elem){
				elem.style.display = "table-row";
			});
			return;
		}
		tbody.childNodes.forEach(function(elem){
			for(var i = 0 ;i < elem.childNodes.length;i++){
				if (elem.childNodes[i].innerHTML === valSearch){
					elem.style.display = "table-row";
					return;
				}
			 elem.style.display = "none";
			};
		});

	};
		search.addEventListener("keyup", removeRow);
		search.addEventListener("blur", function(){
			search.removeEventListener("keyup", removeRow);
		});
};

function checkStorage(){
	var reg = /person_\d+/;
	for(var prop in window.localStorage){
		if(reg.exec(prop)){
			var pers = JSON.parse(window.localStorage.getItem(prop));
			drawPerson(pers.firstName,pers.lastName,pers.email,pers.counter);
		}
	};
};

checkStorage();

search.addEventListener("focus", searchPerson);
button.addEventListener("click",savePerson);
tbody.addEventListener("click",removePerson ,false);