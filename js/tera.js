fetch('https://raw.githubusercontent.com/tasnimxahmed-cs/paldea-pal/master/paldea.json')
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
            document.getElementById('strengths').innerHTML = '';
            document.getElementById('weaknesses').innerHTML = '';
            document.getElementById('baseTypes').innerHTML = '';
        }
    }
});

span.onclick = function() {
  modal.style.display = "none";
  search.value = "";
  search.focus();
  document.getElementById('strengths').innerHTML = '';
  document.getElementById('weaknesses').innerHTML = '';
  document.getElementById('baseTypes').innerHTML = '';
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    search.value = "";
    search.focus();
    document.getElementById('strengths').innerHTML = '';
    document.getElementById('weaknesses').innerHTML = '';
    document.getElementById('baseTypes').innerHTML = '';
  }
}

function newTera()
{
    document.getElementById('teras').style.backgroundColor = typeColors[document.getElementById('teras').value.toLowerCase()];
    var pokeName = document.getElementById('pokeNameNumber').innerHTML;
    pokeName = pokeName.split(" ")[0];
    getPokemon(pokeName);
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

const getPokemon = async function (pokemon) {
    pokedex = JSON.parse(localStorage.getItem('pokedex'));
    pokedex.forEach(async element => {
        if(element.name.toLowerCase() == pokemon.toLowerCase())
        {
            modal.style.display = "block";
            document.getElementById('strengths').innerHTML = '';
            document.getElementById('weaknesses').innerHTML = '';
            document.getElementById('baseTypes').innerHTML = '';
            document.getElementById('teras').style.backgroundColor = typeColors[document.getElementById('teras').value.toLowerCase()];
            document.getElementById('pokeImg').src = element.img;
            document.getElementById('pokeNameNumber').innerHTML = element.name + ' · ' + element.number;
            

            var fTypes = element.types.replace("[", '');
            fTypes = fTypes.replace("]", '');
            fTypes = fTypes.replaceAll("'", '');
            fTypes = fTypes.replace(",", '');

            var aTypes = fTypes.split(" ");

            for(var i=0; i<aTypes.length; i++)
            {
                const span = document.createElement('span');
                const node = document.createTextNode(aTypes[i]);
                span.classList.add('pokeType');
                span.style.backgroundColor = typeColors[aTypes[i].toLowerCase()];
                span.appendChild(node);
                document.getElementById('baseTypes').appendChild(span);
            }

            aTypes.push(document.getElementById('teras').value);
            
            async function calculateTypes(aTypes)
            {
                var strengths = [];
                var weaknesses = [];
                var teraStrengths = [];
                var teraWeaknesses = [];

                for(var i=0; i<aTypes.length; i++)
                {
                    var response = await fetch('https://pokeapi.co/api/v2/type/'+aTypes[i].toLowerCase());
                    var json = await response.json();
                    for(var j=0; j<json.damage_relations.double_damage_to.length; j++)
                    {
                        if(i==aTypes.length-1) teraStrengths.push(json.damage_relations.double_damage_to[j].name);
                        strengths.push(json.damage_relations.double_damage_to[j].name);
                    }
                    for(var j=0; j<json.damage_relations.double_damage_from.length; j++)
                    {
                        if(i==aTypes.length-1) teraWeaknesses.push(json.damage_relations.double_damage_from[j].name);
                        weaknesses.push(json.damage_relations.double_damage_from[j].name);
                    }
                }

                sStrengths = [...new Set(strengths)];
                sWeaknesses = [...new Set(weaknesses)];

                sStrengths.forEach(strength => {
                    const span = document.createElement('span');
                    var fStrength = strength.charAt(0).toUpperCase() + strength.slice(1);
                    const node = document.createTextNode(fStrength);
                    span.classList.add('pokeType');
                    span.style.backgroundColor = typeColors[fStrength.toLowerCase()];
                    span.appendChild(node);
                    document.getElementById('strengths').appendChild(span);
                });

                sWeaknesses.forEach(weakness => {
                    const span = document.createElement('span');
                    var fWeakness = weakness.charAt(0).toUpperCase() + weakness.slice(1);
                    const node = document.createTextNode(fWeakness);
                    span.classList.add('pokeType');
                    span.style.backgroundColor = typeColors[fWeakness.toLowerCase()];
                    span.appendChild(node);
                    document.getElementById('weaknesses').appendChild(span);
                });

                allTypes = document.getElementsByClassName('pokeType');
                var response = await fetch('https://pokeapi.co/api/v2/type/'+document.getElementById('teras').value.toLowerCase());
                var json = await response.json();
                for(var i=0;i<allTypes.length;i++)
                {
                    console.log(allTypes[i].parentNode.id)
                    if(allTypes[i].parentNode.id == "strengths")
                    {
                        for(var j=0; j<json.damage_relations.double_damage_to.length; j++)
                        {
                            if(allTypes[i].innerHTML.toLowerCase() == json.damage_relations.double_damage_to[j].name.toLowerCase())
                            {
                                allTypes[i].style.border = "2px solid "+typeColors[document.getElementById('teras').value.toLowerCase()];
                            }
                        }
                    }
                    else if(allTypes[i].parentNode.id == 'weaknesses')
                    {
                        for(var j=0; j<json.damage_relations.double_damage_from.length; j++)
                        {
                            if(allTypes[i].innerHTML.toLowerCase() == json.damage_relations.double_damage_from[j].name.toLowerCase())
                            {
                                allTypes[i].style.border = "2px solid "+typeColors[document.getElementById('teras').value.toLowerCase()];
                            }
                        }
                    }
                }

                document.getElementById('teraNote').style.color = typeColors[document.getElementById('teras').value.toLowerCase()];
            }

            calculateTypes(aTypes);
        }
    });
}