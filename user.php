<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'config.php';

$request_method = $_SERVER['REQUEST_METHOD'];

// Include biblioteca JWT
require 'vendor/autoload.php'; // Asigură-te că ai autoloader-ul corect
use \Firebase\JWT\JWT; // Asigură-te că folosești corect namespace-ul

// Verifică token-ul de autentificare
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401); // Unauthorized
    echo json_encode(['message' => 'Unauthorized']);
    exit();
}

$token = $matches[1];

// Decodifică token-ul pentru a obține ID-ul utilizatorului
$userId = getUserIdFromToken($token); // Acum funcția returnează un ID valid sau null

if ($userId) {
    // Obține utilizatorul din baza de date
    $stmt = $pdo->prepare("SELECT firstName, lastName, email FROM users WHERE id = :id");
    $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($user); // Returnează informațiile utilizatorului
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'User not found']);
    }
} else {
    http_response_code(401); // Unauthorized
    echo json_encode(['message' => 'Invalid token']);
}

// Funcție pentru decodificarea token-ului
function getUserIdFromToken($token) {
    // Decodifică token-ul (presupunând că este un JWT)
    try {
        $secretKey = 'your_secret_key'; // Schimbă cu cheia ta reală
        $decoded = JWT::decode($token, new \Firebase\JWT\Key($secretKey, 'HS256'));
        return $decoded->id; // Asigură-te că ID-ul utilizatorului este în payload
    } catch (Exception $e) {
        return null; // Returnează null în caz de eroare
    }
}
?>