/**
 * Script to generate llms.txt file from markdown content in src/pages
 * 
 * Following the guideline from https://llmstxt.org/#proposal
 * - Extracts content from markdown files
 * - Preserves markdown tables
 * - Adjusts heading levels appropriately
 * - Removes React/HTML components
 * - Creates an llms.txt file containing all content in the public directory
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Try to load dependencies, with fallbacks for testing environment
let matter, marked, JSDOM;
try {
  matter = require('gray-matter');
} catch (e) {
  console.warn('gray-matter not installed. Using simplified frontmatter parsing.');
  matter = content => {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { data: {}, content };
    try {
      const data = {};
      match[1].split('\n').forEach(line => {
        const [key, ...value] = line.split(':');
        if (key && value.length) {
          data[key.trim()] = value.join(':').trim();
        }
      });
      return { data, content: match[2] };
    } catch (e) {
      return { data: {}, content };
    }
  };
}

try {
  marked = require('marked');
} catch (e) {
  console.warn('marked not installed. Using simplified markdown processing.');
  marked = {
    parse: content => content,
    Renderer: function() {
      this.table = (header, body) => `\n${header}\n${body}\n`;
    }
  };
}

try {
  const jsdom = require('jsdom');
  JSDOM = jsdom.JSDOM;
} catch (e) {
  console.warn('jsdom not installed. Using simplified HTML processing.');
  JSDOM = class {
    constructor(html) {
      this.window = {
        document: {
          body: {
            textContent: html,
            querySelector: () => null,
            querySelectorAll: () => []
          }
        }
      };
    }
  };
}

/**
 * Cleans React/HTML components from markdown content
 * @param {string} content - Original markdown content
 * @returns {string} - Cleaned content without React/HTML components
 */
function cleanReactComponents(content) {
  if (!content) return '';
  
  // Remove React component blocks like <Hero slots="heading, text"/>
  content = content.replace(/<([A-Z][a-zA-Z]*)\s+[^>]*\/>/g, '');
  
  // Remove React component blocks with closing tags like <Hero slots="heading, text">...</Hero>
  content = content.replace(/<([A-Z][a-zA-Z]*)\s+[^>]*>[\s\S]*?<\/\1>/g, '');
  
  // Remove other HTML-like component blocks like <RedoclyAPIBlock ... />
  content = content.replace(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*\/>/g, '');
  
  // Remove blocks that might have content but we don't want to process
  content = content.replace(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*>[\s\S]*?<\/\1>/g, '');

  // Clean up additional empty lines that may have been created
  content = content.replace(/\n{3,}/g, '\n\n');
  
  return content.trim();
}

/**
 * Process markdown files to extract content
 * @param {string} file - Path to markdown file
 * @returns {Object} - Contains title, description, content, and URL
 */
function processMarkdownFile(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    // Get the title from frontmatter or filename
    const title = data.title || path.basename(file, '.md');
    
    // Get the description from frontmatter or first paragraph
    let description = data.description || '';
    if (!description) {
      const firstParagraph = markdownContent.split('\n\n')[0];
      if (firstParagraph && firstParagraph.length > 10) {
        description = firstParagraph.replace(/\n/g, ' ').trim();
      }
    }
    
    // Process the markdown content - clean React components
    let processedContent = cleanReactComponents(markdownContent);
    
    // Generate path info for reference
    const relativePath = file.replace('src/pages/', '');
    const url = `/${relativePath.replace(/\.md(x)?$/, '.html')}`;
    
    return {
      title,
      description,
      content: processedContent,
      url,
      relativePath
    };
  } catch (error) {
    console.error(`Error processing file ${file}:`, error);
    return null;
  }
}

/**
 * Adjusts heading levels in markdown content
 * @param {string} content - Original markdown content
 * @param {number} levelAdjustment - Number of levels to adjust headings (e.g., 1 means h1 becomes h2)
 * @returns {string} - Content with adjusted heading levels
 */
function adjustHeadingLevels(content, levelAdjustment) {
  if (!content || levelAdjustment <= 0) return content;
  
  // Replace headings with the adjusted level
  // This regex matches markdown headings (e.g., # Heading, ## Heading, etc.)
  return content.replace(/^(#{1,6})[ \t]+(.+)$/gm, (match, hashes, text) => {
    // Calculate the new heading level (add levelAdjustment)
    const newLevel = Math.min(hashes.length + levelAdjustment, 6);
    return '#'.repeat(newLevel) + ' ' + text;
  });
}

/**
 * Main function to process markdown files and generate llms.txt
 */
function generateLlmsTxt() {
  console.log('Generating llms.txt from markdown content...');
  
  // Create public directory if it doesn't exist
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }
  
  // Find all markdown files in src/pages
  const markdownFiles = glob.sync('src/pages/**/*.md?(x)');
  
  if (markdownFiles.length === 0) {
    console.warn('No markdown files found in src/pages.');
    return;
  }

  // Get main site information from index.md if it exists
  const indexFilePath = 'src/pages/index.md';
  let siteTitle = 'Frame.io API';
  let siteDescription = '';
  let indexContent = '';
  
  if (fs.existsSync(indexFilePath)) {
    const indexData = processMarkdownFile(indexFilePath);
    if (indexData) {
      siteTitle = indexData.title;
      siteDescription = indexData.description;
      indexContent = indexData.content;
    }
  }

  // Start building llms.txt content following the specification
  let llmsTxtContent = `# ${siteTitle}\n\n`;
  
  if (siteDescription) {
    llmsTxtContent += `> ${siteDescription}\n\n`;
  }
  
  // Add general project info 
  llmsTxtContent += `This file provides complete documentation from the Frame.io API in a format optimized for large language models (LLMs). It follows the llms.txt specification from https://llmstxt.org.\n\n`;
  
  // Add index content (if any) with proper heading adjustments
  if (indexContent) {
    llmsTxtContent += adjustHeadingLevels(indexContent, 1) + '\n\n';
  }
  
  // Organize files by directory for better structure
  const filesByCategory = {};
  
  // Process all markdown files
  markdownFiles.forEach(file => {
    // Skip index.md as we've already processed it
    if (file === indexFilePath) return;
    
    const fileData = processMarkdownFile(file);
    if (!fileData) return;
    
    // Skip files with no content after cleaning
    if (!fileData.content || fileData.content.trim().length === 0) {
      console.warn(`Skipping file with no content after cleaning: ${file}`);
      return;
    }
    
    const relativePath = fileData.relativePath;
    const directory = path.dirname(relativePath);
    const category = directory === '.' ? 'Main Pages' : directory;
    
    if (!filesByCategory[category]) {
      filesByCategory[category] = [];
    }
    
    filesByCategory[category].push(fileData);
    
    // Also generate the .md version of this file for reference from the llms.txt file
    generateMarkdownVersion(file, fileData);
  });
  
  // Add content sections by category
  Object.keys(filesByCategory).sort().forEach(category => {
    if (category === '.' || category === 'index.md') return;
    
    // Format category name
    const formattedCategory = category
      .split('/')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' / ');
    
    llmsTxtContent += `## ${formattedCategory}\n\n`;
    
    // Add full content from each file in this category
    filesByCategory[category].forEach(file => {
      // Add a section heading with the file title
      llmsTxtContent += `### ${file.title}\n\n`;
      
      // Add the file path as reference
      llmsTxtContent += `*Path: ${file.url}*\n\n`;
      
      // Add the full content with heading levels adjusted (h1->h4, h2->h5, etc.)
      const adjustedContent = adjustHeadingLevels(file.content, 3);
      llmsTxtContent += adjustedContent + '\n\n';
      
      // Add a separator between files
      llmsTxtContent += '---\n\n';
    });
  });
  
  // Write llms.txt to public directory
  fs.writeFileSync('public/llms.txt', llmsTxtContent, 'utf8');
  
  console.log(`Successfully generated public/llms.txt with content from ${markdownFiles.length} markdown files`);
}

/**
 * Generates a markdown version of a file for reference from the llms.txt file
 * @param {string} file - Path to the original markdown file
 * @param {object} fileData - Processed file data
 */
function generateMarkdownVersion(file, fileData) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    // Create the output path
    const relativePath = file.replace('src/pages/', '');
    const outputPath = path.join('public', relativePath.replace(/\.md(x)?$/, '.html.md'));
    
    // Create directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the markdown version with the original content
    // For the individual files, we'll preserve the React components
    const frontmatterStr = Object.entries(data)
      .map(([key, value]) => {
        // Handle multiline values or complex objects
        if (typeof value === 'object') {
          try {
            return `${key}: ${JSON.stringify(value)}`;
          } catch (e) {
            return `${key}: ${value}`;
          }
        }
        return `${key}: ${value}`;
      })
      .join('\n');
    
    const finalContent = `---\n${frontmatterStr}\n---\n\n${markdownContent}`;
    fs.writeFileSync(outputPath, finalContent, 'utf8');
    
  } catch (error) {
    console.error(`Error generating markdown version for ${file}:`, error);
  }
}

// Export the function to be used in gatsby-node.js
module.exports = generateLlmsTxt;

// Run the function if this script is executed directly
if (require.main === module) {
  generateLlmsTxt();
} 