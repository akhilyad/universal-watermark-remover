import urllib.request
import json
import base64

svg_content = b"""<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
<metadata>C2PA test</metadata>
<rect width="200" height="200" fill="#111"/>
<text class="watermark" x="50" y="100">WATERMARK SAMPLE</text>
</svg>"""

data = json.dumps({
    'file': base64.b64encode(svg_content).decode(),
    'name': 'graphic.svg',
    'options': {}
}).encode()

req = urllib.request.Request('http://127.0.0.1:8000/clean', data=data, headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req) as resp:
    res = json.loads(resp.read())
    print('SVG clean response:', res['ok'], res['kind'], res['report']['actions'])
    cleaned_svg = base64.b64decode(res['cleaned']).decode()
    print('Cleaned SVG contains WATERMARK?', 'WATERMARK' in cleaned_svg)
