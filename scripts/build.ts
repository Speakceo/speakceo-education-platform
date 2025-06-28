import { generateSitemap } from '../src/utils/generateSitemap';

async function build() {
  console.log('Generating sitemap...');
  generateSitemap();
  console.log('Sitemap generated successfully!');
}

build().catch(console.error); 