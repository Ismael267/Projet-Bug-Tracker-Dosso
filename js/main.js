/*crud */$(function () {
  let localUserData = localStorage.getItem('result')
  let userData = JSON.parse(localUserData).result

  let userToken = userData.token
  let userId = userData.id
  console.log(userToken)
  console.log(userId)

  /*lister*/
  $.ajax({
    url: `http://greenvelvet.alwaysdata.net/bugTracker/api/list/${userToken}/${userId}`,
    type: 'GET',
    success: function (response) {
      function appendRow(element) {
        let localResultats = localStorage.getItem('resultats')
        let resultats = JSON.parse(localResultats)
        let allUser = resultats.result.user

        const options = `
          <option id="option1" value="0">Pas commencé</option>
          <option id="option2" value="1">En cours</option>
          <option id="option3" value="2">Terminé</option>
        `
        const select = `<select class="liste" onchange="updateBug(this.value, ${element.id})">${options}</select>`
        const deleteButton = `<button type="button" id="delete" onclick="deleteBug(${element.id})" class="btn btn-danger">supprimer</button>`
        const row = `
          <tr>
            <td>${element.id}</td>
            <td>${element.title}</td>
            <td>${element.description}</td>
            <td>${new Date(element.timestamp * 1000).toLocaleString()}</td>
            <td>${allUser[element.user_id]}</td>
            <td>${select}</td>
            <td>${deleteButton}</td>
          </tr>
        `
        $('#thead-dark').append(row)
      }

      try {
        const data = JSON.parse(response)
        const bugList = data.result.bug
        console.log(bugList)

        const undoneBugs = bugList.filter((b) => b.state == 1)
        const doneBugs = bugList.filter((b) => b.state == 2)
        const bugLength = bugList.length
        console.log(doneBugs)
        $('#all_bugs').append(bugLength)
        $('#on_Bug').append(undoneBugs.length)
        $('#done_bugs').append(doneBugs.length)
        localStorage.setItem('resultat', JSON.stringify(data))
        for (const element of data.result.bug) {
          switch (element.state) {
            case '0':
              appendRow(element)
              break
            case '1':
              appendRow(element)
              break
            case '2':
              appendRow(element)
              break
            default:
              console.log(`Invalid state value: ${element.state}`)
          }
        }
      } catch (err) {
        console.log(err)
        alert('une erreur inattendue')
      }
    },
  })

  // code pour récupérer tous les bugs avec l'état "pas commencé"
  $.ajax({
    url: `http://greenvelvet.alwaysdata.net/bugTracker/api/list/${userToken}/0`,
    type: 'GET',
    success: function (response) {
      function appendRow(element) {
        let localResultats = localStorage.getItem('resultats')
        let resultats = JSON.parse(localResultats)
        let allUser = resultats.result.user

        const options = `
          <option class="option1" value="0">Pas commencé</option>
          <option class="option2" value="1">En cours</option>
          <option class="option3" value="2">Terminé</option>`
        const select = `<select class="liste" onchange="updateBug(this.value, ${element.id})">${options}</select>`
        const deleteButton = `<button type="button" id="delete" onclick="deleteBug(${element.id})" class="btn btn-danger">supprimer</button>`
        const row = `
          <tr>
            <td>${element.id}</td>
            <td>${element.title}</td>
            <td>${element.description}</td>
            <td>${new Date(element.timestamp * 1000).toLocaleString()}</td>
            <td>${allUser[element.user_id]}</td>
            <td>${select}</td>
            <td>${deleteButton}</td>
          </tr>
        `
        // console.log(element.timestamp);
        $('#thead-dark1').append(row)
      }

      try {
        const datas = JSON.parse(response)
        console.log(datas)
        const bug = datas.result.bug
        console.log(bug)
        const undone = bug.filter((b) => b.state == 1)
        const dones = bug.filter((b) => b.state == 2)
        const bug_length = bug.length
        console.log(bug_length)
        $('#al_bugs').append(bug_length)
        $('#one_Bug').append(undone.length)
        $('#don_bugs').append(dones.length)
        localStorage.setItem('resultat', JSON.stringify(datas))
        for (const element of datas.result.bug) {
          switch (element.state) {
            case '0':
              appendRow(element)
              break
            case '1':
              appendRow(element)
              break
            case '2':
              appendRow(element)
              break
          }
        }
      } catch (err) {
        console.log(err)
        alert('une erreur inattendue')
      }
    },
  })
  // code pour recuperé tous les utilisateurs
  $.ajax({
    url: `http://greenvelvet.alwaysdata.net/bugTracker/api/users/${userToken}`,
    method: 'get',
    success: function (response) {
      let data = JSON.parse(response)
      // On les enregistre dans le local storage
      localStorage.setItem('resultats', JSON.stringify(data))
      let allUser = data.result.user
    },
  })

  /*ajouter */

  // Gestion de l'envoi du formulaire

})

/*update */


// Gestion de l'envoi du formulaire
let bugForm = $('#bug-form');
bugForm.on('submit', function (event) {
  event.preventDefault(); // Empêche le formulaire de se soumettre normalement

  // Récupération des données du formulaire
  let titleInput = $('#title').val();
  let descriptionInput = $('#description').val();

  // Récupération des données utilisateur stockées en local
  let localUser = localStorage.getItem('result');
  let parsedUser = JSON.parse(localUser).result;

  // Extraction du token et de l'ID utilisateur
  let token = parsedUser.token;
  let userId = parsedUser.id;

  // Envoi de la requête AJAX pour ajouter le bug
  $.ajax({
    url: `http://greenvelvet.alwaysdata.net/bugTracker/api/add/${token}/${userId}`,
    method: 'POST',

    data: JSON.stringify({
      title: titleInput,
      description: descriptionInput,
    }),
    success: function (response) {
      console.log(response);
    },
    error: function (error) {
      console.log(error);
    },
  });
});

// Fonction pour mettre à jour l'état d'un bug
function updateBug(state, bugId) {
  // Récupération des données utilisateur stockées en local
  let localUser = localStorage.getItem('result');
  let parsedUser = JSON.parse(localUser).result;

  // Récupération des données du bug stockées en local
  let localBug = localStorage.getItem('resultats');
  let parsedBug = JSON.parse(localBug).result.bug;
  let token = parsedUser.token;

  // Envoi de la requête AJAX pour mettre à jour l'état du bug
  $.ajax({
    url: `http://greenvelvet.alwaysdata.net/bugTracker/api/state/${token}/${bugId}/${state}`,
    type: 'GET',
    success: function (response) {
      console.log(response);
      // actualise l'affichage de la liste des bugs
      location.reload();
      // $("#thead-dark1").empty();
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log(xhr.responseText);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//bouton retour

$(document).ready(function () {
  $('#back').click(function () {
    parent.history.back()
    return false
  })
})
