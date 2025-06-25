# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Empire Art HP is a minimalist corporate website that embodies the philosophy "1人が100人分の価値を生む世界へ" (One person creates value of 100 people). This is a static HTML site without a build process, focusing on clean design and strategic content placement.

## Development Commands
Since this is a static HTML site, there are no build commands. To develop:
- Serve the site using any static file server (e.g., `python -m http.server 8000` or VS Code Live Server)
- Edit HTML/CSS files directly - changes are reflected immediately upon refresh

## Architecture and Structure

### File Organization
- `index.html` - Single page application with all sections
- `/css/style.css` - Main stylesheet using CSS custom properties for theming
- `/css/reset.css` - CSS reset for browser consistency
- `/assets/images/` - AI-generated images and company assets
- `/assets/videos/` - Promotional videos (MP4 format)
- `/content/data/` - YAML files documenting image requirements and AI prompts

### Design System
The site uses CSS custom properties defined in `:root` for consistent theming:
- Primary color: Navy (#1e2241)
- Secondary color: White (#ffffff)
- Fluid typography using `clamp()` for responsive sizing
- Font stack: 'Noto Sans JP', 'M PLUS 1p', 'Zen Kaku Gothic New', sans-serif

### Key Sections Structure
1. **Hero Section** (.hero) - Full viewport height with company tagline
2. **About Section** (.about) - Mission and three core values
3. **Services Section** (.services) - Three service categories
4. **Team Culture Section** (.team-culture) - "Quality over Quantity" philosophy
5. **Vision Section** (.vision) - Future outlook
6. **Contact Section** (.contact) - Simple contact information

## Important Context

### Company Mission
"すごいものを作って、ビックリさせる。" (Build the Remarkable) - This philosophy should guide all design and content decisions.

### Planned Features (from requirements.md)
- Scroll-triggered animations using Intersection Observer
- Logo drawing animation on page load
- Parallax scrolling effects
- Image lazy loading for performance
- WebP format conversion for images

### Content Management
Image specifications and AI prompts are documented in `/content/data/` - when updating images, refer to these YAML files for consistency with the brand vision.

### Performance Considerations
The site should maintain fast load times despite being image-heavy. Future implementations should include:
- Lazy loading for images below the fold
- WebP format with fallbacks
- Optimized video loading strategies

## Current Implementation Status
The basic static structure is complete. The next phase involves adding JavaScript for animations and interactive elements as specified in requirements.md.