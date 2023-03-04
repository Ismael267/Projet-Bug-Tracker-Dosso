/*crud */
$(function () {
  let localuser = localStorage.getItem('result')
  let result = JSON.parse(localuser).result

  let token = result.token
  let user_id = result.id
  console.log(token)
  console.log(user_id)

  /*lister*/
  $.ajax({
    url: `http://greenvelvet.alwaysdata.net/bugTracker/api/list/${token}/${user_id}`,
    type: 'GET',
    success: function (response) {
      function appendRow(element) {
        let users = localStorage.getItem('resultats')
        let resultats = JSON.parse(users)
        let allUser = resultats.result.user

        // console.log(allUser)
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
        // console.log(element.timestamp);
        $('#thead-dark').append(row)
      }

      try {
        const datas = JSON.parse(response)
        // console.log(datas)
        const bug = datas.result.bug
        console.log(bug)

        const undone = bug.filter((b) => b.state == 1)
        const dones = bug.filter((b) => b.state == 2)
        const bug_length = bug.length
        console.log(dones)
        $('#all_bugs').append(bug_length)
        $('#on_Bug').append(undone.length)
        $('#done_bugs').append(dones.length)
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
            default:
              console.log(`Invalid state value: ${element.state}`)
          }
        }
      } catch (err) {
        // console.log(message)
        // alert('une erreur inattendue')
      }
    },
  })
  $.ajax({
    url: `http://greenvelvet.alwaysdata.net/bugTracker/api/list/${token}/0`,
    type: 'GET',
    success: function (response) {
      function appendRow(element) {
        let users = localStorage.getItem('resultats')
        let resultats = JSON.parse(users)
        let allUser = resultats.result.user
        // console.log(allUser)
        const options = `
          <option class="option1" value="0">Pas commencé</option>
          <option class="option2" value="1">En cours</option>
          <option class="option3" value="2">Terminé</option>
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
    url: `http://greenvelvet.alwaysdata.net/bugTracker/api/users/${token}`,
    method: 'get',
    success: function (response) {
      let data = JSON.parse(response)
      // On les enregistre dans le local storage
      localStorage.setItem('resultats', JSON.stringify(data))
      let allUser = data.result.user
    },
  })

  /*ajouter */

  let form = $('#bug-form')
  form.on('submit', function (event) {
    event.preventDefault()

    let title = $('#title').val()
    let description = $('#description').val()

    let localuser = localStorage.getItem('result')
    let result = JSON.parse(localuser).result

    let token = result.token
    let user_id = result.id

    $.ajax({
      url: `http://greenvelvet.alwaysdata.net/bugTracker/api/add/${token}/${user_id}`,
      method: 'POST',

      data: JSON.stringify({
        title: title,
        description: description,
      }),
      success: function (response) {
        console.log(response)
      },
      error: function (error) {
        console.log(error)
      },
    })
  })
})

/*update */

function updateBug(state, bug_id) {
  let localuser = localStorage.getItem('result')
  let result = JSON.parse(localuser).result

  let localbug = localStorage.getItem('resultats')
  let resultats = JSON.parse(localbug).result.bug
  let token = result.token

  $.ajax({
    url: `http://greenvelvet.alwaysdata.net/bugTracker/api/state/${token}/${bug_id}/${state}`,
    type: 'GET',
    success: function (response) {
      console.log(response)
      // actualise l'affichage de la liste des bugs
      location.reload()
      // $("#thead-dark1").empty();
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log(xhr.responseText)
      console.log(textStatus)
      console.log(errorThrown)
    },
  })
}

//bouton retour

$(document).ready(function () {
  $('#back').click(function () {
    parent.history.back()
    return false
  })
})
