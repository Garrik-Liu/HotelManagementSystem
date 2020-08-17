$(document).ready(function() {
    let roomData = [];
    let selectedRoom = null;
    getRooms();

    function getRooms() {
        // get all room
        $.ajax({
            type: "GET",
            url: "http://liu1g3.myweb.cs.uwindsor.ca/60334/project/server/server.php/getRooms",
            success: function(result) {
                if (Array.isArray(result.data)) {
                    roomData = result.data;
                    let roomListInnerHTML = "";
                    roomData.forEach(item => {
                        roomListInnerHTML += `
                <div class="room_card col-md-4" data-toggle="modal" data-target="#roomReserveModel">
                  <div class="card mb-4 shadow-sm">
                      <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail">
                          <title>Placeholder</title>
                          <rect width="100%" height="100%" fill="#55595c" />
                          <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                              Image
                          </text>
                      </svg>
                      <div class="card-body">
                          <p class="card-text">Room #${item.id}</p>
                          <div class="d-flex justify-content-between align-items-center">
                              <p class="price text-dark">Price: ${item.price} ( CAD )</p>
                              <small class="text-muted">${item.state}</small>
                          </div>
                      </div>
                  </div>
                </div>
              `;
                    });
                    $('#roomList').html(roomListInnerHTML);

                    const roomCards = document.getElementsByClassName("room_card");
                    for (var i = 0; i < roomCards.length; i++) {
                        (function(index) {
                            const data = roomData[index];
                            if (data.state == 'avaliable') {
                                roomCards[index].addEventListener('click', () => {
                                    roomCardClickHandler(index);
                                    selectedRoom = data;
                                });
                            } else {
                                roomCards[index].classList.add('room_non-avaliable');

                            }

                        })(i)
                    }
                }
            }
        });
    }

    $('#reserveBtn').click(() => {
        if (loginState == null) {
            $('#reserveBtnAlert').show();
            $('#reserveBtnAlert').text("Please log in first!");
        } else if (loginState.role == "receptionist") {
            $('#reserveBtnAlert').show();
            $('#reserveBtnAlert').text("Receptionist cannot reserve a room!");
        } else {
            $('#reserveBtnAlert').hide();

            $.ajax({
                type: 'POST',
                url: "http://liu1g3.myweb.cs.uwindsor.ca/60334/project/server/server.php/reserveRoom",
                data: {
                    "roomId": parseInt(selectedRoom.id),
                    "userEmail": loginState.email,
                },
                error: function(result) {
                    const responseJSON = result.responseJSON;
                    $('#roomReserveModel').modal('hide');
                    getRooms();
                }
            });
        }
    });

    const loginForm = document.getElementById("loginForm");
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");

    let loginState = null;

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = loginEmail.value;
        const password = loginPassword.value;

        $.ajax({
            type: "POST",
            url: "http://liu1g3.myweb.cs.uwindsor.ca/60334/project/server/server.php/checkUser",
            data: {
                "email": email,
                "password": password
            },
            success: function(result) {
                if (result.data.length > 0) {
                    loginState = result.data[0];
                    if (loginState.role == 'guest') {
                        $('#accountInfoBtnGuest').text(loginState.email);
                        $('#accountInfoBtnGuest').show();
                        $('#checkInNav').hide();
                    } else if (loginState.role == 'receptionist') {
                        $('#accountInfoBtnManager').text(loginState.email);
                        $('#accountInfoBtnManager').show();
                        $('#checkInNav').show();
                        getReservation();
                    }
                    $('#signoutBtn').show();
                    $('#loginBtnGroup').hide();
                    $('#loginAlert').hide();
                    $('#loginModel').modal('hide');
                } else {
                    $('#loginAlert').show();
                }
            },
        });
    });

    $("#signoutBtn").click(() => {
        loginState = null;
        $('#loginBtnGroup').show();
        $('#accountInfoBtnGuest').hide();
        $('#accountInfoBtnManager').hide();
        $('#signoutBtn').hide();
    })





    function roomCardClickHandler(index) {
        const data = roomData[index];

        $('#roomModelContent').html(`
          <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">Room #${data.id}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>

          <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
              <div class="carousel-inner">
                  <div class="carousel-item active">
                      <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail">
                          <title>Placeholder</title>
                          <rect width="100%" height="100%" fill="#55595c" />
                          <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                              Image 1
                          </text>
                      </svg>
                  </div>
                  <div class="carousel-item">
                      <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail">
                          <title>Placeholder</title>
                          <rect width="100%" height="100%" fill="#55595c" />
                          <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                              Image 2
                          </text>
                      </svg>
                  </div>
                  <div class="carousel-item">
                      <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail">
                          <title>Placeholder</title>
                          <rect width="100%" height="100%" fill="#55595c" />
                          <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                              Image 3
                          </text>
                      </svg>
                  </div>
              </div>
              <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="sr-only">Next</span>
              </a>
          </div>

          <div class="modal-body">
              <div>
                  <h6>Description</h6>
                  <p>${data.description}</p>
              </div>
              <div>
                  <h6>Price</h6>
                  <p>${data.price} CAD</p>
              </div>
          </div>
      `);
    }

    function getReservation() {
        $.ajax({
            type: "GET",
            url: "http://liu1g3.myweb.cs.uwindsor.ca/60334/project/server/server.php/getReservation",
            success: function(result) {
                if (Array.isArray(result.data)) {
                    reservationList = result.data;
                    let reservationListHTML = '';
                    reservationList.forEach(item => {
                        if (item.checkin == 'false') {
                            reservationListHTML += `
                      <li class="list-group-item check-list-item">
                        <span>Room: ${item.roomId} | Email: ${item.userEmail}</span>
                        <div class="btn-group">
                            <button type="button" class="check-btn check-in-btn btn btn-primary">Check In</button>
                        </div>
                      </li>
                    `;
                        } else {
                            reservationListHTML += `
                          <li class="list-group-item check-list-item">
                            <span>Room: ${item.roomId} | Email: ${item.userEmail}</span>
                            <div class="btn-group">
                                <button type="button" class="check-btn check-out-btn btn btn-danger">Check Out</button>
                            </div>
                          </li>
                        `;
                        }

                    });
                    $('#reservationList').html(reservationListHTML);

                    const checkBtnList = document.getElementsByClassName("check-btn");

                    for (var i = 0; i < checkBtnList.length; i++) {
                        (function(index) {
                            checkBtnList[index].addEventListener('click', () => {
                                const data = reservationList[index];
                                if (data.checkin == 'false') {
                                    checkInRequest(data.roomId);
                                } else {
                                    checkOutRequest(data.roomId);
                                }
                            });
                        })(i)
                    }

                }
            }
        });
    }

    function checkInRequest(roomId) {
        $.ajax({
            type: "POST",
            url: "http://liu1g3.myweb.cs.uwindsor.ca/60334/project/server/server.php/checkIn",
            data: {
                "roomId": roomId,
            },
            error: function(result) {
                getReservation();

            },
        });
    }

    function checkOutRequest(roomId) {
        $.ajax({
            type: "POST",
            url: "http://liu1g3.myweb.cs.uwindsor.ca/60334/project/server/server.php/checkOut",
            data: {
                "roomId": roomId,
            },
            error: function(result) {
                getReservation();
                getRooms();
            },
        });
    }
});