#!/bin/bash

# Clear Vite cache directories
echo "Clearing Vite cache..."
rm -rf .vite
rm -rf node_modules/.vite
rm -rf dist
rm -f .vite.zip

echo "Cache cleared successfully!"
