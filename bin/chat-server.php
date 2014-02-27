<?php

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use MyApp\Chat;

require dirname(__DIR__) . '/vendor/autoload.php';

$port = 23;

$chatServer = new Chat();
$wsServer = new WsServer($chatServer);
$httpServer = new HttpServer($wsServer);

$server = IoServer::factory($httpServer, $port);

$server->run();