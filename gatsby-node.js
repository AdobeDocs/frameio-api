const express = require('express');
const generateLlmsTxt = require('./scripts/generate-llms-txt');

// Run on build
exports.onPreBootstrap = () => {
  generateLlmsTxt();
};

// Run on dev server
exports.onCreateDevServer = ({ app }) => {
    app.use(express.static('public'));
    generateLlmsTxt();
}
