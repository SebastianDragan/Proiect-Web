<?php
header('Content-Type: application/json');

// Simularea datelor dintr-o bază de date
$tasks = [
    ['id' => 1, 'completed' => true, 'deadline' => '2023-01-01'],
    ['id' => 2, 'completed' => false, 'deadline' => '2025-12-01'],
    ['id' => 3, 'completed' => false, 'deadline' => '2022-01-01'],
];

// Calculează numărul de taskuri în funcție de status
$completedTasks = 0;
$futureTasks = 0;
$pastTasks = 0;

foreach ($tasks as $task) {
    if ($task['completed']) {
        $completedTasks++;
    } elseif (strtotime($task['deadline']) > time()) {
        $futureTasks++;
    } else {
        $pastTasks++;
    }
}

// Creează un array pentru a returna datele
$data = [
    'completed' => $completedTasks,
    'future' => $futureTasks,
    'past' => $pastTasks,
];

echo json_encode($data);
?>