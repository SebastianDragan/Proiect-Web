<?php
$host = 'localhost'; // sau IP-ul serverului tău
$db = 'admin_app'; // numele bazei de date
$user = 'sebidragan'; // utilizatorul tău MySQL
$pass = 'qwererty14Sa.'; // parola ta MySQL

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
?>