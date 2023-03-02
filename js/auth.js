//register
$(function () {
  let form = $('#register-form');
  form.on('submit', function (event) {
    event.preventDefault();
    let name = $('#name').val();
    let password = $('#password').val();
    let verPassword = $('#verPassword').val();
    if (password === verPassword) {
      $.ajax({
        type: 'GET',
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/signup/${name}/${password}`,
        success: function (response) {
          let data = JSON.parse(response)
          // On les enregistre dans le local storage
          localStorage.setItem('result', JSON.stringify(data))
          console.log(data.result.token)
          console.log(data)
          // On redirige l'utilsateur sur la page principale
          
          window.location.replace("/index.html");
        },
        error: function (error) {
          console.error(error);
        }
      });
    } else {
      alert('les mots de passe ne correspondent pas');
    }
  });



  //login

  $(function () {
    $('#login').click(function (e) {
      e.preventDefault()
      let name = $('#name').val()
      let password = $('#password').val()

      $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/login/${name}/${password}`,
        type: 'GET',
        success: function (response) {
          try {
            // On format correctement les donnees
            let data = JSON.parse(response)
            // On les enregistre dans le local storage
            localStorage.setItem('result', JSON.stringify(data))
            console.log(data.result.token)
            console.log(data)
            // On redirige l'utilsateur sur la page principale
            window.location.replace('/index.html')
          } catch (err) {
            console.log(err)
            alert('une erreur inattendue')
          }
        },
        error: function (error) {
          // user is not connected
          alert('erreur durant la connexion')
        },
      })
    })
  })

  // logout

  $('#logout').on('click', function (e) {
    if (confirm('Are you sure you want to logout?')) {
      $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/logout/}`,
        type: 'GET',
        success: function (response) {
          try {
            // On format correctement les donnees
            let data = response
            // On les enregistre dans le local storage
            localStorage.setItem('result', JSON.stringify(data))
            // On redirige l'utilsateur sur la page principale
            window.location.replace('/login.html')
          } catch (err) {
            console.log(err)
            alert('une erreur inattendue')
          }
        },
        error: function (error) {
          // user is not connected
          alert('erreur durant la connexion')
        },
      })
    }
    return false
  })
})
