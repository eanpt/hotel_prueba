<?php 
session_start();
include 'conexion_be.php';

$correo = $_POST['correo'];
$password = $_POST['password'];
$password = hash('sha512', $password);

$validar_login = mysqli_query($conexion, "SELECT * FROM usuarios WHERE email='$correo' 
AND clave='$password'");

if(mysqli_num_rows($validar_login) > 0 ){
    $_SESSION['usuario'] = $correo;
    header("location: ./bienvenida.php"); //CAMBIAR BIENVENIDOS POR LA PAGINA PPAL
    exit;
}else{
    echo'
        <script>
            alert("usuario no existe porfavor verifique los datos introducidos");
            window.location = "../index.php";
        </script>
    ';
    exit;
}

?>