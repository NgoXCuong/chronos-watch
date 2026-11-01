"""Collect manufacturer evidence for the catalog seed; no database writes."""
import concurrent.futures
import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
DEST = ROOT / 'docs/catalog-import'


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text, self.images, self.meta = [], [], {}
        self.hidden = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style'):
            self.hidden += 1
        if tag == 'meta':
            self.meta[attrs.get('property', attrs.get('name', ''))] = attrs.get('content', '')
        if tag == 'img':
            self.images.append(attrs)

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.hidden = max(0, self.hidden - 1)

    def handle_data(self, data):
        if not self.hidden and data.strip():
            self.text.append(' '.join(data.split()))


MODELS = []
for family, codes in [
    ('casio', ['MTP-V001D-1B', 'MTP-V002D-1B', 'MTP-1302D-2A2V', 'AE-1200WHD-1A', 'F-91W-1', 'A168WA-1']),
    ('gshock', ['DW-5600UE-1', 'GA-2100-1A1']),
    ('edifice', ['EFV-100D-1AV']),
    ('babyg', ['BGD-565-1']),
]:
    MODELS.extend((code, f'https://www.casio.com/intl/watches/{family}/product.{code}/') for code in codes)
MODELS.extend((code, f'https://www.seikowatches.com/us-en/products/5sports/{code.lower()}')
              for code in ['SRPD55', 'SRPD51', 'SRPD53', 'SRPD57', 'SRPD59', 'SSK001', 'SSK003', 'SRPE51', 'SRPE53', 'SRPG35'])
MODELS.extend((code, f'https://www.tissotwatches.com/en-us/{code}.html') for code in
              ['T1374101104100', 'T1374101105100', 'T1374101103100', 'T1374071104100', 'T1374071105100'])
MODELS.extend((code, f'https://www.hamiltonwatch.com/en-int/{code.lower()}-khaki-field.html') for code in
              ['H69439931', 'H69439411', 'H70455533', 'H70455133', 'H70555533'])


def collect(item):
    code, url = item
    try:
        with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=35) as response:
            html = response.read().decode('utf-8')
        page = Page()
        page.feed(html)
        result = {'model': code, 'url': url, 'meta': page.meta, 'images': page.images, 'text': page.text}
        (DEST / f'{code}.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
        return f'{code}: OK ({len(page.text)} text blocks)'
    except Exception as error:
        return f'{code}: ERROR {error}'


if __name__ == '__main__':
    DEST.mkdir(parents=True, exist_ok=True)
    if '--retry' in sys.argv:
        MODELS = [(code, url.replace('/intl/', '/sg/')) for code, url in MODELS[:10]]
        MODELS += [(code, f'https://www.seikowatches.com/us-en/products/5sports/{code.lower()}')
                   for code in ['SSK023', 'SRPJ85', 'SSK033']]
        MODELS += [(code, f'https://www.tissotwatches.com/en-us/{code}.html') for code in
                   ['T1372101104100', 'T1372101103100', 'T1372071104100', 'T0064071103300', 'T1274071104100']]
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        for result in executor.map(collect, MODELS):
            print(result, flush=True)
