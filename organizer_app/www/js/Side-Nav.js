function openNav(){
	let element = document.getElementById("side-menu-nav");
	element.classList.add("side-nav-active");
	document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav(){
	let navbar = document.getElementById("side-menu-nav");
	navbar.classList.remove("side-nav-active");
	document.body.style.backgroundColor = "white";
}