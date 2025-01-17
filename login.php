<?php
header("Access-Control-Allow-Origin: *"); // Permite toate originile
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Permite metodele de cerere
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Permite antetul Content-Type și Authorization
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'config.php'; // Include fișierul de configurare
require 'vendor/autoload.php'; // Asigură-te că autoload-ul este inclus
use Firebase\JWT\JWT;

$secretKey = '8d9c3f1b4e7b9a4f5e6c3d1e2f4a7b8c';
$algorithm = 'HS256';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    $email = $data->email;
    $password = $data->password;

    // Verifică dacă utilizatorul există în baza de date
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // Generare token JWT
        $payload = [
            'iss' => 'http://localhost:4200', // Issuer
            'iat' => time(), // Issued at
            'exp' => time() + 60,
            'userId' => $user['ID'] // Include doar ID-ul utilizatorului
        ];

        $jwt = JWT::encode($payload, $secretKey, $algorithm);

        // Răspuns cu token și detalii utilizator
        echo json_encode([
            'token' => $jwt,
            'user' => [
                'id' => $user['ID'],
                'firstName' => $user['firstName'],
                'lastName' => $user['lastName'],
                'email' => $user['email']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid credentials']);
    }
}
?>