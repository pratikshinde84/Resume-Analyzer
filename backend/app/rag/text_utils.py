import re

def sanitize_text(text: str | None) -> str | None:
    """Removes PostgreSQL-illegal NUL bytes and stray control characters from text."""
    if text is None:
        return None
    # Remove NUL bytes explicitly
    text = text.replace("\x00", "")
    # Strip other control characters except \n, \t, \r
    text = "".join(c for c in text if c in ("\n", "\t", "\r") or ord(c) >= 32)
    return text
