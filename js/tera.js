fetch('../paldea.json')
    .then((response) => response.json())
    .then((json) => {
        localStorage.setItem("pokedex", JSON.stringify(json));
        autocomplete(search, JSON.parse(localStorage.getItem('pokedex')));
    });

var search = document.getElementById("searchInput");

search.addEventListener("keypress", function(event) {
    if (event.key === "Enter")
    {
        event.preventDefault();
        document.getElementById("searchButton").click();
    }
});

var modal = document.getElementById("pokeModal");

var span = document.getElementsByClassName("close")[0];

document.addEventListener("keydown", ({key}) => {
    if (key === "Escape")
    {
        if(modal.style.display == "block")
        {
            modal.style.display = "none";
            search.value = "";
            search.focus();
        }
    }
});

span.onclick = function() {
  modal.style.display = "none";
  search.value = "";
  search.focus();
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    search.value = "";
    search.focus();
  }
}

const typeColors = {
    normal: "#a8a878",
    fire: "#f08030",
    fighting: "#c03028",
    water: "#6890f0",
    flying: "#a890f0",
    grass: "#78c850",
    poison: "#a040a0",
    electric: "#f8d030",
    ground: "#e0c068",
    psychic: "#f85888",
    rock: "#b8a038",
    ice: "#98d8d8",
    bug: "#a8b820",
    dragon: "#7038f8",
    ghost: "#705898",
    dark: "#705848",
    steel: "#b8b8d0",
    fairy: "#ee99ac"
}

function autocomplete(inp, arr)
{
    var currentFocus;

    inp.addEventListener('input', function(e) {
        var a, b, i, val = this.value;
        
        closeAllLists();
        if(!val) return false;
        currentFocus = -1;

        a = document.createElement('DIV');
        a.setAttribute('id', this.id+"autocomplete-list");
        a.setAttribute('class', "autocomplete-items");

        this.parentNode.appendChild(a);

        for(i=0; i<arr.length; i++)
        {
            if(arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase())
            {
                b = document.createElement('DIV');
                b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].name.substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";

                b.addEventListener('click', function(e) {
                    inp.value = this.getElementsByTagName('input')[0].value;
                    closeAllLists();
                    getPokemon(inp.value)
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener('keydown', function(e) {
        var x = document.getElementById(this.id + 'autocomplete-list');
        if(x) x = x.getElementsByTagName('div');
        if(e.keyCode == 40)
        {
            currentFocus++;
            addActive(x);
        }
        else if(e.keyCode == 38)
        {
            currentFocus--;
            addActive(x);
        }
        else if(e.keyCode == 13)
        {
            e.preventDefault();
            if(currentFocus > -1)
            {
                if(x) x[currentFocus].click();
            }
        }
    });

    function addActive(x)
    {
        if(!x) return false;
        
        removeActive(x);
        if(currentFocus >= x.length) currentFocus =0;
        if(currentFocus <0) currentFocus = (x.length-1);

        x[currentFocus].classList.add('autocomplete-active');
    }

    function removeActive(x)
    {
        for(var i=0; i<x.length; i++)
        {
            x[i].classList.remove('autocomplete-active');
        }
    }

    function closeAllLists(elmnt)
    {
        var x = document.getElementsByClassName('autocomplete-items');
        for(var i=0;i<x.length;i++)
        {
            if(elmnt != x[i] && elmnt != inp)
            {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener('click', function(e) {
        closeAllLists(e.target);
    });
}

const getPokemon = function (pokemon) {
    pokedex = JSON.parse(localStorage.getItem('pokedex'));
    pokedex.forEach(element => {
        if(element.name.toLowerCase() == pokemon.toLowerCase())
        {
            modal.style.display = "block";
            document.getElementById('teras').style.backgroundColor = typeColors[document.getElementById('teras').value.toLowerCase()]
            document.getElementById('pokeImg').src = element.img;
            document.getElementById('pokeNameNumber').innerHTML = element.name + ' · ' + element.number;

            var fTypes = element.types.replace("[", '');
            fTypes = fTypes.replace("]", '');
            fTypes = fTypes.replaceAll("'", '');
            fTypes = fTypes.replace(",", '');

            var aTypes = fTypes.split(" ");
            
            pokeTypeSpans = document.getElementsByClassName('pokeType');

            if(aTypes.length < pokeTypeSpans.length)
            {
                pokeTypeSpans[0].innerHTML = aTypes[0];
                pokeTypeSpans[0].style.backgroundColor = typeColors[aTypes[0].toLowerCase()];
                pokeTypeSpans[1].innerHTML = '';
                pokeTypeSpans[1].style.display = 'none';
            }
            else
            {
                console.log('2')
                for(var i=0; i<aTypes.length; i++)
                {
                    pokeTypeSpans[i].innerHTML = aTypes[i];
                    pokeTypeSpans[i].style.backgroundColor = typeColors[aTypes[i].toLowerCase()];
                    pokeTypeSpans[1].style.display = 'inline-block';
                }
            }
        }
    });
}
