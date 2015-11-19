function getDataAltVariable()
{	
	var k;

       	var b = document.getElementsByClassName('element element-interactive interactive');    
        [].forEach.call(b, function (item) {  k = item.getAttribute('data-alt'); console.log(k)});

    return k;
}