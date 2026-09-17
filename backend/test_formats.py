import io
import zipfile
import base64
from pathlib import Path
import format_dispatch
import container_meta
import av_meta
import image_meta
from server import _clean_payload

formats = [
    # Images
    ("test.png", b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"),
    ("test.jpg", b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xbf\x00\xff\xd9"),
    ("test.webp", b"RIFF\x1a\x00\x00\x00WEBPVP8 \x0e\x00\x00\x00\xb0\x01\x00\x9d\x01* \x00 \x00\x00\x00"),
    ("test.bmp", b"BM\x3e\x00\x00\x00\x00\x00\x00\x00\x36\x00\x00\x00\x28\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x01\x00\x18\x00\x00\x00\x00\x00\x08\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xff\xff\x00"),
    ("test.gif", b"GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"),
    ("test.tiff", b"II*\x00\x08\x00\x00\x00\x00\x00"),
    ("test.svg", b"<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect width='10' height='10'/></svg>"),
    # Documents
    ("test.pdf", b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF\n"),
    ("test.html", b"<!DOCTYPE html><html><head><title>Test</title></head><body><h1>Hello</h1></body></html>"),
    ("test.md", b"# Test Markdown\n\nThis is a test."),
]

def make_docx():
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", b'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>')
        zf.writestr("word/document.xml", b'<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Hello Docx</w:t></w:r></w:p></w:body></w:document>')
        zf.writestr("docProps/core.xml", b'<?xml version="1.0"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:creator>Test AI</dc:creator></cp:coreProperties>')
    return buf.getvalue()

def make_xlsx():
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", b'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>')
        zf.writestr("xl/workbook.xml", b'<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"></workbook>')
        zf.writestr("docProps/core.xml", b'<?xml version="1.0"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"><dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">Test AI</dc:creator></cp:coreProperties>')
    return buf.getvalue()

def make_pptx():
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", b'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>')
        zf.writestr("ppt/presentation.xml", b'<?xml version="1.0"?><p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"></p:presentation>')
        zf.writestr("docProps/core.xml", b'<?xml version="1.0"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"><dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">Test AI</dc:creator></cp:coreProperties>')
    return buf.getvalue()

def make_epub():
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_STORED) as zf:
        zf.writestr("mimetype", b"application/epub+zip")
        zf.writestr("META-INF/container.xml", b'<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>')
        zf.writestr("content.opf", b'<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Test</dc:title></metadata></package>')
    return buf.getvalue()

def make_odt():
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_STORED) as zf:
        zf.writestr("mimetype", b"application/vnd.oasis.opendocument.text")
        zf.writestr("content.xml", b'<?xml version="1.0"?><office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"><office:body><office:text><p>Hello ODT</p></office:text></office:body></office:document-content>')
        zf.writestr("meta.xml", b'<?xml version="1.0"?><office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0"><office:meta><meta:generator>AI Tool</meta:generator></office:meta></office:document-meta>')
    return buf.getvalue()

formats.append(("test.docx", make_docx()))
formats.append(("test.xlsx", make_xlsx()))
formats.append(("test.pptx", make_pptx()))
formats.append(("test.epub", make_epub()))
formats.append(("test.odt", make_odt()))

# AV formats
formats.append(("test.wav", b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00\x88\x58\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"))
formats.append(("test.mp3", b"ID3\x03\x00\x00\x00\x00\x00\nTIT2\x00\x00\x00\x02\x00\x00\x00A\xff\xfb\x90\x64\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"))
formats.append(("test.flac", b"fLaC\x00\x00\x00\"\x10\x00\x10\x00\x00\x00\x00\x00\x00\x00\x0b\xb8\x01p\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"))
formats.append(("test.mp4", b"\x00\x00\x00\x1cftypisom\x00\x00\x02\x00isomiso2mp41\x00\x00\x00\x08free\x00\x00\x00\x08mdat"))
formats.append(("test.mov", b"\x00\x00\x00\x14ftypqt  \x20\x05\x03\x00qt  \x00\x00\x00\x08free\x00\x00\x00\x08mdat"))
formats.append(("test.m4a", b"\x00\x00\x00\x1cftypM4A \x00\x00\x00\x00M4A mp42isom\x00\x00\x00\x08free\x00\x00\x00\x08mdat"))
formats.append(("test.m4v", b"\x00\x00\x00\x1cftypM4V \x00\x00\x00\x00M4V M4A mp42\x00\x00\x00\x08free\x00\x00\x00\x08mdat"))

print(f"{'Filename':<12} | {'Kind':<10} | {'Clean Status':<20} | {'Out Size'}")
print("-" * 60)

for name, data in formats:
    try:
        res = _clean_payload(data, name, {"strip_all_metadata": True})
        cleaned_bytes = base64.b64decode(res["cleaned"])
        status = f"OK ({res['kind']})"
        size_str = f"{len(cleaned_bytes)} B"
    except Exception as e:
        status = f"ERR: {str(e)[:30]}"
        size_str = "-"
    print(f"{name:<12} | {format_dispatch.classify_bytes(data, Path(name).suffix):<10} | {status:<20} | {size_str}")
