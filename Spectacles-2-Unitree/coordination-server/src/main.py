import asyncio
import base64
import json
import logging
import os
import secrets
import time
from datetime import datetime

import aiohttp_jinja2
import jinja2
from aiohttp import web

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Client types
CLIENT_TYPE_ROBOT = "robot"
CLIENT_TYPE_SPECTACLES = "spectacles"

# Client connection statuses
STATUS_WAITING = "waiting"
STATUS_PAIRED = "paired"
STATUS_DISCONNECTED = "disconnected"


# Client and connection tracking
class Client:
    def __init__(self, ws, client_type, remote_addr):
        self.id = secrets.token_hex(8)  # Unique identifier
        self.ws = ws
        self.type = client_type
        self.remote_addr = remote_addr
        self.connected_at = datetime.now()
        self.paired_with: Client | None = None
        self.messages_received = 0
        self.messages_sent = 0
        self.last_ping_time = 0
        self.last_pong_time = 0
        self.latency_history: list[float] = []  # In milliseconds
        self.message_log: list[dict] = []  # Store recent messages
        self.max_log_size = 100  # Limit message log size

    @property
    def is_paired(self) -> bool:
        return self.paired_with is not None

    @property
    def avg_latency(self) -> float:
        if not self.latency_history:
            return 0
        return sum(self.latency_history) / len(self.latency_history)

    def log_message(self, message, direction, kind: str = "json"):
        """Log a message with direction ('in' or 'out')"""
        if len(self.message_log) >= self.max_log_size:
            self.message_log.pop(0)  # Remove oldest message

        self.message_log.append(
            {
                "timestamp": datetime.now().isoformat(),
                "direction": direction,
                "content": message,
                "kind": kind
            }
        )

    def to_dict(self):
        """Convert client to dictionary for templates"""
        return {
            "id": self.id,
            "type": self.type,
            "remote_addr": self.remote_addr,
            "connected_at": self.connected_at.isoformat(),
            "is_paired": self.is_paired,
            "paired_with": self.paired_with.id if self.is_paired else None,
            "paired_with_type": self.paired_with.type if self.is_paired else None,
            "messages_received": self.messages_received,
            "messages_sent": self.messages_sent,
            "avg_latency": f"{self.avg_latency:.2f}" if self.latency_history else "N/A",
        }


# Server state
clients: dict[str, Client] = {}  # id -> Client
unpaired_robots: set[str] = set()  # client ids
unpaired_spectacles: set[str] = set()  # client ids

# Get dashboard password from environment variable
DASHBOARD_PASSWORD = os.environ.get("DASHBOARD_PASSWORD", "admin")


# Authentication middleware
@web.middleware
async def auth_middleware(request, handler):
    # Skip auth for websocket, login routes, and static files
    if (
        request.path == "/ws"
        or request.path == "/login"
        or request.path.startswith("/static/")
    ):
        return await handler(request)

    # Check if user is authenticated
    if request.path != "/login":
        if not request.cookies.get("authenticated"):
            return web.HTTPFound("/login")

    return await handler(request)


# Force pairing handler
async def force_pair_handler(request):
    client_id = request.match_info["client_id"]

    if client_id not in clients:
        raise web.HTTPNotFound(text="Client not found")

    data = await request.post()
    pair_with_id = data.get("pair_with")

    if not pair_with_id or pair_with_id not in clients:
        return web.HTTPBadRequest(text="Invalid pairing client selected")

    client = clients[client_id]
    pair_with_client = clients[pair_with_id]

    # Check if either client is already paired
    if client.is_paired:
        return web.HTTPBadRequest(text="Client is already paired")

    if pair_with_client.is_paired:
        return web.HTTPBadRequest(text="Target client is already paired")

    # Remove from unpaired sets
    if client.type == CLIENT_TYPE_ROBOT:
        unpaired_robots.discard(client_id)
    else:
        unpaired_spectacles.discard(client_id)

    if pair_with_client.type == CLIENT_TYPE_ROBOT:
        unpaired_robots.discard(pair_with_id)
    else:
        unpaired_spectacles.discard(pair_with_id)

    # Pair them
    client.paired_with = pair_with_client
    pair_with_client.paired_with = client

    # Notify both clients
    asyncio.create_task(notify_client_paired(client, pair_with_client))
    asyncio.create_task(notify_client_paired(pair_with_client, client))

    logger.info(f"Manually paired {client_id} with {pair_with_id}")

    # Redirect back to the client details
    raise web.HTTPFound(f"/connection/{client_id}")


# Custom filter for base64 encoding binary data
def b64encode_filter(data):
    """Convert binary data to base64 encoded string for use in data URIs"""
    if isinstance(data, bytes):
        return base64.b64encode(data).decode("utf-8")
    return ""


# Setup the application
def create_app():
    app = web.Application(middlewares=[auth_middleware])

    # Setup Jinja2 templates
    jinja2_loader = jinja2.FileSystemLoader("templates")
    jinja2_env = aiohttp_jinja2.setup(app, loader=jinja2_loader)

    # Add custom filters
    jinja2_env.filters["b64encode"] = b64encode_filter

    # Add static route
    app.router.add_static("/static/", "static", name="static")

    # Add routes
    app.router.add_get("/", dashboard_handler)
    app.router.add_get("/login", login_get_handler)
    app.router.add_post("/login", login_post_handler)
    app.router.add_get("/logout", logout_handler)
    app.router.add_get("/connection/{client_id}", connection_details_handler)
    app.router.add_post("/connection/{client_id}/close", close_connection_handler)
    app.router.add_post(
        "/connection/{client_id}/force-pair", force_pair_handler
    )  # New route
    app.router.add_get("/ws", websocket_handler)

    # Task to measure latency
    app.on_startup.append(start_background_tasks)
    app.on_cleanup.append(cleanup_background_tasks)

    return app


# Try to pair clients when a new one connects
def try_pair_clients():
    # If we have both unpaired robots and spectacles, pair them
    if unpaired_robots and unpaired_spectacles:
        robot_id = next(iter(unpaired_robots))
        spectacles_id = next(iter(unpaired_spectacles))

        robot_client = clients.get(robot_id)
        spectacles_client = clients.get(spectacles_id)

        if robot_client and spectacles_client:
            # Pair them
            robot_client.paired_with = spectacles_client
            spectacles_client.paired_with = robot_client

            # Remove from unpaired sets
            unpaired_robots.remove(robot_id)
            unpaired_spectacles.remove(spectacles_id)

            logger.info(f"Paired robot {robot_id} with spectacles {spectacles_id}")

            # Notify both clients of successful pairing
            asyncio.create_task(notify_client_paired(robot_client, spectacles_client))
            asyncio.create_task(notify_client_paired(spectacles_client, robot_client))

            return True

    return False


# Notify client that it has been paired
async def notify_client_paired(client, paired_with):
    if not client.ws.closed:
        try:
            await client.ws.send_json(
                {
                    "type": "status_update",
                    "status": STATUS_PAIRED,
                    "message": f"You are now paired with a {paired_with.type} client",
                    "paired_with": {"id": paired_with.id, "type": paired_with.type},
                }
            )
        except Exception as e:
            logger.error(f"Error sending pairing notification to {client.id}: {e}")


# Notify client that its pair has disconnected
async def notify_client_unpaired(client, reason="The paired client has disconnected"):
    if not client.ws.closed:
        try:
            await client.ws.send_json(
                {
                    "type": "status_update",
                    "status": STATUS_WAITING,
                    "message": reason,
                    "client_id": client.id,
                }
            )
        except Exception as e:
            logger.error(f"Error sending unpairing notification to {client.id}: {e}")


# Helper function to unpair clients
async def unpair_clients(client1, client2, reason="Clients unpaired"):
    """Unpair two clients and notify both"""
    # Store IDs before unpairing
    client1_id = client1.id
    client2_id = client2.id

    # Reset paired status
    client1.paired_with = None
    client2.paired_with = None

    # Add back to unpaired sets
    if client1.type == CLIENT_TYPE_ROBOT:
        unpaired_robots.add(client1_id)
    else:
        unpaired_spectacles.add(client1_id)

    if client2.type == CLIENT_TYPE_ROBOT:
        unpaired_robots.add(client2_id)
    else:
        unpaired_spectacles.add(client2_id)

    # Notify both clients
    await notify_client_unpaired(client1, reason)
    await notify_client_unpaired(client2, reason)

    logger.info(f"Unpaired clients {client1_id} and {client2_id}: {reason}")


# Remove client from tracking
def remove_client(client_id):
    if client_id in clients:
        client = clients[client_id]

        # Remove from unpaired sets if present
        if client.type == CLIENT_TYPE_ROBOT and client_id in unpaired_robots:
            unpaired_robots.remove(client_id)
        elif client.type == CLIENT_TYPE_SPECTACLES and client_id in unpaired_spectacles:
            unpaired_spectacles.remove(client_id)

        # If paired, update the paired client and notify it
        if client.is_paired:
            paired_client = client.paired_with
            paired_client.paired_with = None

            # Add the paired client back to unpaired set
            if paired_client.type == CLIENT_TYPE_ROBOT:
                unpaired_robots.add(paired_client.id)
            else:
                unpaired_spectacles.add(paired_client.id)

            # Notify paired client of disconnection
            asyncio.create_task(notify_client_unpaired(paired_client))

        # Remove client
        del clients[client_id]
        logger.info(f"Removed client {client_id}")


# Background task to measure latency periodically
async def latency_measurement_task(app):
    while True:
        # For each paired connection, send a ping and measure round-trip time
        for client_id, client in list(clients.items()):
            if client.is_paired and not client.ws.closed:
                try:
                    # Send ping
                    ping_time = time.time() * 1000  # Milliseconds
                    client.last_ping_time = ping_time
                    ping_message = json.dumps({"type": "ping", "timestamp": ping_time})
                    await client.ws.send_str(ping_message)
                except Exception as e:
                    logger.error(f"Error sending ping to client {client_id}: {e}")

        await asyncio.sleep(5)  # Check every 5 seconds


# Start background tasks
async def start_background_tasks(app):
    app["latency_task"] = asyncio.create_task(latency_measurement_task(app))


# Cleanup background tasks
async def cleanup_background_tasks(app):
    app["latency_task"].cancel()
    try:
        await app["latency_task"]
    except asyncio.CancelledError:
        pass


# WebSocket handler
async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    remote_addr = request.remote
    client_id = None

    try:
        # Wait for client to identify itself
        msg = await ws.receive_json()

        if "type" not in msg or msg["type"] not in [
            CLIENT_TYPE_ROBOT,
            CLIENT_TYPE_SPECTACLES,
        ]:
            logger.warning(f"Client from {remote_addr} sent invalid type: {msg}")
            await ws.close(code=1008, message=b"Invalid client type")
            return ws

        client_type = msg["type"]

        # Create client object
        client = Client(ws, client_type, remote_addr)
        client_id = client.id
        clients[client_id] = client

        # Add to unpaired set
        if client_type == CLIENT_TYPE_ROBOT:
            unpaired_robots.add(client_id)
        else:
            unpaired_spectacles.add(client_id)

        logger.info(
            f"New {client_type} connection from {remote_addr}, assigned ID: {client_id}"
        )

        # Initial status - waiting for peer
        await ws.send_json(
            {
                "type": "status_update",
                "status": STATUS_WAITING,
                "message": f"Connected as {client_type}. Waiting for a peer to connect...",
                "client_id": client_id,
            }
        )

        # Try to pair with a waiting client
        try_pair_clients()

        # Main message processing loop
        async for msg in ws:
            if msg.type == web.WSMsgType.TEXT:
                try:
                    data = json.loads(msg.data)
                    client.messages_received += 1
                    client.log_message(data, "in")

                    # Handle ping/pong for latency measurement
                    if data.get("type") == "pong":
                        pong_time = time.time() * 1000
                        ping_time = data.get("ping_timestamp", 0)
                        if ping_time:
                            latency = pong_time - ping_time
                            client.latency_history.append(latency)
                            # Keep only the last 50 measurements
                            if len(client.latency_history) > 50:
                                client.latency_history.pop(0)

                    # Handle unpair request
                    elif data.get("type") == "unpair":
                        if client.is_paired:
                            paired_client = client.paired_with
                            await unpair_clients(
                                client, paired_client, "Client requested to unpair"
                            )
                            logger.info(
                                f"Client {client_id} requested to unpair from {paired_client.id}"
                            )

                    # If paired, relay message to the paired client
                    elif client.is_paired and not client.paired_with.ws.closed:
                        paired_client = client.paired_with

                        # Add relay information
                        relay_data = {
                            **data,
                            "relayed": True,
                            "source_client": client_id,
                        }

                        # Log outgoing message
                        paired_client.log_message(relay_data, "out")
                        paired_client.messages_sent += 1

                        await paired_client.ws.send_json(relay_data)

                except json.JSONDecodeError:
                    logger.warning(
                        f"Received non-JSON message from {client_id}: {msg.data}"
                    )

            elif msg.type == web.WSMsgType.BINARY:
                # Image data
                client.messages_received += 1
                client.log_message(msg.data, "in", "bytes")
                if client.is_paired and not client.paired_with.ws.closed:
                    paired_client = client.paired_with
                    paired_client.messages_sent += 1
                    paired_client.log_message(msg.data, "out", "bytes")
                    await paired_client.ws.send_bytes(msg.data)

            elif msg.type == web.WSMsgType.ERROR:
                logger.error(
                    f"WebSocket connection closed with error: {ws.exception()}"
                )
                break

    except Exception as e:
        logger.error(f"Error handling WebSocket connection: {e}")

    finally:
        # Clean up when connection closes
        if client_id:
            remove_client(client_id)

    return ws


# Dashboard handler
@aiohttp_jinja2.template("dashboard.html")
async def dashboard_handler(request):
    # Get all clients
    all_clients = [client.to_dict() for client in clients.values()]

    # Split by type and paired status
    unpaired_robot_clients = [
        c for c in all_clients if c["type"] == CLIENT_TYPE_ROBOT and not c["is_paired"]
    ]
    unpaired_spectacles_clients = [
        c
        for c in all_clients
        if c["type"] == CLIENT_TYPE_SPECTACLES and not c["is_paired"]
    ]
    paired_clients = [c for c in all_clients if c["is_paired"]]

    return {
        "unpaired_robots": unpaired_robot_clients,
        "unpaired_spectacles": unpaired_spectacles_clients,
        "paired_clients": paired_clients,
        "total_count": len(all_clients),
    }


# Connection details handler
@aiohttp_jinja2.template("connection_details.html")
async def connection_details_handler(request):
    client_id = request.match_info["client_id"]

    if client_id not in clients:
        raise web.HTTPNotFound(text="Client not found")

    client = clients[client_id]
    client_info = client.to_dict()

    # Add message log
    client_info["message_log"] = client.message_log

    # Find available clients for pairing
    available_clients = []
    if not client.is_paired:
        for cid, c in clients.items():
            # Only show unpaired clients of the opposite type
            if cid != client_id and not c.is_paired and c.type != client.type:
                available_clients.append(c.to_dict())

    return {"client": client_info, "available_clients": available_clients}


# Close connection handler
async def close_connection_handler(request):
    client_id = request.match_info["client_id"]

    if client_id not in clients:
        raise web.HTTPNotFound(text="Client not found")

    client = clients[client_id]

    # Check if paired and send notification to paired client first
    if client.is_paired:
        paired_client = client.paired_with
        await notify_client_unpaired(
            paired_client, "The paired client was closed by the server"
        )

    # Send close message to the closing client
    try:
        await client.ws.send_json(
            {
                "type": "status_update",
                "status": STATUS_DISCONNECTED,
                "message": "Connection closed by server",
            }
        )
        await client.ws.close()
    except Exception as e:
        logger.error(f"Error closing connection {client_id}: {e}")

    # Remove client
    remove_client(client_id)

    # Redirect back to dashboard
    raise web.HTTPFound("/")


# Login handlers
@aiohttp_jinja2.template("login.html")
async def login_get_handler(request):
    return {}


async def login_post_handler(request):
    data = await request.post()
    password = data.get("password", "")

    if password == DASHBOARD_PASSWORD:
        response = web.HTTPFound("/")
        response.set_cookie("authenticated", "true", max_age=3600)  # 1 hour
        return response

    # Incorrect password, show login page again with error
    context = {"error": "Invalid password"}
    return aiohttp_jinja2.render_template("login.html", request, context)


async def logout_handler(request):
    response = web.HTTPFound("/login")
    response.del_cookie("authenticated")
    return response


if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 80))
    web.run_app(app, host="0.0.0.0", port=port)
