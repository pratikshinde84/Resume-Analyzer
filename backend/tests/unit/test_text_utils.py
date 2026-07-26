import pytest
from app.rag.text_utils import sanitize_text

def test_sanitize_text_none():
    assert sanitize_text(None) is None

def test_sanitize_text_nul_bytes():
    raw = "Hello\x00World\x00!"
    assert sanitize_text(raw) == "HelloWorld!"

def test_sanitize_text_control_characters():
    # \n, \t, \r should be preserved; \x01, \x02, \x08, \x00 should be stripped
    raw = "Header\n\tSubtext:\x00\x01\x02 \rBody text\x07."
    expected = "Header\n\tSubtext: \rBody text."
    assert sanitize_text(raw) == expected

def test_sanitize_text_marathi_unicodes():
    raw = "मराठी\x00 दस्ता\x00ऐवज"
    expected = "मराठी दस्ताऐवज"
    assert sanitize_text(raw) == expected
