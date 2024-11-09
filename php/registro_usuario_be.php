<?php 

include 'conexion_be.php';

$nombre_completo = $_POST["nombre_completo"];
$correo = $_POST["correo"];
$cedula = $_POST["cedula"];
$password = $_POST["password"];
//Encriptar contraseña
$password = hash('sha512', $password);

$query = "INSERT INTO usuarios(full_name, email, idd, clave) 
            VALUES('$nombre_completo', '$correo', '$cedula', '$password')";


//Verificar que el correo no se repita en la BD
$verificar_correo = mysqli_query($conexion, "SELECT * FROM usuarios WHERE email ='$correo' ");

if(mysqli_num_rows($verificar_correo) > 0){
    echo '
        <script>
            alert("Este correo ya esta registrado, inenta con otro diferente");
            window.location = "../index.php";
        </script>
    ';
    exit();
}

//Verificar que la cedula no se repita en la BD
$verificar_cedula = mysqli_query($conexion, "SELECT * FROM usuarios WHERE idd ='$cedula' ");

if(mysqli_num_rows($verificar_cedula) > 0){
    echo '
        <script>
            alert("Este documento ya esta registrado, inenta con otro diferente");
            window.location = "../index.php";
        </script>
    ';
    exit();
}

$ejecutar = mysqli_query($conexion, $query);

if($ejecutar){
    echo '
        <script>
            alert("Usuario creado exitosamente");
            window.location = "../index.php";
        </script>    
    ';
}else '
        <script>
            alert("Intentalo nuevamente, usuario no creado");
            window.location = "../index.php";
        </script>    
    ';


    mysqli_close($conexion);
?>