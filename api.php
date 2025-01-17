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

$request_method = $_SERVER['REQUEST_METHOD'];


// api.php
if ($request_method === "GET") {
    // Verifică dacă există un parametru ID în cerere
    $userId = isset($_GET['id']) ? intval($_GET['id']) : null;

    if ($userId) {
        try {
            // Execută interogarea pentru a obține utilizatorul pe baza ID-ului
            $stmt = $pdo->prepare("SELECT ID, firstName, lastName FROM users WHERE ID = :id");
            $stmt->bindParam(':id', $userId);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC); // Obține utilizatorul

            if ($user) {
                echo json_encode($user); // Returnează utilizatorul în format JSON
            } else {
                http_response_code(404); // Utilizatorul nu a fost găsit
                echo json_encode(["message" => "User not found"]);
            }
        } catch (PDOException $e) {
            http_response_code(500); // Eroare server
            echo json_encode(["message" => "Error fetching user: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400); // Cerere invalidă
        echo json_encode(["message" => "User ID is required"]);
    }
}
?>