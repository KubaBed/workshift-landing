<?php
// Workshift Contact Form – sends messages via Brevo Transactional API
// Security: rate limiting, CORS whitelist, input validation, no API key exposure

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

// ─── RATE LIMITING (simple file-based, 5 req/min per IP) ─────────────
$rate_dir = sys_get_temp_dir() . '/workshift_rate';
if (!is_dir($rate_dir)) { @mkdir($rate_dir, 0700, true); }
$ip_hash = md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rate_file = "$rate_dir/$ip_hash.txt";
$now = time();
$window = 60; // seconds
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

if (!$brevo_api_key) {
    // In production, you might want to log this or return a generic error
    // For now we just proceed, but the request will likely fail at the Brevo API call stage
}

$to_email = "kontakt@workshift.pl";
$sender_email = "kontakt@workshift.pl";
$sender_name = "Formularz Workshift";

// ─── INPUT VALIDATION ───────────────────────────────────────────────
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || empty($data['email']) || empty($data['name']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(["error" => "Brakuje wymaganych pól (imię, email, wiadomość)."]);
    exit;
}

$name = mb_substr(htmlspecialchars(strip_tags(trim($data['name'])), ENT_QUOTES, 'UTF-8'), 0, 100);
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$company = !empty($data['company'])
    ? mb_substr(htmlspecialchars(strip_tags(trim($data['company'])), ENT_QUOTES, 'UTF-8'), 0, 200)
    : 'brak';
$message = mb_substr(htmlspecialchars(strip_tags(trim($data['message'])), ENT_QUOTES, 'UTF-8'), 0, 5000);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Nieprawidłowy adres e-mail."]);
    exit;
}

if (strlen($name) < 2 || strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(["error" => "Imię (min. 2 znaki) i wiadomość (min. 10 znaków) są wymagane."]);
    exit;
}

// ─── SEND VIA BREVO ─────────────────────────────────────────────────
$postData = [
    "sender" => ["name" => $sender_name, "email" => $sender_email],
    "to" => [["email" => $to_email, "name" => "Workshift Inbox"]],
    "replyTo" => ["email" => $email, "name" => $name],
    "subject" => "Nowe zapytanie ze strony: " . $name . ($company !== 'brak' ? " (Firma: $company)" : ""),
    "htmlContent" => "<h3>Nowa wiadomość z formularza kontaktowego Workshift</h3>
                      <p><strong>Imię:</strong> {$name}</p>
                      <p><strong>Email klienta:</strong> {$email}</p>
                      <p><strong>Firma:</strong> {$company}</p>
                      <hr />
                      <p><strong>Wiadomość:</strong></p>
                      <p>" . nl2br($message) . "</p>"
];

$ch = curl_init("https://api.brevo.com/v3/smtp/email");
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
    echo json_encode(["error" => "Błąd połączenia z serwerem email."]);
    exit;
}

if ($httpcode >= 200 && $httpcode < 300) {
    echo json_encode(["success" => true, "message" => "Otrzymaliśmy zapytanie. Dziękujemy!"]);
} else {
    http_response_code(500);
    // Don't leak API details to client
    error_log("Brevo API error ($httpcode): $response");
    echo json_encode(["error" => "Wystąpił błąd przy wysyłaniu. Spróbuj ponownie lub napisz na kontakt@workshift.pl."]);
}
?>
