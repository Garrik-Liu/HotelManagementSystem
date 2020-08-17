<?php // login.php
    header('Content-Type:text/json;charset=utf-8');
    header('Access-Control-Allow-Origin:*');
    $hn = 'localhost'; //hostname
    $db = 'liu1g3_project'; //database
    $un = 'liu1g3_project'; //username
    $pw = 'mypassword'; //password
    $serverPath = "/60334/project/server/server.php";

    $conn = new mysqli($hn, $un, $pw, $db);
    if ($conn->connect_error) die($conn->connect_error);
    
    $method =$_SERVER['REQUEST_METHOD'];
    $pathname =  $_SERVER["REQUEST_URI"];
    
    class User {
        public $role;
	    public $email;
    }
    
    class Room {
        public $id;
	    public $description;
	    public $price;
	    public $state;
    }
    
    class Reservation {
        public $roomId;
	    public $userEmail;
	    public $checkin;
    }
    
    // get all user
    if($method == "GET" && $pathname == "$serverPath/getUsers") {
    
        $query  = "SELECT * FROM users";
        $result = $conn->query($query);
        $data = array();
        
        if ($result) {
            $rows = $result->num_rows;
            for ($j = 0 ; $j < $rows ; ++$j) {
                $result->data_seek($j);
                $row = $result->fetch_array(MYSQLI_NUM);
                $user = new User();
                $user->email = $row[0];
        		$user->role = $row[1];
        		$data[]=$user;
    	    }   
    	    echo json_encode(array("state"=>"success","data"=>$data));
        } else {
            echo json_encode(array("state"=>"failed","data"=>$data));
            $conn->error;
        }
        $result->close();
    }
    
    // get all reservations
    if($method == "GET" && $pathname == "$serverPath/getReservation") {
    
        $query  = "SELECT * FROM reservation";
        $result = $conn->query($query);
        $data = array();
        
        if ($result) {
            $rows = $result->num_rows;
            for ($j = 0 ; $j < $rows ; ++$j) {
                $result->data_seek($j);
                $row = $result->fetch_array(MYSQLI_NUM);
                $reservation = new Reservation();
                $reservation->roomId = $row[0];
                $reservation->userEmail = $row[1];
        		$reservation->checkin = $row[2];
        		$data[]=$reservation;
    	    }   
    	    echo json_encode(array("state"=>"success","data"=>$data));
        } else {
            echo json_encode(array("state"=>"failed","data"=>$data));
            $conn->error;
        }
        $result->close();
    }
    
    // check user
    if($method == "POST" && $pathname == "$serverPath/checkUser") {
        $email   = get_post($conn, 'email');
        $password    = get_post($conn, 'password');
    
        $query    = "SELECT * FROM users WHERE email = '$email' && password = '$password'";
        $result   = $conn->query($query);
        $data = array();
        
        if ($result) {
            $rows = $result->num_rows;
            for ($j = 0 ; $j < $rows ; ++$j) {
                $result->data_seek($j);
                $row = $result->fetch_array(MYSQLI_NUM);
                $user = new User();
                $user->email = $row[0];
        		$user->role = $row[1];
        		$data[]=$user;
    	    }   
    	    echo json_encode(array("state"=>"success","data"=>$data));
        } else {
            echo json_encode(array("state"=>"failed","data"=>$data));
            $conn->error;
        }
        $result->close();
    }
    
    // reserve a room
    if($method == "POST" && $pathname == "$serverPath/reserveRoom") {
        $roomId   = get_post($conn, 'roomId');
        $userEmail   = get_post($conn, 'userEmail');
    
        $query    = "INSERT INTO reservation VALUES ('$roomId', '$userEmail', 'false', CURRENT_TIMESTAMP)";
        $result1   = $conn->query($query);
        $query    = "UPDATE rooms SET state = 'reserved' WHERE id = '$roomId'";
        $result2   = $conn->query($query);

      	if (!$result1 && !$result2) {
      	    $error = $conn->error;
      	    echo json_encode(array("state"=>"failed", "error"=>$conn->error));
      	} else {
      	    echo json_encode(array("state"=>"success"));
      	}
        
        $result1->close();
        $result2->close();
    }
    
     // get all rooms
    if($method == "GET" && $pathname == "$serverPath/getRooms") {
    
        $query  = "SELECT * FROM rooms";
        $result = $conn->query($query);
        $data = array();
        
        if ($result) {
            $rows = $result->num_rows;
            for ($j = 0 ; $j < $rows ; ++$j) {
                $result->data_seek($j);
                $row = $result->fetch_array(MYSQLI_NUM);
                $room = new Room();
                $room->id = $row[0];
        		$room->description = $row[1];
        		$room->price = $row[2];
        		$room->state = $row[3];
        		$data[]=$room;
    	    }   
    	    echo json_encode(array("state"=>"success","data"=>$data));
        } else {
            echo json_encode(array("state"=>"failed","data"=>$data));
            $conn->error;
        }
        $result->close();
    }
    
    
    $conn->close();
    
    function get_post($conn, $var)
    {
      return $conn->real_escape_string($_POST[$var]);
    }
?>