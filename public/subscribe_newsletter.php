<?php
// Workshift Newsletter Subscription – adds contacts via Brevo Contacts API
// Security: rate limiting, CORS whitelist, input validation

// ─── CORS ────────────────────────────────────────────────────────────
$allowed_origins = ['https://workshift.pl', 'https://www.workshift.pl'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Method guard
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Metoda nieobsługiwana"]);
    exit;
}

// ─── RATE LIMITING (5 req/min per IP) ────────────────────────────────
$rate_dir = sys_get_temp_dir() . '/workshift_rate_nl';
if (!is_dir($rate_dir)) { @mkdir($rate_dir, 0700, true); }
$ip_hash = md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rate_file = "$rate_dir/$ip_hash.txt";
$now = time();
$window = 60;
$max_requests = 5;

$requests = [];
if (file_exists($rate_file)) {
    $requests = array_filter(
        explode("\n", file_get_contents($rate_file)),
        fn($ts) => $ts && ($now - (int)$ts) < $window
    );
}
if (count($requests) >= $max_requests) {
    http_response_code(429);
    echo json_encode(["error" => "Zbyt wiele zapytań. Spróbuj za chwilę."]);
    exit;
}
$requests[] = $now;
file_put_contents($rate_file, implode("\n", $requests), LOCK_EX);

// ─── CONFIGURATION ──────────────────────────────────────────────────
$brevo_api_key = getenv('BREVO_API_KEY');

// Load from local config if environment variable is not set
if (!$brevo_api_key && file_exists(__DIR__ . '/config.env.php')) {
    $config = require __DIR__ . '/config.env.php';
    $brevo_api_key = $config['BREVO_API_KEY'] ?? null;
}

// ─── INPUT VALIDATION ───────────────────────────────────────────────
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || empty($data['email']) || empty($data['name']) || !isset($data['listId'])) {
    http_response_code(400);
    echo json_encode(["error" => "Brakuje wymaganych danych."]);
    exit;
}

$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Niepoprawny adres e-mail."]);
    exit;
}

$name = mb_substr(htmlspecialchars(strip_tags(trim($data['name'])), ENT_QUOTES, 'UTF-8'), 0, 100);
$listId = (int)$data['listId'];

// Whitelist allowed list IDs to prevent abuse
$allowed_lists = [2, 3, 4, 5]; // Update with your actual Brevo list IDs
if (!in_array($listId, $allowed_lists, true)) {
    http_response_code(400);
    echo json_encode(["error" => "Nieprawidłowa lista."]);
    exit;
}

// ─── SUBSCRIBE VIA BREVO ─────────────────────────────────────────────
$postData = [
    "email" => $email,
    "attributes" => ["FIRSTNAME" => $name],
    "listIds" => [$listId],
    "updateEnabled" => true
];

$ch = curl_init("https://api.brevo.com/v3/contacts");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($postData),
    CURLOPT_TIMEOUT => 10,
    CURLOPT_HTTPHEADER => [
        "accept: application/json",
        "api-key: " . $brevo_api_key,
        "content-type: application/json"
    ],
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

if ($curl_error) {
    http_response_code(502);
    echo json_encode(["error" => "Błąd połączenia z serwerem."]);
    exit;
}

if ($httpcode >= 200 && $httpcode < 300) {
    echo json_encode(["success" => true, "message" => "Zapisano pomyślnie."]);
} else {
    http_response_code(500);
    error_log("Brevo Contacts API error ($httpcode): $response");
    echo json_encode(["error" => "Błąd zapisu. Spróbuj ponownie."]);
}
?>
