"""
Zynx Evidence Gate - Step 3
Validates and cites information sources for context awareness
"""

import asyncio
import aiohttp
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from loguru import logger
import json
import hashlib

class EvidenceGate:
    """Evidence validation and citation system"""
    
    def __init__(self):
        self.citation_cache = {}
        self.source_verification = {
            "arxiv.org": self._verify_arxiv,
            "medium.com": self._verify_medium,
            "stackoverflow.com": self._verify_stackoverflow,
            "github.com": self._verify_github,
            "milvus.io": self._verify_milvus,
            "onetrust.com": self._verify_onetrust
        }
    
    async def validate_source(self, url: str) -> Tuple[bool, Dict]:
        """Validate information source and extract metadata"""
        try:
            domain = self._extract_domain(url)
            verifier = self.source_verification.get(domain, self._verify_generic)
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=10) as response:
                    if response.status == 200:
                        content = await response.text()
                        metadata = await verifier(session, url, content)
                        return True, metadata
                    else:
                        return False, {"error": f"HTTP {response.status}"}
                        
        except Exception as e:
            logger.error(f"Source validation failed for {url}: {str(e)}")
            return False, {"error": str(e)}
    
    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL"""
        from urllib.parse import urlparse
        return urlparse(url).netloc
    
    async def _verify_arxiv(self, session: aiohttp.ClientSession, url: str, content: str) -> Dict:
        """Verify ArXiv paper"""
        return {
            "type": "academic_paper",
            "source": "arxiv.org",
            "title": self._extract_title(content),
            "authors": self._extract_authors(content),
            "date": self._extract_date(content),
            "doi": self._extract_doi(content),
            "verification_level": "high"
        }
    
    async def _verify_medium(self, session: aiohttp.ClientSession, url: str, content: str) -> Dict:
        """Verify Medium article"""
        return {
            "type": "blog_article",
            "source": "medium.com",
            "title": self._extract_title(content),
            "author": self._extract_author(content),
            "date": self._extract_date(content),
            "verification_level": "medium"
        }
    
    async def _verify_stackoverflow(self, session: aiohttp.ClientSession, url: str, content: str) -> Dict:
        """Verify StackOverflow answer"""
        return {
            "type": "community_answer",
            "source": "stackoverflow.com",
            "title": self._extract_title(content),
            "author": self._extract_author(content),
            "votes": self._extract_votes(content),
            "verification_level": "medium"
        }
    
    async def _verify_github(self, session: aiohttp.ClientSession, url: str, content: str) -> Dict:
        """Verify GitHub repository"""
        return {
            "type": "code_repository",
            "source": "github.com",
            "title": self._extract_title(content),
            "stars": self._extract_stars(content),
            "license": self._extract_license(content),
            "verification_level": "high"
        }
    
    async def _verify_milvus(self, session: aiohttp.ClientSession, url: str, content: str) -> Dict:
        """Verify Milvus documentation"""
        return {
            "type": "technical_documentation",
            "source": "milvus.io",
            "title": self._extract_title(content),
            "verification_level": "high"
        }
    
    async def _verify_onetrust(self, session: aiohttp.ClientSession, url: str, content: str) -> Dict:
        """Verify OneTrust compliance resource"""
        return {
            "type": "compliance_guide",
            "source": "onetrust.com",
            "title": self._extract_title(content),
            "date": self._extract_date(content),
            "verification_level": "high"
        }
    
    async def _verify_generic(self, session: aiohttp.ClientSession, url: str, content: str) -> Dict:
        """Generic verification for unknown sources"""
        return {
            "type": "web_page",
            "source": self._extract_domain(url),
            "title": self._extract_title(content),
            "verification_level": "low"
        }
    
    def _extract_title(self, content: str) -> str:
        """Extract title from HTML content"""
        import re
        title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
        return title_match.group(1) if title_match else "Unknown Title"
    
    def _extract_author(self, content: str) -> str:
        """Extract author information"""
        import re
        # Various author extraction patterns
        patterns = [
            r'author["\']?\s*:\s*["\']([^"\']+)["\']',
            r'by\s+([A-Za-z\s]+)',
            r'Author:\s*([A-Za-z\s]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return "Unknown Author"
    
    def _extract_authors(self, content: str) -> List[str]:
        """Extract multiple authors"""
        author = self._extract_author(content)
        return [author] if author != "Unknown Author" else []
    
    def _extract_date(self, content: str) -> str:
        """Extract publication date"""
        import re
        date_patterns = [
            r'(\d{4}-\d{2}-\d{2})',
            r'(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})',
            r'(\d{1,2}/\d{1,2}/\d{4})'
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, content)
            if match:
                return match.group(1)
        return "Unknown Date"
    
    def _extract_doi(self, content: str) -> str:
        """Extract DOI from content"""
        import re
        doi_match = re.search(r'10\.\d{4,}/[^\s]+', content)
        return doi_match.group(0) if doi_match else ""
    
    def _extract_votes(self, content: str) -> int:
        """Extract vote count from StackOverflow"""
        import re
        vote_match = re.search(r'(\d+)\s+votes?', content, re.IGNORECASE)
        return int(vote_match.group(1)) if vote_match else 0
    
    def _extract_stars(self, content: str) -> int:
        """Extract star count from GitHub"""
        import re
        star_match = re.search(r'(\d+(?:,\d+)*)\s+stars?', content, re.IGNORECASE)
        if star_match:
            return int(star_match.group(1).replace(',', ''))
        return 0
    
    def _extract_license(self, content: str) -> str:
        """Extract license information"""
        import re
        license_patterns = [
            r'license["\']?\s*:\s*["\']([^"\']+)["\']',
            r'License:\s*([A-Za-z0-9\s]+)',
            r'MIT License',
            r'Apache License',
            r'GPL License'
        ]
        
        for pattern in license_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                return match.group(1) if len(match.groups()) > 0 else match.group(0)
        return "Unknown License"
    
    def generate_citation(self, metadata: Dict) -> str:
        """Generate formatted citation"""
        if metadata["type"] == "academic_paper":
            authors = ", ".join(metadata.get("authors", []))
            doi = metadata.get("doi", "")
            return f"{authors} ({metadata.get('date', 'Unknown Date')}). {metadata.get('title', 'Unknown Title')}. {doi}"
        elif metadata["type"] == "blog_article":
            return f"{metadata.get('author', 'Unknown Author')} ({metadata.get('date', 'Unknown Date')}). {metadata.get('title', 'Unknown Title')}. Medium."
        else:
            return f"{metadata.get('title', 'Unknown Title')} ({metadata.get('date', 'Unknown Date')}). {metadata.get('source', 'Unknown Source')}."
    
    def create_evidence_hash(self, url: str, metadata: Dict) -> str:
        """Create hash for evidence tracking"""
        content = f"{url}{json.dumps(metadata, sort_keys=True)}"
        return hashlib.sha256(content.encode()).hexdigest()[:16]

# Global evidence gate instance
evidence_gate = EvidenceGate()

async def validate_evidence_sources(sources: List[str]) -> Dict[str, Dict]:
    """Validate multiple evidence sources"""
    results = {}
    
    for source in sources:
        logger.info(f"Validating source: {source}")
        is_valid, metadata = await evidence_gate.validate_source(source)
        
        if is_valid:
            citation = evidence_gate.generate_citation(metadata)
            evidence_hash = evidence_gate.create_evidence_hash(source, metadata)
            
            results[source] = {
                "valid": True,
                "metadata": metadata,
                "citation": citation,
                "evidence_hash": evidence_hash,
                "timestamp": datetime.now().isoformat()
            }
        else:
            results[source] = {
                "valid": False,
                "error": metadata.get("error", "Unknown error"),
                "timestamp": datetime.now().isoformat()
            }
    
    return results

if __name__ == "__main__":
    # Test evidence validation
    test_sources = [
        "https://arxiv.org/abs/2507.00586",
        "https://medium.com/@hexshift/scaling-fastapi-websockets-with-background-tasks-0f8aab94dad7",
        "https://stackoverflow.com/questions/60152922/proper-way-of-using-react-hooks-websockets"
    ]
    
    async def test():
        results = await validate_evidence_sources(test_sources)
        print(json.dumps(results, indent=2))
    
    asyncio.run(test())