<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'config.php';

$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
    case 'GET':
        // Obține toate sarcinile
        $stmt = $pdo->prepare("SELECT * FROM tasks");
        $stmt->execute();
        $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($tasks);
        break;

    case 'POST':
        // Adaugă o sarcină nouă
        $data = json_decode(file_get_contents("php://input"));

        // Validare date
        if (empty($data->title)) {
            http_response_code(400);
            echo json_encode(['message' => 'Title is required']);
            exit();
        }

        $stmt = $pdo->prepare("INSERT INTO tasks (title, description, deadline) VALUES (?, ?, ?)");
        if ($stmt->execute([$data->title, $data->description, $data->deadline])) {
            echo json_encode(['id' => $pdo->lastInsertId(), 'title' => $data->title, 'description' => $data->description, 'deadline' => $data->deadline]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to add task']);
        }
        break;

    case 'PATCH':
        // Actualizează o sarcină
        $data = json_decode(file_get_contents("php://input"));

        // Verifică dacă ID-ul este setat
        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(['message' => 'Task ID is required']);
            exit();
        }

        $stmt = $pdo->prepare("UPDATE tasks SET title = ?, description = ?, deadline = ?, completed = ? WHERE id = ?");
        if ($stmt->execute([$data->title, $data->description, $data->deadline, $data->completed, $data->id])) {
            echo json_encode(['message' => 'Task updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update task']);
        }
        break;

        case 'DELETE':
            // Obține ID-ul sarcinii din URL
            $url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            $urlParts = explode('/', $url);
            $id = end($urlParts); // Obține ultimul element din URL, care ar trebui să fie ID-ul

            // Verifică dacă ID-ul este valid
            if (!is_numeric($id) || intval($id) <= 0) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid task ID']);
                exit();
            }

            // Șterge sarcina din baza de date
            $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
            if ($stmt->execute([$id])) {
                echo json_encode(['message' => 'Task deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Failed to delete task']);
            }
            break;

        default:
            // Metodă HTTP neacceptată
            http_response_code(405);
            echo json_encode(['message' => 'Method Not Allowed']);
            break;
}
?>