  document.addEventListener("DOMContentLoaded", (_) => {
    if (document.getElementById("index").innerHTML == ".") {
      document.getElementById("add-item").addEventListener("click", getPokemon);
      document.getElementById("getAll").addEventListener("click", getAll);
      document.getElementById("getID").addEventListener("click", getName);
      document.getElementById("delete").addEventListener("click", deleteCard);
      document.getElementById("update").addEventListener("click", handleUpdate);
    } else  if (document.getElementById("index").innerHTML == ","){
      document.getElementById("Play").addEventListener("click", PlayPokemon);
      document.getElementById("Get-Cards").addEventListener("click", getPokecards);
    }
  });

  function PlayPokemon() {
    axios
      .get(`http://localhost:3000/getGame`)
      .then((response) => {
        console.log("Conecting");
        let id = response.data;
        console.log(id)
        localStorage.setItem("GameID", id);
        let aux = localStorage.getItem("GameID");
        console.log(aux);
        document.getElementById("CON").innerHTML = "Connected...";
  
        axios.post("http://localhost:3000/createGame", {params : {
           id : localStorage.getItem("GameID")
         }})
        .then((response) => {
  
        });
        updateGameStat();
        //intervalo de actualización cada 5 seg.
        setInterval(updateGameStat, 5000);
      })
      .catch((err) => {
      });
  }

  //obtener las cartas actuales de un juego por ID
  function getPokecards() {
    axios
      .get(`http://localhost:3000/getGameCards`, {
        params: {
          id: localStorage.getItem("GameID"),
        },
      })

      //ACTUALIZACIÓN DE STATS
      .then((response) => {
        updateGameStat();
      })
      .catch((err) => {
      });
  }
  
  function updateGameStat() {
    axios
      .get(`http://localhost:3000/updateStat`, {
        params: {
          id: localStorage.getItem("GameID"),
        },
      })
      .then((response) => {
        
        document.getElementById("items").innerHTML = "";
        response.data[0].cards.forEach((element) => {
          if (element.typecard == "pokemon") {
            addPokemon(element);
          } else {
            addCard(element);
          }
        });
      })
      .catch((err) => {
      });
  }
  
  //Formato de nueva tarjeta
  let get_element_li = (
    name,
    id,
    weight,
    height,
    base_experience,
    image,
    types
  ) => {
    return `<div class="added-pokemon added-item" ><h1 >Name: ${name} id: ${id} </h1> <div class="center"><img src="${image}" width="250" height="250"></div> <div>types: ${types}<div>weight: ${weight} height: ${height} <div> base experience: ${base_experience} </div>`;
  };
  
  let get_element_li_not_pokemon = (
    name,
    type,
    data
  ) => {
    return `<div class="added-pokemon added-item"><h1>Name: ${name} Type Card: ${type} </h1> <div> Data: ${data} </div>`;
  };
  
  function handleUpdate(){
    let name = document.querySelector("#update-pokemon").value;
    let data = document.querySelector("#data-update").value
    axios
    .put(`http://localhost:3000/put/${name}`, {
      params: {
      name : name,
      data : data
    }})
      .then((response) => {
      })
      .catch((err) => {
      });
  }
  function addPokemon(datos) {
    let myData = datos.data
    let typeNames = [];
    let arrayTypes = myData.typeNames
    arrayTypes.forEach((typeData) => {
       typeNames.push(typeData);
     });
    let template = get_element_li(
      myData.name,
      myData.id,
      myData.weight,
      myData.height,
      myData.base_experience,
      myData.sprites.front_default,
      typeNames
    );
    document.getElementById("items").innerHTML += template;
  }
  
  function addCard(datos){
    let myData = datos
    let template = get_element_li_not_pokemon(myData.name, myData.typecard, myData.data)
    document.getElementById("items").innerHTML += template;
  }
  
  function deleteCard(){
    let pokename = document.querySelector("#delete-pokemon").value;
    pokename = pokename.toLowerCase();
    axios
      .delete(`http://localhost:3000/delete/${pokename}`)
      .then((response) => { })
      .catch((err) => { });
  }
  
  let catchable_handle_for_the_error_of_the_pokemon_request = (err) => {
    //handle here the pokemon error from the request
    alert("POKEMON NOT FOUND!!!")
  }