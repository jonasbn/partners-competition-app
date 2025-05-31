#!/bin/bash

# Script to reinstall React dependencies with legacy peer deps flag
# Run this script when the terminal is available

echo "🔧 Fixing React module dependencies..."

# Navigate to project directory
cd /Users/jonasbn/develop/github-private/partners-competition-app

# Remove existing node_modules and lock file
echo "📦 Cleaning existing dependencies..."
rm -rf node_modules package-lock.json

# Reinstall all dependencies with legacy peer deps flag
echo "🔄 Reinstalling dependencies with --legacy-peer-deps..."
npm install --legacy-peer-deps

# Verify React installation
echo "✅ Checking React installation..."
npm list react react-dom

echo "🚀 Starting development server..."
npm start
