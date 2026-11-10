#!/usr/bin/env python3
"""Serve the static academy app locally; application data stays in Supabase."""

import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def run_server(port=3000):
    os.chdir(BASE_DIR)
    address = ("127.0.0.1", port)
    httpd = HTTPServer(address, SimpleHTTPRequestHandler)
    print(f"Trinity Academy static server: http://{address[0]}:{port}")
    httpd.serve_forever()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
    run_server(port)
