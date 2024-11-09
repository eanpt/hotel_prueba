<?php 

    session_start();

    if(!isset($_SESSION['usuario'])){
        echo'
            <script>
                alert("Por favor debes de iniciar sesión");
                window.location = "index.php";
            </script>
        ';
        session_destroy();
        die();
        
    }

    session_destroy();

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenida - Alejandro Miranda</title>
</head>
<body>
    <h1>Bienvenido a mi mundo!</h1>
</body>
</html>